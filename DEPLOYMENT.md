# Deployment & Security Checklist

Use this before pushing to GitHub or deploying to production.

## Before your first `git push`

1. **Confirm secrets are ignored**
   ```bash
   git status
   ```
   You must **not** see `backend/.env`, `frontend/.env`, or `node_modules/` in the list.

2. **Only commit `.env.example` files** — never real `.env` files.

3. **Rotate credentials** if they were ever shared or committed:
   - MongoDB Atlas → Database Access → reset password
   - Cloudinary → Settings → Security → rotate API secret
   - Google Cloud → Credentials → regenerate API key
   - Change `JWT_SECRET` to a new random string (invalidates existing logins)

## What must stay secret (backend only)

| Variable | Where to set in production |
|----------|----------------------------|
| `MONGODB_URI` | Render / Railway env vars |
| `JWT_SECRET` | Render env vars |
| `CLOUDINARY_*` | Render env vars |
| `GOOGLE_BOOKS_API_KEY` | Render env vars |
| `SMTP_*` | Render env vars |

## Frontend rules

- **Never** put API keys, MongoDB URIs, or Cloudinary secrets in `frontend/.env`.
- Only `VITE_*` variables belong in the frontend — they are bundled into the browser and **public**.
- Safe for frontend: `VITE_SOCKET_URL` (your public API URL).

## Production environment variables

### Backend (e.g. Render)

```
NODE_ENV=production
PORT=5000
MONGODB_URI=...
JWT_SECRET=<long-random-string>
CLIENT_URL=https://your-app.vercel.app
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
GOOGLE_BOOKS_API_KEY=...
```

### Frontend (e.g. Vercel)

```
VITE_SOCKET_URL=https://your-api.onrender.com
```

Update `frontend/src/services/api.js` or use a `VITE_API_URL` for production API base URL if not using a proxy.

## MongoDB Atlas

- Enable **IP Access List** (allow Render/Vercel IPs or `0.0.0.0/0` only if needed for serverless).
- Use a dedicated DB user with read/write on `bookbridge` only.
- Never use your Atlas admin account in the app.

## Google Books API key

- Restrict key to **Books API** only.
- Add HTTP referrer or IP restrictions if possible.

## Cloudinary

- Enable **PDF delivery** under Settings → Security if you serve PDFs.
- Do not enable unsigned uploads unless required.

## CORS

Set `CLIENT_URL` to your **exact** production frontend URL (e.g. `https://bookbridge.vercel.app`).

## JWT

Use a strong secret in production, e.g.:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
