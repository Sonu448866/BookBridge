const BASE = 'https://www.googleapis.com/books/v1/volumes';

export async function fetchBookByISBN(isbn) {
  const clean = isbn.replace(/[-\s]/g, '');
  const key = process.env.GOOGLE_BOOKS_API_KEY;
  const url = `${BASE}?q=isbn:${clean}${key ? `&key=${key}` : ''}`;

  const res = await fetch(url);
  if (!res.ok) return null;

  const data = await res.json();
  const book = data.items?.[0]?.volumeInfo;
  if (!book) return null;

  const mrp = book.saleInfo?.listPrice?.amount
    || book.saleInfo?.retailPrice?.amount
    || 0;

  return {
    title: book.title || '',
    author: book.authors?.join(', ') || '',
    isbn: clean,
    originalPrice: mrp,
    description: book.description?.slice(0, 500) || '',
    image: book.imageLinks?.thumbnail || '',
  };
}

export function suggestUsedPrice(originalPrice, condition) {
  const rates = {
    new: 0.85,
    like_new: 0.7,
    good: 0.55,
    fair: 0.4,
    poor: 0.25,
  };
  const rate = rates[condition] || 0.5;
  return Math.round(originalPrice * rate);
}
