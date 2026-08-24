import sharp from 'sharp';
import path from 'path';

async function extractRakhiOrnament() {
  const inputPath = path.resolve('../frontend/public/raksha-bandhan-clean-transparent.png');
  const outputPath = path.resolve('../frontend/public/festive-rakhi-ornament.png');

  // Upper Rakhi crop
  await sharp(inputPath)
    .extract({ left: 150, top: 275, width: 250, height: 75 })
    .png()
    .toFile(outputPath);

  console.log('Saved festive-rakhi-ornament.png');
}

extractRakhiOrnament().catch(console.error);
