/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Co-Founder',
  assetPrefix: '/Co-Founder',
  eslint: { ignoreDuringBuilds: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: '/Co-Founder',
  },
}
export default nextConfig
