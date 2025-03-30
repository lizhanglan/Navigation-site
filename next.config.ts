/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizeCss: true,
  },
  // Next.js不允许在next.config.ts的env中设置NODE_OPTIONS
  // 请在运行命令前设置环境变量，例如：
  // Windows: set NODE_OPTIONS=--max-old-space-size=4096 && next dev
  // Linux/Mac: NODE_OPTIONS=--max-old-space-size=4096 next dev
  // 或者在package.json的scripts中设置
};

module.exports = nextConfig;
