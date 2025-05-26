/**
 * css-var.js
 */

import { TokenType, tokenize } from '@csstools/css-tokenizer';
import { LRUCache } from 'lru-cache';
import { isString } from './common';
import { cssCalc } from './css-calc';
import { isColor, valueToJsonString } from './util';

/* types */
import type { CSSToken } from '@csstools/css-tokenizer';

/* constants */
import { FN_VAR, SYN_FN_MATH_CALC, SYN_FN_VAR, VAL_SPEC } from './constant';
const {
  CloseParen: PAREN_CLOSE,
  Comment: COMMENT,
  EOF,
  Ident: IDENT,
  Whitespace: W_SPACE
} = TokenType;

/* regexp */
const REG_FN_MATH_CALC = new RegExp(SYN_FN_MATH_CALC);
const REG_FN_VAR = new RegExp(SYN_FN_VAR);

/* cached results */
export const cachedResults = new LRUCache({
  max: 4096
});

/**
 * resolve custom property
 * @param {Array.<Array>} tokens - tokens
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @returns {Array.<string|Array|undefined>} - [tokens, resolvedValue]
 */
export function resolveCustomProperty(
  tokens: Array<CSSToken>,
  opt: {
    customProperty?: object;
    dimension?: object;
    format?: string;
  } = {}
): Array<string | Array<CSSToken> | undefined> {
  if (!Array.isArray(tokens)) {
    throw new TypeError(`${tokens} is not an array.`);
  }
  const { customProperty = {} } = opt;
  const items = [];
  while (tokens.length) {
    const token = tokens.shift();
    if (!Array.isArray(token)) {
      throw new TypeError(`${token} is not an array.`);
    }
    const [type, value] = token as [string, string];
    // end of var()
    if (type === PAREN_CLOSE) {
      break;
    }
    // nested var()
    if (value === FN_VAR) {
      const [restTokens, item] = resolveCustomProperty(tokens, opt) as [
        Array<CSSToken>,
        string
      ];
      tokens = restTokens;
      if (item) {
        items.push(item);
      }
    } else if (type === IDENT) {
      if (value.startsWith('--')) {
        if (Object.hasOwnProperty.call(customProperty, value)) {
          items.push(customProperty[value as never]);
        } else if (
          typeof (
            customProperty as { callback?: (value: string) => string }
          ).callback === 'function'
        ) {
          const item = (
            customProperty as { callback: (value: string) => string }
          ).callback(value);
          if (item) {
            items.push(item);
          }
        }
      } else if (value) {
        items.push(value);
      }
    }
  }
  let resolveAsColor;
  if (items.length > 1) {
    const lastValue = items[items.length - 1];
    resolveAsColor = isColor(lastValue as string) as boolean;
  }
  let resolvedValue;
  for (let item of items) {
    item = item.trim() as string;
    if (REG_FN_VAR.test(item)) {
      // recurse cssVar()
      item = cssVar(item, opt) as string;
      if (item) {
        if (resolveAsColor) {
          if (isColor(item)) {
            resolvedValue = item;
          }
        } else {
          resolvedValue = item;
        }
      }
    } else if (REG_FN_MATH_CALC.test(item)) {
      item = cssCalc(item as string, opt) as string;
      if (resolveAsColor) {
        if (isColor(item)) {
          resolvedValue = item;
        }
      } else {
        resolvedValue = item;
      }
    } else if (
      item &&
      !/^(?:inherit|initial|revert(?:-layer)?|unset)$/.test(item)
    ) {
      if (resolveAsColor) {
        if (isColor(item)) {
          resolvedValue = item;
        }
      } else {
        resolvedValue = item;
      }
    }
    if (resolvedValue) {
      break;
    }
  }
  return [tokens, resolvedValue];
}

/**
 * parse tokens
 * @param {Array.<Array>} tokens - tokens
 * @param {object} [opt] - options
 * @returns {?Array.<string>} - parsed tokens
 */
export function parseTokens(
  tokens: Array<CSSToken>,
  opt: object = {}
): Array<string> | null {
  const res = [] as string[];
  while (tokens.length) {
    const token = tokens.shift();
    const [type, value] = token as [string, string];
    if (value === FN_VAR) {
      const [restTokens, resolvedValue] = resolveCustomProperty(tokens, opt);
      if (!resolvedValue) {
        return null;
      }
      tokens = restTokens as Array<CSSToken>;
      res.push(resolvedValue as string);
    } else {
      switch (type) {
        case PAREN_CLOSE: {
          if (res.length) {
            const lastValue = res[res.length - 1];
            if (lastValue === ' ') {
              res.splice(-1, 1, value);
            } else {
              res.push(value);
            }
          } else {
            res.push(value);
          }
          break;
        }
        case W_SPACE: {
          if (res.length) {
            const lastValue = res[res.length - 1] as string;
            if (!lastValue.endsWith('(') && lastValue !== ' ') {
              res.push(value);
            }
          }
          break;
        }
        default: {
          if (type !== COMMENT && type !== EOF) {
            res.push(value);
          }
        }
      }
    }
  }
  return res;
}

/**
 * resolve CSS var()
 * @param {string} value - color value including var()
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @returns {?string} - value
 */
export function cssVar(
  value: string,
  opt: {
    customProperty?: object;
    format?: string;
  } = {}
): string | null {
  const { customProperty = {}, format } = opt;
  if (isString(value)) {
    if (!REG_FN_VAR.test(value) || format === VAL_SPEC) {
      return value;
    }
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  let cacheKey;
  if (
    typeof (
      customProperty as { callback?: (value: string) => string }
    ).callback !== 'function'
  ) {
    cacheKey = `{cssVar:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey) as string | null;
    }
  }
  const tokens = tokenize({ css: value });
  const values = parseTokens(tokens, opt);
  if (Array.isArray(values)) {
    let color = values.join('') as string | null;
    if (REG_FN_MATH_CALC.test(color as string)) {
      color = cssCalc(color as string, opt) as string | null;
    }
    if (cacheKey) {
      cachedResults.set(cacheKey as string, color!);
    }
    return color;
  } else {
    if (cacheKey) {
      cachedResults.set(cacheKey, null!);
    }
    return null;
  }
}
