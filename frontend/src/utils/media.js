export function isPdfUrl(url) {
  if (!url) return false;
  return url.toLowerCase().includes('.pdf')
    || url.includes('/docs/')
    || url.includes('format=pdf')
    || url.includes('fl_attachment');
}

/** Cloudinary PDF view URL (inline in browser / iframe) */
export function getPdfViewUrl(url) {
  if (!url || !url.includes('cloudinary.com')) return url;
  if (url.includes('fl_attachment')) {
    return url.replace('/fl_attachment/', '/').replace('/fl_attachment', '/');
  }
  return url;
}

/** Cloudinary PDF download URL with correct filename & type */
export function getPdfDownloadUrl(url) {
  if (!url) return url;
  if (!url.includes('cloudinary.com')) return url;
  if (url.includes('fl_attachment')) return url;
  return url.replace('/upload/', '/upload/fl_attachment/');
}

export function getItemCover(item) {
  const validImage = item.images?.find((url) => url && !url.includes('placehold.co'));
  if (validImage) return { type: 'image', src: validImage };
  if (item.documentUrl) return { type: 'pdf', src: item.documentUrl };
  return { type: 'none', src: null };
}
