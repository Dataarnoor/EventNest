/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/pdf'
          },
          {
            key: 'Content-Disposition',
            value: 'inline'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          }
        ],
      },
    ];
  },
  // Enable static file serving from public directory
  transpilePackages: ['pdf-viewer'],
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  }
};

module.exports = nextConfig;
