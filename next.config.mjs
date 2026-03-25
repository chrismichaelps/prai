/** @Config.Next */
export default {
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'uvrjhxpsbhffmtmbuahv.supabase.co',
        pathname: '**',
      },
    ],
  },
  webpack: (config, { dev }) => {
    if (!dev) {
      config.devtool = false
    }
    return config
  },
}

