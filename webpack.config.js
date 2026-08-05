const { withExpo } = require('@expo/webpack-config');

module.exports = async (env, argv) => {
  const config = await withExpo(env, argv);

  config.resolve = {
    ...(config.resolve || {}),
    fallback: {
      ...(config.resolve?.fallback || {}),
      path: require.resolve('path-browserify'),
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      os: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
      child_process: false,
    },
  };

  config.plugins = [
    ...(config.plugins || []),
    new (require('webpack').DefinePlugin)({
      __dirname: JSON.stringify('/'),
      __filename: JSON.stringify('/'),
    }),
  ];

  config.devServer = {
    ...(config.devServer || {}),
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  };

  return config;
};
