/**
 * Client-side image compression utility
 * Compresses images before uploading to reduce bandwidth and improve performance
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKB?: number;
}

export interface CompressionResult {
  blob: Blob;
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  width: number;
  height: number;
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.8,
  maxSizeKB: 500,
};

/**
 * Compress an image file or data URL
 */
export async function compressImage(
  input: File | string,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > opts.maxWidth! || height > opts.maxHeight!) {
          const ratio = Math.min(
            opts.maxWidth! / width,
            opts.maxHeight! / height
          );
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // Draw image with high quality settings
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob with specified quality
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to compress image"));
              return;
            }

            const dataUrl = canvas.toDataURL("image/jpeg", opts.quality);
            const originalSize =
              input instanceof File
                ? input.size
                : Math.round((input.length * 3) / 4); // Approximate base64 size

            resolve({
              blob,
              dataUrl,
              originalSize,
              compressedSize: blob.size,
              compressionRatio: originalSize / blob.size,
              width,
              height,
            });
          },
          "image/jpeg",
          opts.quality
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error("Failed to load image for compression"));
    };

    // Load the image
    if (input instanceof File) {
      img.src = URL.createObjectURL(input);
    } else {
      img.src = input;
    }
  });
}

/**
 * Check if an image needs compression based on size
 */
export function needsCompression(
  sizeBytes: number,
  maxSizeKB: number = 500
): boolean {
  return sizeBytes > maxSizeKB * 1024;
}

/**
 * Get file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Compress image for optimal AI processing
 * GPT-4 Vision works best with images around 1024x1024
 */
export async function compressForAI(
  input: File | string
): Promise<CompressionResult> {
  return compressImage(input, {
    maxWidth: 1024,
    maxHeight: 1024,
    quality: 0.85,
    maxSizeKB: 500,
  });
}
