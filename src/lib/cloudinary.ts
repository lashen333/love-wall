// src\lib\cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary (server-side only)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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

export const uploadImage = async (
  file: Buffer | string,
  options: {
    folder?: string;
    public_id?: string;
    transformation?: CloudinaryTransformOptions;
  } = {}
): Promise<CloudinaryUploadResult> => {
  try {
    let uploadData: string;
    if (Buffer.isBuffer(file)) {
      uploadData = `data:image/jpeg;base64,${file.toString('base64')}`;
    } else {
      uploadData = file;
    }

    const uploadOptions: any = {
      folder: options.folder || 'wedding-photos',
      resource_type: 'image',
      transformation: {
        quality: 'auto:good',
        fetch_format: 'auto',
        ...options.transformation,
      },
    };

    if (options.public_id) {
      uploadOptions.public_id = options.public_id;
    }

    const result = await cloudinary.uploader.upload(uploadData, uploadOptions);

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

export const uploadImageStream = async (
  file: Buffer,
  options: {
    folder?: string;
    public_id?: string;
    transformation?: CloudinaryTransformOptions;
  } = {}
): Promise<CloudinaryUploadResult> => {
  try {
    const uploadOptions: any = {
      folder: options.folder || 'wedding-photos',
      resource_type: 'image',
      transformation: {
        quality: 'auto:good',
        fetch_format: 'auto',
        ...options.transformation,
      },
    };

    if (options.public_id) {
      uploadOptions.public_id = options.public_id;
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({
              public_id: result.public_id,
              secure_url: result.secure_url,
              width: result.width,
              height: result.height,
              format: result.format,
              bytes: result.bytes,
            });
          } else {
            reject(new Error('Upload failed'));
          }
        }
      );

      const { Readable } = require('stream');
      const stream = Readable.from(file);
      stream.pipe(uploadStream);
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

export const generateThumbnailUrl = (
  publicId: string,
  size: number = 400,
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

  return cloudinary.url(publicId, {
    transformation: [transformation],
    secure: true,
  });
};

export const generateOptimizedUrl = (
  publicId: string,
  maxWidth: number = 2048,
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

  return cloudinary.url(publicId, {
    transformation: [transformation],
    secure: true,
  });
};

export const deleteImage = async (publicId: string): Promise<boolean> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
};

export const getImageInfo = async (publicId: string) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary get info error:', error);
    throw new Error('Failed to get image info');
  }
};

export default cloudinary;
