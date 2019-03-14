module.exports = {
  copyColor,
  format,
  last,
  sort,
  toRGBA
};

const { parseCSSColor } = require('csscolorparser');

function toRGBA(c) {
  return 'rgba(' + c.join(', ') + ')';
}

function copyColor(from, to) {
  const tp = typeof from;
  if (tp !== typeof to) {
    return from;
  }
  if (tp === 'string') {
    const pC = parseCSSColor(from);
    pC[pC.length - 1] = last(parseCSSColor(to));
    return toRGBA(pC);
  }
  if (tp === 'object' && Array.isArray(from.stops) && Array.isArray(to.stops) &&
      from.stops.length === to.stops.length) {
    return {
      stops: from.stops.map((stop, i) => {
        stop = stop.slice();
        stop[stop.length - 1] = copyColor(last(stop), last(to.stops[i]));
        return stop;
      })
    };
  }
  return from;
}

function format(obj) {
  return JSON.stringify(obj, null, 2);
}

function last(arr) {
  return arr[arr.length - 1];
}

function sort(obj) {
  return Object.keys(obj).sort().reduce((result, key) => {
    result[key] = obj[key];
    return result;
  }, {});
}
