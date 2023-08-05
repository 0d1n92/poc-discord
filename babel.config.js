
require('dotenv/config');

module.exports = function (api) {
  const isProd = process.env.MODE === 'PROD';

  api.cache(true);

  const plugins = [];
  if (isProd) {
    plugins.push('transform-remove-console');
  }

  return {
    presets: [['@babel/preset-typescript', { allowDeclareFields: true }]],
    plugins,
  };
};
