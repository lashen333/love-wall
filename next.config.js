/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { domains: ['res.cloudinary.com', 'localhost'] },
  env: { CUSTOM_KEY: 'my-value' },
};
module.exports = nextConfig;
