import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { CAMPUS_MEETUPS, CONDITION_OPTIONS } from '../utils/helpers';
import { getPdfViewUrl } from '../utils/media';

const TYPES = [
  { value: 'book', label: 'Book (sell)' },
  { value: 'note', label: 'Notes' },
  { value: 'question_paper', label: 'Question Paper' },
  { value: 'giveaway', label: 'Giveaway (free)' },
];

export default function CreateListing() {
  const { user, token } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    type: 'book',
    title: '',
    author: '',
    isbn: '',
    courseCode: '',
    description: '',
    price: '',
    condition: 'good',
    meetupPoint: CAMPUS_MEETUPS[0],
  });
  const [images, setImages] = useState([]);
  const [documentUrl, setDocumentUrl] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [suggestedPrice, setSuggestedPrice] = useState(null);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!token) {
    navigate('/login');
    return null;
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function lookupISBN() {
    if (!form.isbn) return;
    try {
      const { data } = await api.get(`/items/lookup/isbn/${form.isbn}`);
      update('title', data.title);
      update('author', data.author);
      setOriginalPrice(data.originalPrice);
      if (data.image) setImages([data.image]);
      await updateSuggested(data.originalPrice, form.condition);
    } catch {
      setError('ISBN not found. Enter details manually.');
    }
  }

  async function updateSuggested(mrp, condition) {
    if (!mrp) return;
    const { data } = await api.post('/items/price-suggest', {
      originalPrice: mrp,
      condition,
    });
    setSuggestedPrice(data.suggestedPrice);
    update('price', String(data.suggestedPrice));
  }

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));

    setUploadingImages(true);
    setError('');
    try {
      const { data } = await api.post('/upload/images', formData);
      if (!data.urls?.length) {
        setError('Upload returned no image URLs');
        return;
      }
      setImages((prev) => [...prev, ...data.urls]);
    } catch (err) {
      setError(err.response?.data?.message || 'Image upload failed');
    } finally {
      setUploadingImages(false);
      e.target.value = '';
    }
  }

  async function handleDocUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploadingDoc(true);
    setError('');
    try {
      const { data } = await api.post('/upload/document', formData);
      setDocumentUrl(data.url);
      setDocumentName(file.name);
    } catch (err) {
      setError(err.response?.data?.message || 'Document upload failed');
    } finally {
      setUploadingDoc(false);
      e.target.value = '';
    }
  }

  function removeImage(index) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...form,
        price: form.type === 'giveaway' ? 0 : Number(form.price),
        originalPrice,
        images,
        documentUrl,
        courseCode: form.courseCode.toUpperCase(),
      };

      const { data } = await api.post('/items', payload);
      navigate(`/item/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-1">List an item</h1>
      <p className="text-sm text-muted mb-8">
        Logged in as {user?.name} · Sem {user?.semester}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{error}</p>
        )}

        <div>
          <label className="block text-sm mb-1.5">Type</label>
          <select
            value={form.type}
            onChange={(e) => update('type', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-surface text-sm"
          >
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {form.type === 'book' && (
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm mb-1.5">ISBN</label>
              <input
                value={form.isbn}
                onChange={(e) => update('isbn', e.target.value)}
                placeholder="978..."
                className="w-full px-3 py-2 border border-border rounded-md bg-surface text-sm"
              />
            </div>
            <button
              type="button"
              onClick={lookupISBN}
              className="self-end px-4 py-2 text-sm border border-border rounded-md hover:bg-stone-50"
            >
              Lookup
            </button>
          </div>
        )}

        <div>
          <label className="block text-sm mb-1.5">Title</label>
          <input
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            required
            className="w-full px-3 py-2 border border-border rounded-md bg-surface text-sm"
          />
        </div>

        {(form.type === 'book' || form.type === 'giveaway') && (
          <div>
            <label className="block text-sm mb-1.5">Author</label>
            <input
              value={form.author}
              onChange={(e) => update('author', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-surface text-sm"
            />
          </div>
        )}

        <div>
          <label className="block text-sm mb-1.5">Course code</label>
          <input
            value={form.courseCode}
            onChange={(e) => update('courseCode', e.target.value)}
            placeholder="CS201"
            className="w-full px-3 py-2 border border-border rounded-md bg-surface text-sm"
          />
        </div>

        {form.type !== 'giveaway' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1.5">Condition</label>
              <select
                value={form.condition}
                onChange={async (e) => {
                  update('condition', e.target.value);
                  await updateSuggested(originalPrice, e.target.value);
                }}
                className="w-full px-3 py-2 border border-border rounded-md bg-surface text-sm"
              >
                {CONDITION_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1.5">Price (₹)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => update('price', e.target.value)}
                min="0"
                className="w-full px-3 py-2 border border-border rounded-md bg-surface text-sm"
              />
              {suggestedPrice && (
                <p className="text-xs text-muted mt-1">Fair price: ₹{suggestedPrice}</p>
              )}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-md bg-surface text-sm resize-none"
          />
        </div>

        {(form.type === 'book' || form.type === 'giveaway') && (
          <>
            <div>
              <label className="block text-sm mb-1.5">Photos</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                multiple
                onChange={handleImageUpload}
                className="text-sm"
              />
              {uploadingImages && (
                <p className="text-xs text-muted mt-1">Uploading...</p>
              )}
              {images.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {images.map((url, i) => (
                    <div key={url + i} className="relative">
                      <img
                        src={url}
                        alt={`Upload ${i + 1}`}
                        className="w-20 h-24 object-cover rounded border border-border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-ink text-white text-xs rounded-full"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1.5">Campus meetup point</label>
              <select
                value={form.meetupPoint.name}
                onChange={(e) => {
                  const point = CAMPUS_MEETUPS.find((p) => p.name === e.target.value);
                  update('meetupPoint', point);
                }}
                className="w-full px-3 py-2 border border-border rounded-md bg-surface text-sm"
              >
                {CAMPUS_MEETUPS.map((p) => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {(form.type === 'note' || form.type === 'question_paper') && (
          <div>
            <label className="block text-sm mb-1.5">Upload PDF</label>
            <input type="file" accept=".pdf,application/pdf" onChange={handleDocUpload} className="text-sm" />
            {uploadingDoc && (
              <p className="text-xs text-muted mt-1">Uploading...</p>
            )}
            {documentUrl && (
              <div className="mt-3 border border-border rounded-md overflow-hidden">
                <iframe
                  src={getPdfViewUrl(documentUrl)}
                  title="PDF preview"
                  className="w-full h-64 bg-stone-50"
                />
                <p className="text-xs text-emerald-700 px-3 py-2 bg-emerald-50">
                  {documentName || 'PDF'} uploaded
                </p>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-accent text-white rounded-md hover:bg-accent-hover text-sm disabled:opacity-50"
        >
          {loading ? 'Publishing...' : 'Publish listing'}
        </button>
      </form>
    </div>
  );
}
