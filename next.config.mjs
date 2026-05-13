/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Co-Founder',
  assetPrefix: '/Co-Founder',
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true },
}
export default nextConfig
