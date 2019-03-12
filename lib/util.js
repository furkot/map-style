module.exports = {
    format,
    last,
    sort
};

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
