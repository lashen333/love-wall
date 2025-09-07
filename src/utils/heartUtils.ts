// src\utils\heartUtils.ts
export interface HeartPoint {
  x: number;
  y: number;
  index: number;
}

export const generateHeartPoints = (centerX: number, centerY: number, size: number): HeartPoint[] => {
  const points: HeartPoint[] = [];
  const tileSize = 20; // 20px x 20px tiles
  const gridSize = Math.floor(size / tileSize);
  
  let index = 0;
  
  // Generate points in a grid pattern
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const x = col * tileSize;
      const y = row * tileSize;
      
      // Check if point is within heart shape
      if (isPointInHeart(x, y, size)) {
        points.push({
          x: centerX - size/2 + x,
          y: centerY - size/2 + y,
          index: index++
        });
      }
    }
  }
  
  // Limit to 1,000,000 points
  return points.slice(0, 1000000);
};

const isPointInHeart = (x: number, y: number, size: number): boolean => {
  // Normalize coordinates to -1 to 1 range
  const nx = (x / size) * 2 - 1;
  const ny = (y / size) * 2 - 1;
  
  // Heart equation: (x²+y²-1)³ - x²y³ ≤ 0
  const x2 = nx * nx;
  const y2 = ny * ny;
  const heartValue = Math.pow(x2 + y2 - 1, 3) - x2 * Math.pow(ny, 3);
  
  return heartValue <= 0;
};

export const generateSlug = (names: string): string => {
  const cleanNames = names
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .trim();
  
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${cleanNames}-${randomSuffix}`;
};

export const generateSecretCode = (): string => {
  return Math.random().toString().slice(2, 10); // 8-digit number
};

export const calculateProgress = (filledTiles: number, totalTiles: number = 1000000): number => {
  return Math.min((filledTiles / totalTiles) * 100, 100);
};

export const formatProgressText = (filledTiles: number, totalTiles: number = 1000000): string => {
  return `${filledTiles.toLocaleString()} / ${totalTiles.toLocaleString()} spots taken`;
};

