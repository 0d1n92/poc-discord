
module.exports = function (api) {
  api.cache(true);

  const plugins = [];

    plugins.push('transform-remove-console');
    plugins.push('const-enum');


  return {
    presets: [['@babel/preset-typescript', { allowDeclareFields: true }]],
    plugins,
    comments: false
  };
};
