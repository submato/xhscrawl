/**
 * common.js
 */

/* constants */
const TYPE_FROM = 8;
const TYPE_TO = -1;

/**
 * get type
 * @param {*} o - object to check
 * @returns {string} - type of object
 */
export const getType = (o: any): string =>
  Object.prototype.toString.call(o).slice(TYPE_FROM, TYPE_TO);

/**
 * is string
 * @param {*} o - object to check
 * @returns {boolean} - result
 */
export const isString = (o: any): o is string =>
  typeof o === 'string' || o instanceof String;
