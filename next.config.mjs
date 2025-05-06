/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure output is set to 'standalone' for better compatibility with various hosting platforms
  output: 'standalone',
  // If you're deploying to a subdirectory, uncomment and set the basePath
  // basePath: '/your-base-path',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
