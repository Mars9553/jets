const { withExpo } = require('@expo/webpack-config');

module.exports = async (env, argv) => {
  const config = await withExpo(env, argv);

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
