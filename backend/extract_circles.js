import sharp from 'sharp';
import path from 'path';

async function extractFeatureCircles() {
  const inputPath = 'C:/Users/brayw/.gemini/antigravity/brain/153b417f-0115-4062-8d25-bae3bddca31f/.user_uploaded/media_1787564007062.png';
  const outDir = path.resolve('../frontend/public');

  const meta = await sharp(inputPath).metadata();
  console.log('Image dimensions:', meta.width, meta.height);

  const features = [
    { name: 'circle-eyebrow.png', left: 250, top: 20, width: 140, height: 140 },
    { name: 'circle-face.png', left: 460, top: 45, width: 135, height: 135 },
    { name: 'circle-neck.png', left: 110, top: 205, width: 140, height: 140 },
    { name: 'circle-arm.png', left: 600, top: 235, width: 140, height: 140 },
    { name: 'circle-underarm.png', left: 85, top: 460, width: 140, height: 140 },
    { name: 'circle-leg.png', left: 565, top: 495, width: 140, height: 140 },
    { name: 'circle-baby.png', left: 190, top: 565, width: 145, height: 145 },
    { name: 'circle-bikini.png', left: 435, top: 565, width: 145, height: 145 },
  ];

  for (const f of features) {
    try {
      const circleMask = Buffer.from(
        `<svg width="${f.width}" height="${f.height}"><circle cx="${f.width/2}" cy="${f.height/2}" r="${f.width/2}" fill="white" /></svg>`
      );

      await sharp(inputPath)
        .extract({ left: f.left, top: f.top, width: f.width, height: f.height })
        .composite([{ input: circleMask, blend: 'dest-in' }])
        .png()
        .toFile(path.join(outDir, f.name));

      console.log(`Extracted: ${f.name}`);
    } catch (e) {
      console.error(`Failed to extract ${f.name}:`, e.message);
    }
  }
}

extractFeatureCircles().catch(console.error);
