// src\utils\imageUtils.ts
export const resizeImage = (file: File, maxWidth: number = 2048): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      }, 'image/jpeg', 0.85);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export const generateThumbnail = (file: File, size: number = 400): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }
    
    img.onload = () => {
      // Calculate dimensions to maintain aspect ratio
      const ratio = Math.min(size / img.width, size / img.height);
      const newWidth = img.width * ratio;
      const newHeight = img.height * ratio;
      
      canvas.width = size;
      canvas.height = size;
      
      // Center the image
      const offsetX = (size - newWidth) / 2;
      const offsetY = (size - newHeight) / 2;
      
      ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create thumbnail blob'));
        }
      }, 'image/jpeg', 0.8);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Please upload a JPEG, PNG, or WebP image' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 10MB' };
  }
  
  return { valid: true };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Image lazy loading utility
export const createLazyImageLoader = () => {
  const imageCache = new Map<string, string>();
  
  return {
    loadImage: (src: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        if (imageCache.has(src)) {
          resolve(imageCache.get(src)!);
          return;
        }

        const img = new Image();
        img.onload = () => {
          imageCache.set(src, src);
          resolve(src);
        };
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
      });
    },
    preloadImages: (urls: string[]): Promise<string[]> => {
      return Promise.all(urls.map(url => {
        return new Promise<string>((resolve, reject) => {
          if (imageCache.has(url)) {
            resolve(url);
            return;
          }
          
          const img = new Image();
          img.onload = () => {
            imageCache.set(url, url);
            resolve(url);
          };
          img.onerror = () => reject(new Error(`Failed to preload: ${url}`));
          img.src = url;
        });
      }));
    },
    clearCache: () => imageCache.clear()
  };
};

// Optimized image resizing with better compression
export const optimizeImage = (file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }
    
    img.onload = () => {
      // Calculate optimal dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      const newWidth = Math.floor(img.width * ratio);
      const newHeight = Math.floor(img.height * ratio);
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // Enable image smoothing for better quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create optimized blob'));
        }
      }, 'image/webp', quality);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for optimization'));
    };
    
    img.src = URL.createObjectURL(file);
  });
};

