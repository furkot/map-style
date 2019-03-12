/*
 *  utility to validate map style
 */

const color = require('./color');
const dash = require('./dash');

if (process.argv.length >= 2) {
  const style = require(process.argv[2]);
  color(style);
  dash(style);
}
