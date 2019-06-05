module.exports = copy;

const { parseCSSColor } = require('csscolorparser');
const { copyColor, last, toHSLA } = require('../util');

function fixOpacity(c, opacity) {
  const tp = typeof c;
  if (tp === 'string') {
    const pC = parseCSSColor(c);
    if (last(pC) === 1) {
      pC[pC.length - 1] = opacity;
      return toHSLA(pC);
    }
  }
  else if (tp === 'object' && Array.isArray(c.stops)) {
    c.stops.forEach(stop => stop.push(fixOpacity(stop.pop(), opacity)));
  }
  return c;
}


function copy(from, to, { tunnelOpacity }) {
  if (!from) {
    return;
  }

  let color;
  if (to.id.startsWith('tunnel_')) {
    to.paint['line-color'] = copyColor(from.paint['line-color'], to.paint['line-color']);
    to.paint['line-color'] = fixOpacity(to.paint['line-color'], tunnelOpacity);
    color = to.paint['line-color'];
  }
  ['layout', 'minzoom', 'maxzoom', 'paint'].forEach(prop => to[prop] = from[prop]);
  if (color) {
    to.paint['line-color'] = color;
  }
}
