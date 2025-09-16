// src\lib\cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

// Debug environment variables (without showing actual values)
console.log('=== CLOUDINARY DEBUG ===');
console.log('Environment check:', {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'SET ✓' : 'MISSING ✗',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'SET ✓' : 'MISSING ✗',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'SET ✓' : 'MISSING ✗',
  cloud_name_length: process.env.CLOUDINARY_CLOUD_NAME?.length || 0,
  api_key_length: process.env.CLOUDINARY_API_KEY?.length || 0,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'limit' | 'scale' | 'thumb' | 'fit';
  quality?: 'auto' | 'auto:good' | 'auto:best' | number;
  format?: 'jpg' | 'png' | 'webp' | 'auto';
}

export const uploadImageStream = async (
  buffer: Buffer,
  options: { folder?: string; public_id?: string } = {}
): Promise<CloudinaryUploadResult> => {
  
  console.log('🚀 Starting Cloudinary upload...', {
    bufferSize: buffer.length,
    folder: options.folder,
    timestamp: new Date().toISOString()
  });

  const uploadOptions: any = {
    folder: options.folder || 'wedding-photos',
    resource_type: 'image',
    timeout: 60000,
    chunk_size: 6000000, // 6MB chunks for large files
    use_filename: false,
    unique_filename: true,
  };
  
  if (options.public_id) uploadOptions.public_id = options.public_id;

  // Try Method 1: Base64 upload (more reliable for Vercel)
  try {
    console.log('📤 Trying base64 upload method...');
    const base64String = `data:image/jpeg;base64,${buffer.toString('base64')}`;
    
    const result = await cloudinary.uploader.upload(base64String, uploadOptions);
    
    console.log('✅ Base64 upload successful:', {
      public_id: result.public_id,
      bytes: result.bytes,
      format: result.format
    });

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (error: any) {
    console.error('❌ Base64 upload failed:', error.message);
    
    // If base64 fails, try stream upload as fallback
    console.log('📤 Trying stream upload as fallback...');
    
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) {
          console.error('❌ Stream upload also failed:', {
            message: error.message,
            http_code: error.http_code,
            name: error.name,
            error: error.error
          });
          return reject(error);
        }
        
        if (!result) {
          console.error('❌ No result from Cloudinary stream upload');
          return reject(new Error('No result from Cloudinary'));
        }

        console.log('✅ Stream upload successful as fallback:', {
          public_id: result.public_id,
          url_preview: result.secure_url.substring(0, 50) + '...',
          size: result.bytes
        });

        resolve({
          public_id: result.public_id,
          secure_url: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      });

      stream.end(buffer);
    });
  }
};

export const generateThumbnailUrl = (
  publicId: string,
  size = 400,
  options: CloudinaryTransformOptions = {}
): string => {
  const transformation = {
    width: size,
    height: size,
    crop: 'fill',
    quality: 'auto:good',
    fetch_format: 'auto',
    ...options,
  };
  return cloudinary.url(publicId, { transformation: [transformation], secure: true });
};

export const generateOptimizedUrl = (
  publicId: string,
  maxWidth = 2048,
  options: CloudinaryTransformOptions = {}
): string => {
  const transformation = {
    width: maxWidth,
    height: maxWidth,
    crop: 'limit',
    quality: 'auto:good',
    fetch_format: 'auto',
    ...options,
  };
  return cloudinary.url(publicId, { transformation: [transformation], secure: true });
};

export default cloudinary;