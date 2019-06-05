const { format, last, sort } = require('../util');

module.exports = colors;

function similar(color1, color2, same) {
  const tp = typeof color1;
  if (tp !== typeof color2) {
    return false;
  }
  if (tp === 'string') {
    color1 = color1.match(/hsla\((\d+), (\d+), (\d+), [\d\.]+\)/);
    color2 = color2.match(/hsla\((\d+), (\d+), (\d+), [\d\.]+\)/);
    return color1 && color2 &&
      color1[1] === color2[1] &&
      color1[2] === color2[2] &&
      color1[3] === color2[3] &&
      (!same || color1[4] === color2[4]);
  }
  if (tp === 'object' && Array.isArray(color1.stops) && Array.isArray(color2.stops) &&
      color1.stops.length === color2.stops.length) {
    return color1.stops.every((stop, i) => similar(last(stop), last(color2.stops[i])));
  }
  return false;
}

function matchColor(color) {
  return color.match(/hsla\(\d+, \d+, \d+, [\d\.]+\)/);
}

function isColor(color) {
  const tp = typeof color;
  return  (tp === 'string' && matchColor(color)) ||
    (tp === 'object' && color.stops && color.stops.every(stop => matchColor(last(stop))));
}

function getOpacity(color) {
  return parseFloat(color.match(/hsla\(\d+, \d+, \d+, ([\d\.]+)\)/)[1]);
}

function opacity(color) {
  const tp = typeof color;
  if (tp === 'string') {
    return getOpacity(color);
  }
  if (tp === 'object' && color.stops) {
    return color.stops.reduce((result, stop) => result + getOpacity(last(stop)), 0);
  }
}

function colors({ layers }) {
  let colorSpec = {};
  layers.forEach(layer => {
    let { id, paint, type } = layer;
    if (!paint) {
      return;
    }
    let color, halo, outline;
    if (type === 'symbol') {
      color = paint['text-color'];
      halo = paint['text-halo-color'];
      paint = {
        'text-color': color
      };
      if (halo) {
        paint['text-color'] = halo;
      }
    }
    else if (type === 'fill') {
      color = paint['fill-color'];
      outline = paint['fill-outline-color'];
      paint = {
          'fill-color': color
        };
      if (outline) {
        paint['fill-outline-color'] = outline;
      }
    }
    else if (type === 'fill-extrusion') {
      color = paint['fill-extrusion-color'];
      paint = {
        'fill-extrusion-color': color
      };
    }
    else if (type === 'line') {
      color = paint['line-color'];
      const underscore = id.indexOf('_');
      if (layer['source-layer'] === 'transportation' && underscore > -1) {
        const kind = id.substring(0, underscore);
        const group = id.substring(underscore + 1);
        if (kind === 'bridge' || kind === 'road' || kind === 'tunnel') {
          colorSpec[group] = colorSpec[group] || {
            paint: {}
          };
          colorSpec[group][kind] = color;
          colorSpec[group].paint[kind] = {
            'line-color': color
          };
          return;
        }
      }
    }
    if (color) {
      colorSpec[id] = { color, halo, outline, paint };
    }
  });

  Object.keys(sort(colorSpec)).forEach((key) => {
    let expect;
    const spec = colorSpec[key];
    let { color, halo, outline, bridge, road, tunnel, paint } = spec;
    if (key === 'path_pedestrian_casing') {
      // road is dashed with no casing
      road = road || bridge;
    }
    if (color) {
      if (color && !isColor(color)) {
        expect = 'color as HSLA';
      }
      if (halo && !isColor(halo)) {
        expect = 'halo color as HSLA';
      }
      if (outline && !isColor(outline)) {
        expect = 'outline color as HSLA';
      }
    }
    else if (!(bridge && road && tunnel)) {
      expect = 'bridge, road and tunnel';
    }
    else if (!(isColor(bridge) && isColor(road) && isColor(tunnel))) {
      expect = 'bridge, road and tunnel color as HSLA';
    }
    else if (!(similar(bridge, road, true) && similar(tunnel, road))) {
      expect = 'the same color for bridge, road and tunnel';
    }
    else if (opacity(bridge) !== opacity(road)) {
      expect = 'the same opacity for bridge and road';
    }
    else if (!(opacity(tunnel) < opacity(road) || key === 'path_pedestrian')) {
      expect = 'lower opacity for tunnel than road';
    }

    if (expect) {
      console.log('EXPECT', expect);
      console.log(key + ':', format(paint));
    }
  });
}

