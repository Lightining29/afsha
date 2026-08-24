import sharp from 'sharp';
import path from 'path';

async function processPristineImage() {
  const inputOriginal = 'C:/Users/brayw/.gemini/antigravity/brain/153b417f-0115-4062-8d25-bae3bddca31f/.user_uploaded/media_1787564007062.png';
  const outputPath = path.resolve('../frontend/public/hair-remover-showcase-v2.png');
  const fallbackPath = path.resolve('../frontend/public/hair-remover-showcase.png');

  console.log('Reading pristine source image...');
  const meta = await sharp(inputOriginal).metadata();

  // Crop the content bounding box (width: ~904, height: ~708)
  const cropTop = 10;
  const cropHeight = meta.height - 15;
  const cropLeft = 60;
  const cropWidth = meta.width - 120;

  // Extract raw pixels with alpha channel
  const { data, info } = await sharp(inputOriginal)
    .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  console.log(`Canvas extracted: ${width}x${height}`);

  // BFS Flood Fill from all 4 borders to find ONLY pure background pixels.
  // We ONLY set alpha = 0 for the background.
  // We do NOT modify ANY RGB channel (RGB values are 100% strictly preserved from original!).
  const isBg = new Uint8Array(width * height);
  const queue = [];

  function getPixel(x, y) {
    const idx = (y * width + x) * channels;
    return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
  }

  // Push boundary pixels
  for (let x = 0; x < width; x++) {
    const [r1, g1, b1] = getPixel(x, 0);
    if (r1 > 220 && g1 > 220 && b1 > 220) { isBg[x] = 1; queue.push([x, 0]); }
    const [r2, g2, b2] = getPixel(x, height - 1);
    if (r2 > 220 && g2 > 220 && b2 > 220) { isBg[(height - 1) * width + x] = 1; queue.push([x, height - 1]); }
  }
  for (let y = 0; y < height; y++) {
    const [r1, g1, b1] = getPixel(0, y);
    if (r1 > 220 && g1 > 220 && b1 > 220) { isBg[y * width] = 1; queue.push([0, y]); }
    const [r2, g2, b2] = getPixel(width - 1, y);
    if (r2 > 220 && g2 > 220 && b2 > 220) { isBg[y * width + (width - 1)] = 1; queue.push([width - 1, y]); }
  }

  let head = 0;
  while (head < queue.length) {
    const [cx, cy] = queue[head++];
    const neighbors = [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = ny * width + nx;
        if (!isBg[nIdx]) {
          const [nr, ng, nb] = getPixel(nx, ny);
          if (nr > 235 && ng > 235 && nb > 235) {
            isBg[nIdx] = 1;
            queue.push([nx, ny]);
          } else if (nr > 220 && ng > 220 && nb > 220 && Math.abs(nr - ng) < 6 && Math.abs(nr - nb) < 6) {
            isBg[nIdx] = 1;
            queue.push([nx, ny]);
          }
        }
      }
    }
  }

  // Set alpha = 0 for background. LEAVE ALL RGB 100% UNTOUCHED!
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      if (isBg[y * width + x]) {
        data[idx + 3] = 0;
      }
    }
  }

  // Save to hair-remover-showcase-v2.png and hair-remover-showcase.png
  await sharp(data, { raw: { width, height, channels } })
    .png({ quality: 100 })
    .toFile(outputPath);

  await sharp(data, { raw: { width, height, channels } })
    .png({ quality: 100 })
    .toFile(fallbackPath);

  console.log('SUCCESS: Pristine, natural showcase saved without ANY yellow modifications to:');
  console.log(outputPath);
  console.log(fallbackPath);
}

processPristineImage().catch(console.error);
