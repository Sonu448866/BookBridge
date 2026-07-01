const CONDITIONS = {
  new: 'New',
  like_new: 'Like New',
  good: 'Good',
  fair: 'Fair',
  poor: 'Poor',
};

const TYPES = {
  book: 'Book',
  note: 'Notes',
  question_paper: 'Question Paper',
  giveaway: 'Giveaway',
};

export function formatPrice(price) {
  if (!price) return 'Free';
  return `₹${price}`;
}

export function formatCondition(c) {
  return CONDITIONS[c] || c;
}

export function formatType(t) {
  return TYPES[t] || t;
}

export const MAJORS = [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Mechanical',
  'Civil',
];

export const CAMPUS_MEETUPS = [
  { name: 'Main Library Entrance', lat: 19.076, lng: 72.8777 },
  { name: 'Student Center Plaza', lat: 19.077, lng: 72.8787 },
  { name: 'Engineering Block Lobby', lat: 19.075, lng: 72.8767 },
];

export const CONDITION_OPTIONS = Object.entries(CONDITIONS).map(([value, label]) => ({
  value,
  label,
}));
