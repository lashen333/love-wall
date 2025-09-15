// src/lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,   // must be set in Vercel
  api_key: process.env.CLOUDINARY_API_KEY!,         // must be set in Vercel
  api_secret: process.env.CLOUDINARY_API_SECRET!,   // must be set in Vercel
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
  const uploadOptions: any = {
    folder: options.folder || 'wedding-photos',
    resource_type: 'image',
  };
  if (options.public_id) uploadOptions.public_id = options.public_id;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) return reject(error);
      if (!result) return reject(new Error('No result from Cloudinary'));
      resolve({
        public_id: result.public_id,
        secure_url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      });
    });

    // The simplest, most reliable way: write the whole buffer and end.
    stream.end(buffer);
  });
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
