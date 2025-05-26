/**
 * resolve.js
 */

import { LRUCache } from 'lru-cache';
import {
  convertRgbToHex,
  resolveColorFunc,
  resolveColorMix,
  resolveColorValue
} from './color';
import { isString } from './common';
import { cssCalc } from './css-calc';
import { cssVar } from './css-var';
import { resolveRelativeColor } from './relative-color';
import { valueToJsonString } from './util';

/* constants */
import {
  FN_COLOR,
  FN_MIX,
  SYN_FN_MATH_CALC,
  SYN_FN_REL,
  SYN_FN_VAR,
  VAL_COMP,
  VAL_SPEC
} from './constant.js';

const RGB_TRANSPARENT = 'rgba(0, 0, 0, 0)';

/* regexp */
const REG_FN_MATH_CALC = new RegExp(SYN_FN_MATH_CALC);
const REG_FN_REL = new RegExp(SYN_FN_REL);
const REG_FN_VAR = new RegExp(SYN_FN_VAR);

/* cached results */
export const cachedResults = new LRUCache({
  max: 4096
});

/**
 * resolve CSS color
 * @param {string} color - color value
 *   - system colors are not supported
 * @param {object} [opt] - options
 * @param {string} [opt.currentColor]
 *   - color to use for `currentcolor` keyword
 *   - if omitted, it will be treated as a missing color
 *     i.e. `rgb(none none none / none)`
 * @param {object} [opt.customProperty]
 *   - custom properties
 *   - pair of `--` prefixed property name and value,
 *     e.g. `customProperty: { '--some-color': '#0000ff' }`
 *   - and/or `callback` function to get the value of the custom property,
 *     e.g. `customProperty: { callback: someDeclaration.getPropertyValue }`
 * @param {object} [opt.dimension]
 *   - dimension, convert relative length to pixels
 *   - pair of unit and it's value as a number in pixels,
 *     e.g. `dimension: { em: 12, rem: 16, vw: 10.26 }`
 *   - and/or `callback` function to get the value as a number in pixels,
 *     e.g. `dimension: { callback: convertUnitToPixel }`
 * @param {string} [opt.format]
 *   - output format, one of below
 *   - `computedValue` (default), [computed value][139] of the color
 *   - `specifiedValue`, [specified value][140] of the color
 *   - `hex`, hex color notation, i.e. `rrggbb`
 *   - `hexAlpha`, hex color notation with alpha channel, i.e. `#rrggbbaa`
 * @param {*} [opt.key] - key e.g. CSS property `background-color`
 * @returns {?string|Array}
 *   - one of rgba?(), #rrggbb(aa)?, color-name, '(empty-string)',
 *     color(color-space r g b / alpha), color(color-space x y z / alpha),
 *     lab(l a b / alpha), lch(l c h / alpha), oklab(l a b / alpha),
 *     oklch(l c h / alpha), null or [key, rgba?()] etc. if `key` is specified
 *   - in `computedValue`, values are numbers, however `rgb()` values are
 *     integers
 *   - in `specifiedValue`, returns `empty string` for unknown and/or invalid
 *     color
 *   - in `hex`, returns `null` for `transparent`, and also returns `null` if
 *     any of `r`, `g`, `b`, `alpha` is not a number
 *   - in `hexAlpha`, returns `#00000000` for `transparent`,
 *     however returns `null` if any of `r`, `g`, `b`, `alpha` is not a number
 */
