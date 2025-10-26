// src\scripts\delete-cloudinary-images.ts
// src/scripts/delete-cloudinary-images.ts
import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function deleteAllImages() {
  try {
    console.log('🔄 Fetching all images from Cloudinary...');
    
    // Get all resources in your cloud
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 500, // Adjust if you have more
    });

    console.log(`📸 Found ${result.resources.length} images`);

    if (result.resources.length === 0) {
      console.log('✅ No images to delete');
      return;
    }

    // Delete each image
    for (const resource of result.resources) {
      console.log(`🗑️  Deleting: ${resource.public_id}`);
      await cloudinary.uploader.destroy(resource.public_id);
    }

    console.log('✅ All images deleted from Cloudinary!');
  } catch (error) {
    console.error('❌ Error deleting images:', error);
  }
}

deleteAllImages();