/**
 * Shared media utility helpers for video embeds, thumbnails, and format detection.
 */

/**
 * Normalizes a URL by trimming and adding https:// if protocol was omitted.
 * @param {string} url
 * @returns {string}
 */
export const normalizeMediaUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  let s = url.trim();
  if (/^(?:www\.|youtube\.com|youtu\.be|vimeo\.com|player\.vimeo\.com)/i.test(s)) {
    s = `https://${s}`;
  }
  return s;
};

/**
 * Detects YouTube, Vimeo, or direct video URLs and extracts embed metadata.
 * @param {string} url
 * @returns {{ type: 'youtube'|'vimeo'|'direct', id: string, embedUrl: string, thumbnailUrl: string } | null}
 */
export const getEmbedInfo = (url) => {
  if (!url || typeof url !== 'string') return null;
  const s = normalizeMediaUrl(url);
  if (!s) return null;

  // 1. YouTube
  // Handles:
  // - https://www.youtube.com/watch?v=VIDEO_ID (&t=..., &feature=...)
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  // - https://www.youtube.com/v/VIDEO_ID
  // - https://www.youtube.com/shorts/VIDEO_ID
  const ytMatch = s.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?.*v=|embed\/|v\/|shorts\/))([\w-]{11})/i);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      id: videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    };
  }

  // 2. Vimeo
  // Handles:
  // - https://vimeo.com/VIDEO_ID
  // - https://player.vimeo.com/video/VIDEO_ID
  // - https://vimeo.com/channels/.../VIDEO_ID
  const vimeoMatch = s.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      type: 'vimeo',
      id: videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1`,
      thumbnailUrl: ''
    };
  }

  // 3. Direct video files or Cloudinary video uploads
  const isDirectVideo = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(s) || /\/video\/upload\//i.test(s);
  if (isDirectVideo) {
    return {
      type: 'direct',
      id: s,
      embedUrl: s,
      thumbnailUrl: ''
    };
  }

  return null;
};

/**
 * Helper to determine the best display thumbnail for a media item.
 * @param {Object} item
 * @returns {string}
 */
export const getMediaThumbnail = (item) => {
  if (!item) return '';
  if (item.thumbnailUrl && item.thumbnailUrl.trim()) {
    // If thumbnailUrl was incorrectly saved as a raw video URL or YouTube page, don't use it as an image src
    const rawThumb = item.thumbnailUrl.trim();
    if (!/youtube\.com\/watch|youtu\.be\/|\.mp4$|\.webm$/i.test(rawThumb)) {
      return rawThumb;
    }
  }

  const embed = getEmbedInfo(item.url);
  if (embed?.thumbnailUrl) {
    return embed.thumbnailUrl;
  }

  // If item is a photo, the item.url is itself an image
  if (item.type !== 'video' && item.url) {
    return item.url;
  }

  return '';
};
