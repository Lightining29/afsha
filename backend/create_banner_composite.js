import sharp from 'sharp';
import path from 'path';

async function createHDShowcase() {
  // Use high-resolution media_1787564007062.png (1024x723)
  const inputOriginal = 'C:/Users/brayw/.gemini/antigravity/brain/153b417f-0115-4062-8d25-bae3bddca31f/.user_uploaded/media_1787564007062.png';
  const outputPath = path.resolve('../frontend/public/hair-remover-showcase.png');

  console.log('Loading HD showcase graphic from media_1787564007062.png...');
  const meta = await sharp(inputOriginal).metadata();
  console.log('HD Size:', meta.width, meta.height);

  // Crop from below the title "Multi-functional Eyebrow Trimmer"
  const cropTop = 10;
  const cropHeight = meta.height - 15;
  const cropLeft = 60;
  const cropWidth = meta.width - 120;

  const { data, info } = await sharp(inputOriginal)
    .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  console.log(`Extracted HD canvas: ${width}x${height}`);

  const isBg = new Uint8Array(width * height);
  const queue = [];

  function getPixel(x, y) {
    const idx = (y * width + x) * channels;
    return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
  }

  // Push border pixels
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
          if (nr > 232 && ng > 232 && nb > 232) {
            isBg[nIdx] = 1;
            queue.push([nx, ny]);
          } else if (nr > 215 && ng > 215 && nb > 215 && Math.abs(nr - ng) < 6 && Math.abs(nr - nb) < 6) {
            isBg[nIdx] = 1;
            queue.push([nx, ny]);
          }
        }
      }
    }
  }

  // Turn white background to transparent and turn dark text into glowing light text for dark banner!
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      if (isBg[y * width + x]) {
        data[idx + 3] = 0; // Pure transparent
      } else {
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        // Dark text labels -> golden yellow #fec22a
        if (r < 95 && g < 95 && b < 95) {
          data[idx] = 254;
          data[idx + 1] = 194;
          data[idx + 2] = 42;
        }
      }
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .trim()
    .png()
    .toFile(outputPath);

  console.log('HD Transparent showcase graphic saved to:', outputPath);
}

createHDShowcase().catch(console.error);
