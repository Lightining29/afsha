import sharp from 'sharp';
import path from 'path';

async function createCleanTransparentRakhiArt() {
  const inputPath = 'C:/Users/brayw/.gemini/antigravity/brain/153b417f-0115-4062-8d25-bae3bddca31f/.user_uploaded/media_1787571129595.jpg';
  const outputPath = path.resolve('../frontend/public/raksha-bandhan-clean-transparent.png');
  const targetLightPath = path.resolve('../frontend/public/raksha-bandhan-light.png');

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  console.log(`Processing Raksha Bandhan & Rakhi image: ${width}x${height}`);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      const maxVal = Math.max(r, g, b);
      const minVal = Math.min(r, g, b);
      const diff = maxVal - minVal;
      const lightness = (r + g + b) / 3;

      // Pure or near-white background pixels
      if (r > 248 && g > 248 && b > 248) {
        data[idx + 3] = 0; // 100% transparent
      } else if (lightness > 225 && diff < 15) {
        // Soft edge antialiasing for light mandala edges
        const alpha = Math.max(0, Math.min(255, Math.round((255 - lightness) * 9)));
        data[idx + 3] = alpha;
      } else if (lightness > 200 && diff < 8) {
        const alpha = Math.max(0, Math.min(255, Math.round((255 - lightness) * 6)));
        data[idx + 3] = alpha;
      }
    }
  }

  // Save as high-quality transparent PNG
  await sharp(data, { raw: { width, height, channels } })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(outputPath);

  await sharp(data, { raw: { width, height, channels } })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(targetLightPath);

  console.log('Saved transparent Raksha Bandhan & Rakhi art to:', outputPath);
}

createCleanTransparentRakhiArt().catch(console.error);
