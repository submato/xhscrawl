"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const cssTokenizer = require("@csstools/css-tokenizer");
const lruCache = require("lru-cache");
const common = require("./common.cjs");
const cssCalc = require("./css-calc.cjs");
const util = require("./util.cjs");
const constant = require("./constant.cjs");
const {
  CloseParen: PAREN_CLOSE,
  Comment: COMMENT,
  EOF,
  Ident: IDENT,
  Whitespace: W_SPACE
} = cssTokenizer.TokenType;
const REG_FN_MATH_CALC = new RegExp(constant.SYN_FN_MATH_CALC);
const REG_FN_VAR = new RegExp(constant.SYN_FN_VAR);
const cachedResults = new lruCache.LRUCache({
  max: 4096
});
function resolveCustomProperty(tokens, opt = {}) {
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
    const [type, value] = token;
    if (type === PAREN_CLOSE) {
      break;
    }
    if (value === constant.FN_VAR) {
      const [restTokens, item] = resolveCustomProperty(tokens, opt);
      tokens = restTokens;
      if (item) {
        items.push(item);
      }
    } else if (type === IDENT) {
      if (value.startsWith("--")) {
        if (Object.hasOwnProperty.call(customProperty, value)) {
          items.push(customProperty[value]);
        } else if (typeof customProperty.callback === "function") {
          const item = customProperty.callback(value);
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
    resolveAsColor = util.isColor(lastValue);
  }
  let resolvedValue;
  for (let item of items) {
    item = item.trim();
    if (REG_FN_VAR.test(item)) {
      item = cssVar(item, opt);
      if (item) {
        if (resolveAsColor) {
          if (util.isColor(item)) {
            resolvedValue = item;
          }
        } else {
          resolvedValue = item;
        }
      }
    } else if (REG_FN_MATH_CALC.test(item)) {
      item = cssCalc.cssCalc(item, opt);
      if (resolveAsColor) {
        if (util.isColor(item)) {
          resolvedValue = item;
        }
      } else {
        resolvedValue = item;
      }
    } else if (item && !/^(?:inherit|initial|revert(?:-layer)?|unset)$/.test(item)) {
      if (resolveAsColor) {
        if (util.isColor(item)) {
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
function parseTokens(tokens, opt = {}) {
  const res = [];
  while (tokens.length) {
    const token = tokens.shift();
    const [type, value] = token;
    if (value === constant.FN_VAR) {
      const [restTokens, resolvedValue] = resolveCustomProperty(tokens, opt);
      if (!resolvedValue) {
        return null;
      }
      tokens = restTokens;
      res.push(resolvedValue);
    } else {
      switch (type) {
        case PAREN_CLOSE: {
          if (res.length) {
            const lastValue = res[res.length - 1];
            if (lastValue === " ") {
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
            const lastValue = res[res.length - 1];
            if (!lastValue.endsWith("(") && lastValue !== " ") {
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
function cssVar(value, opt = {}) {
  const { customProperty = {}, format } = opt;
  if (common.isString(value)) {
    if (!REG_FN_VAR.test(value) || format === constant.VAL_SPEC) {
      return value;
    }
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  let cacheKey;
  if (typeof customProperty.callback !== "function") {
    cacheKey = `{cssVar:${value},opt:${util.valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  const tokens = cssTokenizer.tokenize({ css: value });
  const values = parseTokens(tokens, opt);
  if (Array.isArray(values)) {
    let color = values.join("");
    if (REG_FN_MATH_CALC.test(color)) {
      color = cssCalc.cssCalc(color, opt);
    }
    if (cacheKey) {
      cachedResults.set(cacheKey, color);
    }
    return color;
  } else {
    if (cacheKey) {
      cachedResults.set(cacheKey, null);
    }
    return null;
  }
}
exports.cachedResults = cachedResults;
exports.cssVar = cssVar;
exports.parseTokens = parseTokens;
exports.resolveCustomProperty = resolveCustomProperty;
//# sourceMappingURL=css-var.cjs.map
