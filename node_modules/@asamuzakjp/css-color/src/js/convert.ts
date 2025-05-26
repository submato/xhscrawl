/**
 * convert.js
 */

import { LRUCache } from 'lru-cache';
import {
  convertColorToHsl,
  convertColorToHwb,
  convertColorToLab,
  convertColorToLch,
  convertColorToOklab,
  convertColorToOklch,
  convertColorToRgb,
  numberToHexString,
  parseColorFunc,
  parseColorValue
} from './color';
import { isString } from './common';
import { cssCalc } from './css-calc';
import { cssVar } from './css-var';
import { resolveRelativeColor } from './relative-color';
import { resolve } from './resolve';
import { valueToJsonString } from './util';

/* constants */
import {
  SYN_FN_MATH_CALC,
  SYN_FN_REL,
  SYN_FN_VAR,
  VAL_COMP
} from './constant.js';

/* regexp */
const REG_FN_MATH_CALC = new RegExp(SYN_FN_MATH_CALC);
const REG_FN_REL = new RegExp(SYN_FN_REL);
const REG_FN_VAR = new RegExp(SYN_FN_VAR);

/* cached results */
export const cachedResults = new LRUCache({
  max: 4096
});

/**
 * pre process
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @param {object} [opt.dimension] - dimension
 * @returns {?string} - value
 */
export const preProcess = (
  value: string,
  opt: {
    customProperty?: object;
    dimension?: object;
    format?: string;
  } = {}
): string | null => {
  if (isString(value)) {
    value = value.trim();
    if (!value) {
      return null;
    }
  } else {
    return null;
  }
  const { customProperty } = opt;
  let cacheKey;
  if (
    typeof (
      customProperty as { callback?: (item: string) => string }
    )?.callback !== 'function'
  ) {
    cacheKey = `{preProcess:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey) as string | null;
    }
  }
  if (REG_FN_VAR.test(value)) {
    const resolvedValue = cssVar(value, opt) as string | null;
    if (resolvedValue) {
      value = resolvedValue as string;
    } else {
      if (cacheKey) {
        cachedResults.set(cacheKey, resolvedValue!);
      }
      return null;
    }
  }
  if (REG_FN_REL.test(value)) {
    value = resolveRelativeColor(value, opt) as string;
  } else if (REG_FN_MATH_CALC.test(value)) {
    const resolvedValue = cssCalc(value, opt) as string | null;
    if (resolvedValue) {
      value = resolvedValue as string;
    } else {
      if (cacheKey) {
        cachedResults.set(cacheKey, resolvedValue!);
      }
      return null;
    }
  }
  if (value.startsWith('color-mix')) {
    value = resolve(value, {
      format: VAL_COMP
    }) as string;
  }
  if (cacheKey) {
    cachedResults.set(cacheKey, value);
  }
  return value;
};

/**
 * convert number to hex string
 * @param {number} value - color value
 * @returns {string} - hex string: 00..ff
 */
export const numberToHex = (value: number): string => {
  const cacheKey = typeof value === 'number' && `{numberToHex:${value}}`;
  if (cacheKey && cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey) as string;
  }
  const hex = numberToHexString(value);
  if (cacheKey) {
    cachedResults.set(cacheKey, hex);
  }
  return hex;
};

/**
 * convert color to hex
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {boolean} [opt.alpha] - return in #rrggbbaa notation
 * @param {object} [opt.customProperty] - custom properties
 * @param {object} [opt.dimension] - dimension
 * @returns {?string} - #rrggbb | #rrggbbaa | null
 */
export const colorToHex = (
  value: string,
  opt: {
    alpha?: boolean;
    customProperty?: object;
    dimension?: object;
    format?: string;
  } = {}
): string | null => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt) as string | null;
    if (resolvedValue) {
      value = resolvedValue.toLowerCase() as string;
    } else {
      return null!;
    }
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { alpha, customProperty } = opt;
  let cacheKey;
  if (
    typeof (
      customProperty as { callback?: (item: string) => string }
    )?.callback !== 'function'
  ) {
    cacheKey = `{colorToHex:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey) as string | null;
    }
  }
  let hex;
  if (alpha) {
    opt.format = 'hexAlpha';
    hex = resolve(value, opt) as string | null;
  } else {
    opt.format = 'hex';
    hex = resolve(value, opt) as string | null;
  }
  if (cacheKey) {
    cachedResults.set(cacheKey, hex!);
  }
  return hex;
};

