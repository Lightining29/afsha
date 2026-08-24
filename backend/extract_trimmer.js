import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function processImage() {
  const inputPath = 'C:/Users/brayw/.gemini/antigravity/brain/153b417f-0115-4062-8d25-bae3bddca31f/.user_uploaded/media_1787563609810.png';
  const outputPath = path.resolve('../frontend/public/hair-remover-transparent.png');

  console.log('Reading image...');
  const metadata = await sharp(inputPath).metadata();
  console.log('Metadata:', metadata.width, metadata.height);

  // The center trimmer is located in the middle:
  // Let's determine the bounding box around the center trimmer:
  // Width is around x: 38% to 58%, y: 30% to 85%
  const cropLeft = Math.round(metadata.width * 0.38);
  const cropTop = Math.round(metadata.height * 0.32);
  const cropWidth = Math.round(metadata.width * 0.18);
  const cropHeight = Math.round(metadata.height * 0.52);

  console.log(`Cropping from left=${cropLeft}, top=${cropTop}, width=${cropWidth}, height=${cropHeight}`);

  // Extract the cropped region as raw pixel buffer
  const { data, info } = await sharp(inputPath)
    .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  console.log(`Cropped raw size: ${width}x${height}, channels: ${channels}`);

  // Flood-fill or color-key the background to remove white while keeping the silver body
  // Since the background is pure/near pure white (#ffffff, #fdfdfd, #f8f8f8),
  // and the silver trimmer has highlights and shadows, let's do an edge-connected flood fill from the borders!
  const isBg = new Uint8Array(width * height);
  const queue = [];

  function getPixel(x, y) {
    const idx = (y * width + x) * channels;
    return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
  }

  function isWhiteLike(r, g, b) {
    // Check if pixel is background white/light-grey
    return r >= 240 && g >= 240 && b >= 240 && Math.abs(r - g) < 15 && Math.abs(r - b) < 15;
  }

  // Push all perimeter pixels that are white-like to the flood fill queue
  for (let x = 0; x < width; x++) {
    const pTop = getPixel(x, 0);
    if (isWhiteLike(pTop[0], pTop[1], pTop[2])) {
      isBg[0 * width + x] = 1;
      queue.push([x, 0]);
    }
    const pBot = getPixel(x, height - 1);
    if (isWhiteLike(pBot[0], pBot[1], pBot[2])) {
      isBg[(height - 1) * width + x] = 1;
      queue.push([x, height - 1]);
    }
  }

  for (let y = 0; y < height; y++) {
    const pLeft = getPixel(0, y);
    if (isWhiteLike(pLeft[0], pLeft[1], pLeft[2])) {
      isBg[y * width + 0] = 1;
      queue.push([0, y]);
    }
    const pRight = getPixel(width - 1, y);
    if (isWhiteLike(pRight[0], pRight[1], pRight[2])) {
      isBg[y * width + (width - 1)] = 1;
      queue.push([width - 1, y]);
    }
  }

  // BFS Flood Fill from edges
  let head = 0;
  while (head < queue.length) {
    const [cx, cy] = queue[head++];
    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = ny * width + nx;
        if (!isBg[nIdx]) {
          const [nr, ng, nb] = getPixel(nx, ny);
          // If neighbor is very light or close to white, flood fill into it
          if (nr >= 235 && ng >= 235 && nb >= 235) {
            isBg[nIdx] = 1;
            queue.push([nx, ny]);
          } else if (nr >= 220 && ng >= 220 && nb >= 220 && Math.abs(nr - ng) < 10 && Math.abs(nr - nb) < 10) {
            // Soft shadow edge near white
            isBg[nIdx] = 1;
            queue.push([nx, ny]);
          }
        }
      }
    }
  }

  // Apply alpha transparency and anti-aliasing
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const bg = isBg[y * width + x];

      if (bg) {
        data[idx + 3] = 0; // Completely transparent
      } else {
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        // If near edge of white, apply smooth feathering
        if (r > 240 && g > 240 && b > 240) {
          // Check neighbors
          let hasBgNeighbor = false;
          const neighbors = [[x+1, y], [x-1, y], [x, y+1], [x, y-1]];
          for (const [nx, ny] of neighbors) {
            if (nx >= 0 && nx < width && ny >= 0 && ny < height && isBg[ny * width + nx]) {
              hasBgNeighbor = true;
              break;
            }
          }
          if (hasBgNeighbor) {
            data[idx + 3] = 0;
          }
        }
      }
    }
  }

  // Save the transparent PNG
  await sharp(data, { raw: { width, height, channels } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(outputPath);

  console.log('Saved transparent image to:', outputPath);
}

processImage().catch(console.error);
