/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable cross-origin isolation if needed
  },

  eslint: {
    // Completely disable ESLint during builds
    ignoreDuringBuilds: true,
  },

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'http://leather.local', // Your WordPress domain
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-Requested-With, Content-Type, Accept, Origin, Authorization, X-WC-Store-API-Nonce, Cart-Token, cart-hash, nonce',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/wp-json/:path*',
        destination: 'http://leather.local/wp-json/:path*', // Your WordPress API
      },
    ];
  },
};

module.exports = nextConfig;
