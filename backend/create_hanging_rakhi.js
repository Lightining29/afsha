import sharp from 'sharp';
import path from 'path';

async function createHangingRakhiArt() {
  const inputPath = 'C:/Users/brayw/.gemini/antigravity/brain/153b417f-0115-4062-8d25-bae3bddca31f/.user_uploaded/media_1787571129595.jpg';
  const outputPath = path.resolve('../frontend/public/hanging-rakhi-ornament.png');

  // Extract Rakhi centerpiece and thread
  const { data, info } = await sharp(inputPath)
    .extract({ left: 180, top: 250, width: 220, height: 120 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

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

      if (r > 240 && g > 240 && b > 240) {
        data[idx + 3] = 0;
      } else if (lightness > 220 && diff < 15) {
        data[idx + 3] = Math.max(0, Math.min(255, Math.round((255 - lightness) * 10)));
      }
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .resize(260, null)
    .png({ quality: 100 })
    .toFile(outputPath);

  console.log('Saved hanging-rakhi-ornament.png');
}

createHangingRakhiArt().catch(console.error);
