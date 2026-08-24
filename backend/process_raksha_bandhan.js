import sharp from 'sharp';
import path from 'path';

async function processRakshaBandhanArt() {
  const inputPath = 'C:/Users/brayw/.gemini/antigravity/brain/153b417f-0115-4062-8d25-bae3bddca31f/.user_uploaded/media_1787571129595.jpg';
  const outputPath = path.resolve('../frontend/public/raksha-bandhan-art.png');

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  console.log(`Processing Raksha Bandhan Image: ${width}x${height}`);

  // Convert pure/near white background to transparent while preserving mandala lines, text, and rakhis
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Pure/near white
      if (r > 242 && g > 242 && b > 242) {
        data[idx + 3] = 0; // 100% transparent
      } else if (r > 225 && g > 225 && b > 225) {
        // Soft edge antialiasing
        const lightness = (r + g + b) / 3;
        const alpha = Math.max(0, Math.min(255, Math.round((255 - lightness) * 12)));
        data[idx + 3] = alpha;
      }
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .png({ quality: 100 })
    .toFile(outputPath);

  console.log('Saved transparent Raksha Bandhan art to:', outputPath);
}

processRakshaBandhanArt().catch(console.error);
