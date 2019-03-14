/*
 *  utility to merge map styles
 */

const fs = require('fs');
const path = require('path');
const copy = require('./copy');

if (process.argv.length >= 3) {
  const toStyle = require(process.argv[2]);
  const style = require(process.argv[3]);
  ['version', 'name', 'sprite', 'glyphs', 'sources'].forEach(key => style[key] = toStyle[key]);

  let config = require('../config');
  config = Object.assign({
    tunnelOpacity: '0.8'
  }, config[style.name] || {});

  const layers = style.layers.reduce((result, layer) => {
    const { id } = layer;
    result[id] = layer;
    return result;
  }, {});
  toStyle.layers.forEach(layer => {
    const { id } = layer;
    copy(layers[id], layer, config);
    delete layers[id];
  });
  if (Object.keys(layers).length) {
    console.log('Layers left:', Object.keys(layers).join(', '));
  }
  fs.writeFileSync(path.resolve(__dirname, process.argv[2]), JSON.stringify(toStyle, undefined, 2));
}
