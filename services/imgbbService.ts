const IMGBB_API_KEY = 'c4b7a9f1b52bc8849987a7cc217e643f';
const IMGBB_API_URL = 'https://api.imgbb.com/1/upload';

export const uploadToImgBB = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`${IMGBB_API_URL}?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('ImgBB error:', errorData);
      throw new Error(`Upload failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error?.message || 'Upload failed');
    }

    return data.data.url; // Returns direct image URL
  } catch (error) {
    console.error('Image upload failed:', error);
    throw error;
  }
};

export const uploadMultipleToImgBB = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadToImgBB(file));
  return await Promise.all(uploadPromises);
};

export const validateImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 32 * 1024 * 1024; // 32MB (ImgBB limit)

  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload JPEG, PNG, GIF, or WebP.');
  }

  if (file.size > maxSize) {
    throw new Error('File too large. Maximum size is 32MB.');
  }

  return true;
};
