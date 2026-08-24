import sharp from 'sharp';
import path from 'path';

async function createBrightTextShowcase() {
  const inputOriginal = 'C:/Users/brayw/.gemini/antigravity/brain/153b417f-0115-4062-8d25-bae3bddca31f/.user_uploaded/media_1787564007062.png';
  const outputPath = path.resolve('../frontend/public/hair-remover-showcase-v3.png');
  const fallbackPath = path.resolve('../frontend/public/hair-remover-showcase-v2.png');
  const fallbackPath1 = path.resolve('../frontend/public/hair-remover-showcase.png');

  const meta = await sharp(inputOriginal).metadata();

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
  console.log(`Canvas extracted: ${width}x${height}`);

  // BFS Flood Fill from edges to make background transparent
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

  // Define text label bounding boxes specifically so we ONLY brighten text labels
  // and NEVER touch any photo or trimmer pixels!
  const textLabelBoxes = [
    { name: 'Eyebrow', x1: 220, y1: 155, x2: 380, y2: 195 },
    { name: 'Face', x1: 430, y1: 180, x2: 560, y2: 215 },
    { name: 'Neck', x1: 90, y1: 340, x2: 230, y2: 375 },
    { name: 'Arm', x1: 580, y1: 365, x2: 700, y2: 405 },
    { name: 'Underarm', x1: 65, y1: 595, x2: 215, y2: 635 },
    { name: 'Leg hair', x1: 540, y1: 625, x2: 690, y2: 665 },
    { name: 'Baby shaving', x1: 150, y1: 690, x2: 320, y2: 730 },
    { name: 'Bikini area', x1: 410, y1: 690, x2: 580, y2: 730 },
  ];

  function isInTextBox(x, y) {
    for (const box of textLabelBoxes) {
      if (x >= box.x1 && x <= box.x2 && y >= box.y1 && y <= box.y2) {
        return true;
      }
    }
    return false;
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      if (isBg[y * width + x]) {
        data[idx + 3] = 0; // Transparent background
      } else if (isInTextBox(x, y)) {
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        // If dark text pixel in the text box -> make it bright white for high contrast on dark banner!
        if (r < 150 && g < 150 && b < 150) {
          data[idx] = 255;
          data[idx + 1] = 255;
          data[idx + 2] = 255;
          data[idx + 3] = 255;
        }
      }
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .png({ quality: 100 })
    .toFile(outputPath);

  await sharp(data, { raw: { width, height, channels } })
    .png({ quality: 100 })
    .toFile(fallbackPath);

  await sharp(data, { raw: { width, height, channels } })
    .png({ quality: 100 })
    .toFile(fallbackPath1);

  console.log('Saved bright-label showcase graphic to:', outputPath);
}

createBrightTextShowcase().catch(console.error);
