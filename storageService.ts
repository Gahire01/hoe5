import { supabase } from './supabase';

const BUCKET          = 'uploads';
const MAX_W           = 800;
const MAX_H           = 800;
const QUALITY         = 0.72;
const TIMEOUT_MS      = 30_000;

// ─── compress ─────────────────────────────────────────────────────────────────
export async function compressImage(file: File): Promise<File> {
  // Skip tiny files or non-images
  if (!file.type.startsWith('image/') || file.size < 50 * 1024) return file;

  return new Promise((resolve) => {
    const fallback = () => resolve(file);
    const reader   = new FileReader();
    reader.onerror = fallback;
    reader.onload  = (e) => {
      const img    = new Image();
      img.onerror  = fallback;
      img.onload   = () => {
        try {
          const scale  = Math.min(MAX_W / img.width, MAX_H / img.height, 1);
          const w      = Math.round(img.width  * scale);
          const h      = Math.round(img.height * scale);
          const canvas = document.createElement('canvas');
          canvas.width  = w;
          canvas.height = h;
          const ctx    = canvas.getContext('2d');
          if (!ctx) return fallback();
          ctx.drawImage(img, 0, 0, w, h);

          // Detect WebP support
          const useWebP = canvas.toDataURL('image/webp').startsWith('data:image/webp');
          const mime    = useWebP ? 'image/webp' : 'image/jpeg';
          const ext     = useWebP ? 'webp'       : 'jpg';

          // Safety timeout in case toBlob never fires
          let fired = false;
          const t   = setTimeout(() => { if (!fired) fallback(); }, 5_000);

          canvas.toBlob((blob) => {
            fired = true;
            clearTimeout(t);
            if (!blob) return fallback();
            const name = file.name.replace(/\.[^/.]+$/, `.${ext}`);
            resolve(new File([blob], name, { type: mime, lastModified: Date.now() }));
          }, mime, QUALITY);
        } catch { fallback(); }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// ─── upload single ────────────────────────────────────────────────────────────
// KEY FIX: convert to ArrayBuffer before uploading.
// When you pass a File/Blob, the Supabase JS SDK calls getSession() internally
// to attach the auth header — this tries to acquire the navigator.locks auth
// token lock. If another part of the app already holds it, you get:
//   "NavigatorLockAcquireTimeoutError: lock was released because another request stole it"
// Passing ArrayBuffer + explicit contentType completely skips that code path.
export async function uploadFileToSupabase(
  file:        File,
  folder:      string,
  onProgress?: (pct: number) => void,
): Promise<string> {
  onProgress?.(5);

  const compressed = await compressImage(file);
  onProgress?.(20);

  // Convert to ArrayBuffer — bypasses internal getSession() call in SDK
  const buffer   = await compressed.arrayBuffer();
  const ext      = compressed.name.split('.').pop() ?? 'jpg';
  const mime     = compressed.type || 'image/jpeg';
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const upload = supabase.storage
    .from(BUCKET)
    .upload(fileName, buffer, { contentType: mime, upsert: false });

  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Upload timed out. Check your connection.')), TIMEOUT_MS)
  );

  const { error } = await Promise.race([upload, timeout]);
  if (error) throw new Error(error.message ?? 'Upload failed');

  onProgress?.(90);

  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  onProgress?.(100);
  return publicUrl;
}

// ─── upload multiple (sequential to avoid lock races) ────────────────────────
export async function uploadMultipleToSupabase(
  files:       File[],
  folder:      string,
  onProgress?: (done: number, total: number) => void,
): Promise<string[]> {
  const urls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const url = await uploadFileToSupabase(files[i], folder);
    urls.push(url);
    onProgress?.(i + 1, files.length);
  }
  return urls;
}

// ─── validate ─────────────────────────────────────────────────────────────────
export function validateImageFile(file: File): boolean {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowed.includes(file.type))
    throw new Error('Invalid file type. Please upload JPEG, PNG, GIF, or WebP.');
  if (file.size > 10 * 1024 * 1024)
    throw new Error('File too large. Maximum size is 10 MB.');
  return true;
}
