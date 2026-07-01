const DOMAIN = process.env.ALLOWED_EMAIL_DOMAIN || 'spit.ac.in';

export function isUniversityEmail(email) {
  return email.toLowerCase().endsWith(`@${DOMAIN}`);
}
