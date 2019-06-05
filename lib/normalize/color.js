/*
 * normalize color to rgba
 */

module.exports = normalize;

const { parseCSSColor } = require('csscolorparser');
const { copyColor, toHSLA } = require('../util');

function color(c) {
  const tp = typeof c;
  if (tp === 'string') {
    const pC = parseCSSColor(c);
    if (pC) {
      return toHSLA(pC);
    }
  }
  else if (tp === 'object' && Array.isArray(c.stops)) {
    c.stops.forEach(stop => stop.push(color(stop.pop())));
  }
  return c;
}

const copy = {
  bridge_: (c) => c,
  tunnel_: copyColor
};

function normalize(layer, { road }) {
  const { paint } = layer;
  if (!paint) {
    return layer;
  }
  [
    'fill-color',
    'fill-extrusion-color',
    'fill-outline-color',
    'line-color',
    'text-color',
    'text-halo-color'
  ].forEach(key => {
    if (paint[key]) {
      paint[key] = color(paint[key]);
    }
  });
  ['bridge_', 'tunnel_'].forEach(prefix => {
    if (layer.id.startsWith(prefix)) {
      const roadLayer = road[layer.id.replace(prefix, 'road_')];
      if (roadLayer && roadLayer.paint['line-color']) {
        layer.paint['line-color'] = copy[prefix](roadLayer.paint['line-color'], layer.paint['line-color']);
      }
    }
  });
  return layer;
}