/**
 * convert color to hsl
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @param {object} [opt.dimension] - dimension
 * @returns {Array.<number>} - [h, s, l, alpha]
 */
export const colorToHsl = (
  value: string,
  opt: {
    customProperty?: object;
    dimension?: object;
    format?: string;
  } = {}
): Array<number> => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt) as string | null;
    if (resolvedValue) {
      value = resolvedValue.toLowerCase() as string;
    } else {
      return [0, 0, 0, 0];
    }
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { customProperty } = opt;
  let cacheKey;
  if (
    typeof (
      customProperty as { callback?: (item: string) => string }
    )?.callback !== 'function'
  ) {
    cacheKey = `{colorToHsl:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey) as Array<number>;
    }
  }
  opt.format = 'hsl';
  const hsl = convertColorToHsl(value, opt) as Array<number>;
  if (cacheKey) {
    cachedResults.set(cacheKey, hsl);
  }
  return hsl;
};

/**
 * convert color to hwb
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @param {object} [opt.dimension] - dimension
 * @returns {Array.<number>} - [h, w, b, alpha]
 */
export const colorToHwb = (
  value: string,
  opt: {
    customProperty?: object;
    dimension?: object;
    format?: string;
  } = {}
): Array<number> => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt) as string | null;
    if (resolvedValue) {
      value = resolvedValue.toLowerCase() as string;
    } else {
      return [0, 0, 0, 0];
    }
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { customProperty } = opt;
  let cacheKey;
  if (
    typeof (
      customProperty as { callback?: (item: string) => string }
    )?.callback !== 'function'
  ) {
    cacheKey = `{colorToHwb:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey) as Array<number>;
    }
  }
  opt.format = 'hwb';
  const hwb = convertColorToHwb(value, opt) as Array<number>;
  if (cacheKey) {
    cachedResults.set(cacheKey, hwb);
  }
  return hwb;
};

/**
 * convert color to lab
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @param {object} [opt.dimension] - dimension
 * @returns {Array.<number>} - [l, a, b, alpha]
 */
export const colorToLab = (
  value: string,
  opt: {
    customProperty?: object;
    dimension?: object;
    format?: string;
  } = {}
): Array<number> => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt) as string | null;
    if (resolvedValue) {
      value = resolvedValue.toLowerCase() as string;
    } else {
      return [0, 0, 0, 0];
    }
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { customProperty } = opt;
  let cacheKey;
  if (
    typeof (
      customProperty as { callback?: (item: string) => string }
    )?.callback !== 'function'
  ) {
    cacheKey = `{colorToLab:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey) as Array<number>;
    }
  }
  const lab = convertColorToLab(value, opt) as Array<number>;
  if (cacheKey) {
    cachedResults.set(cacheKey, lab);
  }
  return lab;
};

/**
 * convert color to lch
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @param {object} [opt.dimension] - dimension
 * @returns {Array.<number>} - [l, c, h, alpha]
 */
export const colorToLch = (
  value: string,
  opt: {
    customProperty?: object;
    dimension?: object;
    format?: string;
  } = {}
): Array<number> => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt) as string | null;
    if (resolvedValue) {
      value = resolvedValue.toLowerCase() as string;
    } else {
      return [0, 0, 0, 0];
    }
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { customProperty } = opt;
  let cacheKey;
  if (
    typeof (
      customProperty as { callback?: (item: string) => string }
    )?.callback !== 'function'
  ) {
    cacheKey = `{colorToLch:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey) as Array<number>;
    }
  }
  const lch = convertColorToLch(value, opt) as Array<number>;
  if (cacheKey) {
    cachedResults.set(cacheKey, lch);
  }
  return lch;
};

/**
 * convert color to oklab
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @param {object} [opt.dimension] - dimension
 * @returns {Array.<number>} - [l, a, b, alpha]
 */
