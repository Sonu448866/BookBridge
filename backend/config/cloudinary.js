import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { Readable } from 'stream';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/heif',
  'application/pdf',
];

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = ALLOWED_TYPES.includes(file.mimetype)
      || file.mimetype.startsWith('image/');
    cb(ok ? null : new Error(`File type not allowed: ${file.mimetype}`), ok);
  },
});

function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

function hasCloudinaryConfig() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME
    && process.env.CLOUDINARY_API_KEY
    && process.env.CLOUDINARY_API_SECRET
  );
}

export async function verifyCloudinary() {
  if (!hasCloudinaryConfig()) return { ok: false, reason: 'not configured' };

  try {
    await cloudinary.api.ping();
    return { ok: true };
  } catch (err) {
    const message = err?.error?.message || err.message || 'Cloudinary check failed';
    return { ok: false, reason: message };
  }
}

function uploadToCloudinary(file, folder) {
  const isPdf = file.mimetype === 'application/pdf';

  const options = isPdf
    ? {
        folder,
        resource_type: 'image',
        format: 'pdf',
      }
    : {
        folder,
        resource_type: 'image',
      };

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (err, result) => {
        if (err) return reject(err);

        if (isPdf) {
          const downloadUrl = cloudinary.url(result.public_id, {
            resource_type: 'image',
            secure: true,
            format: 'pdf',
            version: result.version,
            flags: 'attachment',
          });
          result.secure_url = downloadUrl;
          result.url = downloadUrl;
        }

        resolve(result);
      }
    );
    bufferToStream(file.buffer).pipe(uploadStream);
  });
}

function getExtension(file) {
  const fromName = path.extname(file.originalname).toLowerCase();
  if (fromName) return fromName;
  if (file.mimetype === 'application/pdf') return '.pdf';
  if (file.mimetype === 'image/png') return '.png';
  if (file.mimetype === 'image/webp') return '.webp';
  return '.jpg';
}

async function saveFileLocally(file, subfolder) {
  const dir = path.join(UPLOAD_DIR, subfolder);
  await fs.promises.mkdir(dir, { recursive: true });

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${getExtension(file)}`;
  await fs.promises.writeFile(path.join(dir, filename), file.buffer);

  const url = `/uploads/${subfolder}/${filename}`;
  return { url, secure_url: url };
}

export async function uploadFile(file, subfolder = 'images') {
  if (hasCloudinaryConfig()) {
    try {
      const result = await uploadToCloudinary(file, `bookbridge/${subfolder}`);
      return { url: result.secure_url || result.url, secure_url: result.secure_url || result.url };
    } catch (err) {
      const message = err?.message || err?.error?.message || 'Cloudinary upload failed';
      console.warn(`Cloudinary upload failed (${message}). Saving file locally.`);
    }
  }

  return saveFileLocally(file, subfolder);
}
