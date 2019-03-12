const { format, sort } = require('../util');

module.exports = dashes;

function dashes({ layers }) {
  let dashSpec = {};
  layers.forEach(layer => {
    const { id, paint, type } = layer;
    if (type !== 'line') {
      return;
    }
    if (id.startsWith('tunnel_') || (paint && paint['line-dasharray'])) {
      dashSpec[id] = {
          dash: paint && paint['line-dasharray']
      };
    }
  });

  let refDash;
  Object.keys(sort(dashSpec)).forEach((key) => {
    let expect;
    const spec = dashSpec[key];
    let { dash } = spec;
    if (key === 'tunnel_path_pedestrian' ||
        key === 'tunnel_major_rail_hatching' ||
        key === 'tunnel_path_pedestrian_casing') {
      return;
    }
    if (!(key.startsWith('tunnel_') && key.endsWith('_casing'))) {
      return;
    }
    if (!dash) {
      expect = 'dashed outline for tunnels';
    }
    else {
      if (!refDash) {
        refDash = dash;
        return;
      }
      if (!(dash[0] === refDash[0] && dash[0] === refDash[0])) {
        expect = 'the same dash spec for all tunnels';
      }
    }

    if (expect) {
      console.log('EXPECT', expect);
      console.log(key + ':', format(spec));
    }
  });
}