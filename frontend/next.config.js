const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    API_INTERNAL_BASE_URL: process.env.API_INTERNAL_BASE_URL || process.env.API_BASE_URL
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    API_BASE_URL: process.env.API_BASE_URL
  }
};

module.exports = nextConfig;