export const colorToOklab = (
  value: string,
  opt: {
    customProperty?: object;
    dimension?: object;
    format?: string;
  } = {}
): Array<number> => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt) as string | null;
    if (resolvedValue) {
      value = resolvedValue.toLowerCase() as string;
    } else {
      return [0, 0, 0, 0];
    }
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { customProperty } = opt;
  let cacheKey;
  if (
    typeof (
      customProperty as { callback?: (item: string) => string }
    )?.callback !== 'function'
  ) {
    cacheKey = `{colorToOklab:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey) as Array<number>;
    }
  }
  const lab = convertColorToOklab(value, opt) as Array<number>;
  if (cacheKey) {
    cachedResults.set(cacheKey, lab);
  }
  return lab;
};

/**
 * convert color to oklch
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @param {object} [opt.dimension] - dimension
 * @returns {Array.<number>} - [l, c, h, alpha]
 */
export const colorToOklch = (
  value: string,
  opt: {
    customProperty?: object;
    dimension?: object;
    format?: string;
  } = {}
): Array<number> => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt) as string | null;
    if (resolvedValue) {
      value = resolvedValue.toLowerCase() as string;
    } else {
      return [0, 0, 0, 0];
    }
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { customProperty } = opt;
  let cacheKey;
  if (
    typeof (
      customProperty as { callback?: (item: string) => string }
    )?.callback !== 'function'
  ) {
    cacheKey = `{colorToOklch:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey) as Array<number>;
    }
  }
  const lch = convertColorToOklch(value, opt) as Array<number>;
  if (cacheKey) {
    cachedResults.set(cacheKey, lch);
  }
  return lch;
};

/**
 * convert color to rgb
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @param {object} [opt.dimension] - dimension
 * @returns {Array.<number>} - [r, g, b, alpha]
 */
export const colorToRgb = (
  value: string,
  opt: {
    customProperty?: object;
    dimension?: object;
    format?: string;
  } = {}
): Array<number> => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt) as string | null;
    if (resolvedValue) {
      value = resolvedValue.toLowerCase() as string;
    } else {
      return [0, 0, 0, 0];
    }
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { customProperty } = opt;
  let cacheKey;
  if (
    typeof (
      customProperty as { callback?: (item: string) => string }
    )?.callback !== 'function'
  ) {
    cacheKey = `{colorToRgb:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey) as Array<number>;
    }
  }
  const rgb = convertColorToRgb(value, opt) as Array<number>;
  if (cacheKey) {
    cachedResults.set(cacheKey, rgb);
  }
  return rgb;
};

/**
 * convert color to xyz
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @param {object} [opt.d50] - white poin in d50
 * @param {object} [opt.dimension] - dimension
 * @returns {Array.<number>} - [x, y, z, alpha]
 */
export const colorToXyz = (
  value: string,
  opt: {
    customProperty?: object;
    d50?: boolean;
    dimension?: object;
    format?: string;
  } = {}
): Array<number> => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt) as string | null;
    if (resolvedValue) {
      value = resolvedValue.toLowerCase() as string;
    } else {
      return [0, 0, 0, 0];
    }
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { customProperty } = opt;
  let cacheKey;
  if (
    typeof (
      customProperty as { callback?: (item: string) => string }
    )?.callback !== 'function'
  ) {
    cacheKey = `{colorToXyz:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey) as Array<number>;
    }
  }
  let xyz;
  if (value.startsWith('color(')) {
    [, ...xyz] = parseColorFunc(value, opt) as [
      string,
      number,
      number,
      number,
      number
    ];
  } else {
    [, ...xyz] = parseColorValue(value, opt) as [
      string,
      number,
      number,
      number,
      number
    ];
  }
  if (cacheKey) {
    cachedResults.set(cacheKey, xyz as Array<number>);
  }
  return xyz as Array<number>;
};

/**
 * convert color to xyz-d50
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @param {object} [opt.dimension] - dimension
 * @returns {Array.<number>} - [x, y, z, alpha]
 */
export const colorToXyzD50 = (
  value: string,
  opt: {
    customProperty?: object;
    d50?: boolean;
    dimension?: object;
    format?: string;
  } = {}
): Array<number> => {
  opt.d50 = true;
  return colorToXyz(value, opt) as Array<number>;
};

/* convert */
export const convert = {
  colorToHex,
  colorToHsl,
  colorToHwb,
  colorToLab,
  colorToLch,
  colorToOklab,
  colorToOklch,
  colorToRgb,
  colorToXyz,
  colorToXyzD50,
  numberToHex
};
