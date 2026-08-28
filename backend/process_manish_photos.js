import sharp from 'sharp';
import path from 'path';

async function processProfilePhotos() {
  const photo1Input = 'C:/Users/brayw/.gemini/antigravity/brain/153b417f-0115-4062-8d25-bae3bddca31f/.user_uploaded/media_1787930156744.jpg';
  const photo2Input = 'C:/Users/brayw/.gemini/antigravity/brain/153b417f-0115-4062-8d25-bae3bddca31f/.user_uploaded/media_1787930150835.jpg';

  const photo1Output = path.resolve('../frontend/public/manish-kumar.jpg');
  const photo1Webp = path.resolve('../frontend/public/manish-kumar.webp');
  const photo2Output = path.resolve('../frontend/public/manish-kumar-casual.jpg');
  const photo2Webp = path.resolve('../frontend/public/manish-kumar-casual.webp');

  // Photo 1 (Executive Portrait)
  await sharp(photo1Input)
    .resize(1000, 1000, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 92 })
    .toFile(photo1Output);

  await sharp(photo1Input)
    .resize(1000, 1000, { fit: 'cover', position: 'center' })
    .webp({ quality: 92 })
    .toFile(photo1Webp);

  // Photo 2
  await sharp(photo2Input)
    .resize(1000, 1000, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 92 })
    .toFile(photo2Output);

  await sharp(photo2Input)
    .resize(1000, 1000, { fit: 'cover', position: 'center' })
    .webp({ quality: 92 })
    .toFile(photo2Webp);

  console.log('Saved Manish Kumar profile photos to public directory');
}

processProfilePhotos().catch(console.error);
