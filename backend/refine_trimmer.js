import sharp from 'sharp';
import path from 'path';

async function checkAndRefine() {
  const inputPath = 'C:/Users/brayw/.gemini/antigravity/brain/153b417f-0115-4062-8d25-bae3bddca31f/.user_uploaded/media_1787563609810.png';
  const outputPath = path.resolve('../frontend/public/hair-remover-transparent.png');

  // Let's crop slightly more generously to make sure the top blade tip and bottom round handle are 100% captured without touching any surrounding circle callouts
  // Center of image is x: 468, y: 405.
  // The trimmer top starts around y: 260, bottom ends around y: 660.
  // Width of trimmer is from x: 370 to x: 450.
  const cropLeft = 360;
  const cropTop = 260;
  const cropWidth = 120;
  const cropHeight = 405;

  const { data, info } = await sharp(inputPath)
    .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  // Mask array: 1 = background, 0 = foreground (trimmer)
  const isBg = new Uint8Array(width * height);
  const queue = [];

  function getPixel(x, y) {
    const idx = (y * width + x) * channels;
    return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
  }

  // Push borders that are near white
  for (let x = 0; x < width; x++) {
    const [r1, g1, b1] = getPixel(x, 0);
    if (r1 > 225 && g1 > 225 && b1 > 225) { isBg[x] = 1; queue.push([x, 0]); }
    const [r2, g2, b2] = getPixel(x, height - 1);
    if (r2 > 225 && g2 > 225 && b2 > 225) { isBg[(height - 1) * width + x] = 1; queue.push([x, height - 1]); }
  }
  for (let y = 0; y < height; y++) {
    const [r1, g1, b1] = getPixel(0, y);
    if (r1 > 225 && g1 > 225 && b1 > 225) { isBg[y * width] = 1; queue.push([0, y]); }
    const [r2, g2, b2] = getPixel(width - 1, y);
    if (r2 > 225 && g2 > 225 && b2 > 225) { isBg[y * width + (width - 1)] = 1; queue.push([width - 1, y]); }
  }

  // BFS
  let head = 0;
  while (head < queue.length) {
    const [cx, cy] = queue[head++];
    const neighbors = [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = ny * width + nx;
        if (!isBg[nIdx]) {
          const [nr, ng, nb] = getPixel(nx, ny);
          // Pure white background and drop shadow feather
          // Silver device has distinct color tone, background is purely achromatic light gray/white
          if (nr > 230 && ng > 230 && nb > 230) {
            isBg[nIdx] = 1;
            queue.push([nx, ny]);
          } else if (nr > 210 && ng > 210 && nb > 210 && Math.abs(nr - ng) < 4 && Math.abs(nr - nb) < 4) {
            // soft shadow cast on white background
            isBg[nIdx] = 1;
            queue.push([nx, ny]);
          }
        }
      }
    }
  }

  // Set transparency
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      if (isBg[y * width + x]) {
        data[idx + 3] = 0; // Pure Transparent
      }
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .trim() // automatically trim any excess transparent border pixels
    .png()
    .toFile(outputPath);

  console.log('Refined transparent image saved successfully!');
}

checkAndRefine().catch(console.error);