export const resolve = (
  color: string,
  opt: {
    currentColor?: string;
    customProperty?: object;
    dimension?: object;
    format?: string;
    key?: any;
  } = {}
): (string | Array<any>) | null => {
  if (isString(color)) {
    color = color.trim();
  } else {
    throw new TypeError(`${color} is not a string.`);
  }
  const { currentColor, customProperty = {}, format = VAL_COMP, key } = opt;
  let cacheKey;
  if (
    !REG_FN_VAR.test(color) ||
    typeof (
      customProperty as { callback?: (value: string) => string }
    ).callback === 'function'
  ) {
    cacheKey = `{resolve:${color},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey) as string | Array<any>;
    }
  }
  let res, cs, r, g, b, alpha;
  if (REG_FN_VAR.test(color)) {
    if (format === VAL_SPEC) {
      if (cacheKey) {
        cachedResults.set(cacheKey, color);
      }
      return color;
    }
    const resolvedColor = cssVar(color, opt);
    if (resolvedColor) {
      color = resolvedColor;
    } else {
      switch (format) {
        case 'hex':
        case 'hexAlpha': {
          if (cacheKey) {
            cachedResults.set(cacheKey, null!);
          }
          return null;
        }
        default: {
          res = RGB_TRANSPARENT;
          if (cacheKey) {
            cachedResults.set(cacheKey, res);
          }
          return res;
        }
      }
    }
  }
  if (opt.format !== format) {
    opt.format = format;
  }
  color = color.toLowerCase();
  if (REG_FN_REL.test(color)) {
    const resolvedColor = resolveRelativeColor(color, opt) as string | null;
    if (format === VAL_COMP) {
      if (resolvedColor) {
        res = resolvedColor;
      } else {
        res = RGB_TRANSPARENT;
      }
      if (cacheKey) {
        cachedResults.set(cacheKey, res);
      }
      return res;
    }
    if (format === VAL_SPEC) {
      if (resolvedColor) {
        res = resolvedColor;
      } else {
        res = '';
      }
      if (cacheKey) {
        cachedResults.set(cacheKey, res);
      }
      return res;
    }
    if (resolvedColor) {
      color = resolvedColor;
    } else {
      color = '';
    }
  }
  if (REG_FN_MATH_CALC.test(color)) {
    const resolvedColor = cssCalc(color, opt) as string | null;
    if (resolvedColor) {
      color = resolvedColor;
    } else {
      color = '';
    }
  }
  if (color === 'transparent') {
    switch (format) {
      case VAL_SPEC: {
        if (cacheKey) {
          cachedResults.set(cacheKey, color);
        }
        return color;
      }
      case 'hex': {
        if (cacheKey) {
          cachedResults.set(cacheKey, null!);
        }
        return null;
      }
      case 'hexAlpha': {
        res = '#00000000';
        if (cacheKey) {
          cachedResults.set(cacheKey, res);
        }
        return res;
      }
      case VAL_COMP:
      default: {
        res = RGB_TRANSPARENT;
        if (cacheKey) {
          cachedResults.set(cacheKey, res);
        }
        return res;
      }
    }
  } else if (color === 'currentcolor') {
    if (format === VAL_SPEC) {
      if (cacheKey) {
        cachedResults.set(cacheKey, color);
      }
      return color;
    }
    if (currentColor) {
      if (currentColor.startsWith(FN_MIX)) {
        [cs, r, g, b, alpha] = resolveColorMix(currentColor, opt) as [
          string,
          number,
          number,
          number,
          number
        ];
      } else if (currentColor.startsWith(FN_COLOR)) {
        [cs, r, g, b, alpha] = resolveColorFunc(currentColor, opt) as [
          string,
          number,
          number,
          number,
          number
        ];
      } else {
        [cs, r, g, b, alpha] = resolveColorValue(currentColor, opt) as [
          string,
          number,
          number,
          number,
          number
        ];
      }
    } else if (format === VAL_COMP) {
      res = RGB_TRANSPARENT;
      if (cacheKey) {
        cachedResults.set(cacheKey, res);
      }
      return res;
    }
  } else if (format === VAL_SPEC) {
    if (color.startsWith(FN_MIX)) {
      res = resolveColorMix(color, opt);
      if (cacheKey) {
        cachedResults.set(cacheKey, res!);
      }
      return res;
    } else if (color.startsWith(FN_COLOR)) {
      [cs, r, g, b, alpha] = resolveColorFunc(color, opt) as [
        string,
        number | string,
        number | string,
        number | string,
        number | string
      ];
      if (alpha === 1) {
        res = `color(${cs} ${r} ${g} ${b})`;
      } else {
        res = `color(${cs} ${r} ${g} ${b} / ${alpha})`;
      }
      if (cacheKey) {
        cachedResults.set(cacheKey, res);
      }
      return res;
    } else {
      const rgb = resolveColorValue(color, opt);
      if (!rgb) {
        res = '';
        if (cacheKey) {
          cachedResults.set(cacheKey, res);
        }
        return res;
      }
      [cs, r, g, b, alpha] = rgb;
      if (cs === 'rgb') {
        if (alpha === 1) {
          res = `${cs}(${r}, ${g}, ${b})`;
        } else {
          res = `${cs}a(${r}, ${g}, ${b}, ${alpha})`;
        }
        if (cacheKey) {
          cachedResults.set(cacheKey, res);
        }
        return res;
      }
      if (alpha === 1) {
        res = `${cs}(${r} ${g} ${b})`;
      } else {
        res = `${cs}(${r} ${g} ${b} / ${alpha})`;
      }
      if (cacheKey) {
        cachedResults.set(cacheKey, res);
      }
      return res;
    }
  } else if (/currentcolor/.test(color)) {
    if (currentColor) {
      color = color.replace(/currentcolor/g, currentColor);
    }
    if (/transparent/.test(color)) {
      color = color.replace(/transparent/g, RGB_TRANSPARENT);
    }
    if (color.startsWith(FN_MIX)) {
      [cs, r, g, b, alpha] = resolveColorMix(color, opt) as [
        string,
        number,
        number,
        number,
        number
      ];
    }
  } else if (/transparent/.test(color)) {
    color = color.replace(/transparent/g, RGB_TRANSPARENT);
    if (color.startsWith(FN_MIX)) {
      [cs, r, g, b, alpha] = resolveColorMix(color, opt) as [
        string,
        number,
        number,
        number,
        number
      ];
    }
  } else if (color.startsWith(FN_MIX)) {
    [cs, r, g, b, alpha] = resolveColorMix(color, opt) as [
      string,
      number,
      number,
      number,
      number
    ];
  } else if (color.startsWith(FN_COLOR)) {
    [cs, r, g, b, alpha] = resolveColorFunc(color, opt) as [
      string,
      number,
      number,
      number,
      number
    ];
  } else if (color) {
    [cs, r, g, b, alpha] = resolveColorValue(color, opt) as [
      string,
      number,
      number,
      number,
      number
    ];
  }
  switch (format) {
    case 'hex': {
      let hex;
      if (
        isNaN(r as number) ||
        isNaN(g as number) ||
        isNaN(b as number) ||
        isNaN(alpha as number) ||
        alpha === 0
      ) {
        hex = null;
      } else {
        hex = convertRgbToHex([r as number, g as number, b as number]);
      }
      if (key) {
        res = [key, hex];
      } else {
        res = hex;
      }
      break;
    }
    case 'hexAlpha': {
      let hex;
      if (
        isNaN(r as number) ||
        isNaN(g as number) ||
        isNaN(b as number) ||
        isNaN(alpha as number)
      ) {
        hex = null;
      } else {
        hex = convertRgbToHex([
          r as number,
          g as number,
          b as number,
          alpha as number
        ]);
      }
      if (key) {
        res = [key, hex];
      } else {
        res = hex;
      }
      break;
    }
    case VAL_COMP:
    default: {
      let value;
      switch (cs) {
        case 'rgb': {
          if (alpha === 1) {
            value = `${cs}(${r}, ${g}, ${b})`;
          } else {
            value = `${cs}a(${r}, ${g}, ${b}, ${alpha})`;
          }
          break;
        }
        case 'lab':
        case 'lch':
        case 'oklab':
        case 'oklch': {
          if (alpha === 1) {
            value = `${cs}(${r} ${g} ${b})`;
          } else {
            value = `${cs}(${r} ${g} ${b} / ${alpha})`;
          }
          break;
        }
        // color()
        default: {
          if (alpha === 1) {
            value = `color(${cs} ${r} ${g} ${b})`;
          } else {
            value = `color(${cs} ${r} ${g} ${b} / ${alpha})`;
          }
        }
      }
      if (key) {
        res = [key, value];
      } else {
        res = value;
      }
    }
  }
  if (cacheKey) {
    cachedResults.set(cacheKey, res!);
  }
  return res;
};
