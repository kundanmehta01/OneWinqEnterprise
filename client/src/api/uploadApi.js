import axios from 'axios';
import api from './axios';

/**
 * Universal media & file upload helper.
 * 
 * In serverless environments (like Vercel), files > 4.5MB are blocked by Vercel proxy
 * with "413 Request Entity Too Large" (FUNCTION_PAYLOAD_TOO_LARGE), causing a browser Network Error.
 * 
 * This helper first checks if direct Cloudinary signed upload is available:
 * 1. Fetches a signed token from the backend (takes ~50ms, tiny JSON payload)
 * 2. Streams the video/image directly from the client to Cloudinary
 * 3. Bypasses the Vercel 4.5MB limit completely, enabling up to 50MB-100MB uploads
 * 4. Falls back to backend multipart endpoint if Cloudinary is unconfigured
 */
export const uploadFileAsset = async ({
  file,
  entityType = 'general',
  isVideo = false,
  onProgress = () => {}
}) => {
  if (!file) throw new Error('No file provided');

  // Attempt direct cloud upload if available
  try {
    const res = await api.get('/upload/signature', {
      params: { entityType }
    });

    const sigData = res?.data || res;

    if (sigData?.provider === 'cloudinary' && sigData.signature && sigData.cloudName) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', sigData.apiKey);
      formData.append('timestamp', String(sigData.timestamp));
      formData.append('folder', sigData.folder);
      formData.append('signature', sigData.signature);

      const resourceType = isVideo ? 'video' : 'auto';
      const cldEndpoint = `https://api.cloudinary.com/v1_1/${sigData.cloudName}/${resourceType}/upload`;

      // Use standard axios to post directly to Cloudinary without backend Authorization header
      const cldRes = await axios.post(cldEndpoint, formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percent);
          }
        }
      });

      const uploadedUrl = cldRes.data?.secure_url || cldRes.data?.url;
      if (uploadedUrl) {
        return {
          url: uploadedUrl,
          provider: 'cloudinary',
          publicId: cldRes.data?.public_id,
          format: cldRes.data?.format
        };
      }
    }
  } catch (err) {
    console.warn('[uploadApi] Direct Cloudinary upload failed or not configured, falling back to server route:', err?.message || err);
  }

  // Fallback: Standard server upload
  const formData = new FormData();
  formData.append('file', file);
  formData.append('entityType', entityType);

  const serverRes = await api.post('/admin/media/upload', formData, {
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    }
  });

  const url =
    serverRes?.data?.url ||
    serverRes?.data?.data?.url ||
    serverRes?.url ||
    (typeof serverRes === 'string' ? serverRes : null);

  if (!url) {
    throw new Error('Server did not return a valid media URL.');
  }

  return {
    url,
    provider: 'server'
  };
};

export const uploadApi = {
  uploadFileAsset
};
