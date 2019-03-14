/*
 *  utility to normalize map style
 *   - sorts keys alphabetically
 *   - replaces tabs by spaces
 *   - sets sources, sprite and glyphs to predefined values
 */

const fs = require('fs');
const path = require('path');
const color = require('./color');

function sameOp(result, el) {
  let { op, filter } = result;
  if (el[0] === op) {
    filter.push(...el.slice(1));
  }
  else {
    filter.push(el);
  }
  return result;
}

function addField(result, key) {
  let { object } = result;
  if (key === 'filter') {
    let { filter } = object;
    if (filter[0] === 'all' || filter[0] === 'any') {
      if (filter.length === 1) {
        return result;
      }
      if (filter.length === 2) {
        object.filter = filter[1];
      }
      else {
        object.filter = filter.reduce(sameOp, {
          op: filter[0],
          filter: []
        }).filter;
      }
    }
  }
  else if (key === 'layout' && object[key].visibility === 'visible') {
    delete object[key].visibility;
  }
  else if (object.type === 'line') {
    if (key === 'paint') {
      if (object[key]['line-opacity'] === 1) {
        delete object[key]['line-opacity'];
      }
    }
    else if (key === 'layout') {
      if (object[key]['line-join'] === 'miter') {
        delete object[key]['line-join'];
      }
      if (object[key]['line-cap'] === 'butt') {
        delete object[key]['line-cap'];
      }
    }
  }
  result.result[key] = sortKeys(result.object[key]);
  return result;
}

function sortKeys(object) {
  if (Array.isArray(object)) {
    return object.map(sortKeys);
  }
  if (typeof (object) !== 'object') {
    return object;
  }
  if (!Object.keys(object).length) {
    return;
  }
  return Object.keys(object).sort().reduce(addField, {
    object,
    result: {}
  }).result;
}

if (process.argv.length >= 3) {
  const style = require(process.argv[3] || process.argv[2]);

  const config = {
    road: style.layers.reduce((result, layer) => {
      const { id } = layer;
      if (id.startsWith('road_')) {
        result[id] = layer;
      }
      return result;
    }, {})
  };

  style.layers = sortKeys(style.layers.map(function (layer) {
    return color(layer, config);
  }));
  fs.writeFileSync(path.resolve(__dirname, process.argv[2]), JSON.stringify(style, undefined, 2));
}
