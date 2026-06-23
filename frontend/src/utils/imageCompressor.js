/**
 * Compresses an image file on the client side using HTML5 Canvas.
 * Resizes the image to fit within maxWidth/maxHeight constraints,
 * and compresses it using JPEG quality settings.
 *
 * @param {File} file - The original File object from file inputs.
 * @param {object} options - Compression options.
 * @param {number} options.maxWidth - Maximum width of the compressed image.
 * @param {number} options.maxHeight - Maximum height of the compressed image.
 * @param {number} options.quality - Quality rating from 0.0 to 1.0.
 * @returns {Promise<File>} A Promise that resolves to the compressed File object.
 */
export async function compressImage(file, { maxWidth = 1000, maxHeight = 1000, quality = 0.8 } = {}) {
  // If it's not an image file or is a GIF (to preserve animation), skip compression.
  if (!file || !file.type || !file.type.startsWith('image/') || file.type === 'image/gif') {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions keeping the aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        // Draw image onto canvas (automatically downscaling it)
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas drawing to compressed JPEG blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Create a new File from the blob
              const newFileName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
              const compressedFile = new File([blob], newFileName, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });

              // Only return the compressed file if it's actually smaller than the original!
              if (compressedFile.size < file.size) {
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => resolve(file);
      img.src = event.target.result;
    };

    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}
