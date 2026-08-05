let sharpInstance = null;
let sharpAttempted = false;

async function getSharp() {
  if (sharpAttempted) return sharpInstance;
  sharpAttempted = true;
  try {
    const mod = await import('sharp');
    sharpInstance = mod.default || mod;
  } catch (err) {
    console.warn('[ImageCompressor Warning] Sharp native binary not available on this platform, serving raw image buffer safely:', err.message);
    sharpInstance = null;
  }
  return sharpInstance;
}

/**
 * Safely converts and compresses input image buffer into WebP format.
 * - If sharp is present and native binaries match: converts to WebP (~80% smaller)
 * - If sharp binary is missing or fails on Linux host: safely falls back to original buffer without crashing server
 */
export async function compressToWebP(inputBuffer, maxDimension = 1200, quality = 80) {
  if (!inputBuffer || !Buffer.isBuffer(inputBuffer)) {
    return { data: inputBuffer, contentType: 'image/jpeg' };
  }

  const sharp = await getSharp();
  if (!sharp) {
    return { data: inputBuffer, contentType: 'image/jpeg' };
  }

  try {
    const compressedBuffer = await sharp(inputBuffer)
      .resize({
        width: maxDimension,
        height: maxDimension,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality, effort: 4 })
      .toBuffer();

    return {
      data: compressedBuffer,
      contentType: 'image/webp',
    };
  } catch (err) {
    console.warn('[ImageCompressor Warning] Sharp compression skipped, serving raw buffer:', err.message);
    return { data: inputBuffer, contentType: 'image/jpeg' };
  }
}
