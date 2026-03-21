/** @Config.Next */
export default {
  productionBrowserSourceMaps: false,
  webpack: (config, { dev }) => {
    if (!dev) {
      config.devtool = false
    }
    return config
  },
}

