/**
 * Configuration options for image compression and resizing.
 */
export interface ImageCompressionOptions {
  /**
   * Maximum dimension (width or height) in pixels.
   * Proportional aspect ratio is automatically preserved.
   * Default: 1024
   */
  maxDimension?: number;
  /**
   * Compression quality (0.0 to 1.0).
   * Default: 0.82
   */
  quality?: number;
  /**
   * Target MIME type.
   * Default: 'image/jpeg'
   */
  mimeType?: string;
}

/**
 * Compresses and resizes a File object using the native browser HTML5 Canvas API.
 * Preserves aspect ratio, eliminates multi-megabyte payloads, and delivers optimized
 * image assets suitable for deep neural network input and Cloudflare R2 storage.
 *
 * Pure browser Web API with zero npm dependencies. Safely falls back to the
 * original file if executed in SSR context or if the image buffer is unreadable.
 *
 * @param file - The raw File to compress
 * @param options - Compression configuration settings
 * @returns A Promise resolving to the compressed File
 */
export const compressImageFile = (
  file: File,
  options: ImageCompressionOptions = {}
): Promise<File> => {
  const {
    maxDimension = 1024,
    quality = 0.82,
    mimeType = "image/jpeg",
  } = options;

  // If server-side or non-image, bypass compression safely
  if (!import.meta.client || typeof window === "undefined" || !file?.type?.startsWith("image/")) {
    return Promise.resolve(file);
  }

  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Calculate proportional bounding-box dimensions
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return resolve(file);
      }

      // Draw resized image frame
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return resolve(file);
          }

          const fileExt = mimeType === "image/webp" ? "webp" : "jpg";
          const originalBaseName = (file.name || "leaf-image").replace(/\.[^/.]+$/, "");
          const compressedFileName = `${originalBaseName}.${fileExt}`;

          const compressedFile = new File([blob], compressedFileName, {
            type: mimeType,
            lastModified: Date.now(),
          });

          resolve(compressedFile);
        },
        mimeType,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
};
