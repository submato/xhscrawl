import { tokenize, TokenType } from "@csstools/css-tokenizer";
import { LRUCache } from "lru-cache";
import { isString } from "./common.js";
import { cssCalc } from "./css-calc.js";
import { valueToJsonString, isColor } from "./util.js";
import { VAL_SPEC, SYN_FN_MATH_CALC, SYN_FN_VAR, FN_VAR } from "./constant.js";
const {
  CloseParen: PAREN_CLOSE,
  Comment: COMMENT,
  EOF,
  Ident: IDENT,
  Whitespace: W_SPACE
} = TokenType;
const REG_FN_MATH_CALC = new RegExp(SYN_FN_MATH_CALC);
const REG_FN_VAR = new RegExp(SYN_FN_VAR);
const cachedResults = new LRUCache({
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
    if (value === FN_VAR) {
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
    resolveAsColor = isColor(lastValue);
  }
  let resolvedValue;
  for (let item of items) {
    item = item.trim();
    if (REG_FN_VAR.test(item)) {
      item = cssVar(item, opt);
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
      item = cssCalc(item, opt);
      if (resolveAsColor) {
        if (isColor(item)) {
          resolvedValue = item;
        }
      } else {
        resolvedValue = item;
      }
    } else if (item && !/^(?:inherit|initial|revert(?:-layer)?|unset)$/.test(item)) {
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
function parseTokens(tokens, opt = {}) {
  const res = [];
  while (tokens.length) {
    const token = tokens.shift();
    const [type, value] = token;
    if (value === FN_VAR) {
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
  if (isString(value)) {
    if (!REG_FN_VAR.test(value) || format === VAL_SPEC) {
      return value;
    }
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  let cacheKey;
  if (typeof customProperty.callback !== "function") {
    cacheKey = `{cssVar:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  const tokens = tokenize({ css: value });
  const values = parseTokens(tokens, opt);
  if (Array.isArray(values)) {
    let color = values.join("");
    if (REG_FN_MATH_CALC.test(color)) {
      color = cssCalc(color, opt);
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
export {
  cachedResults,
  cssVar,
  parseTokens,
  resolveCustomProperty
};
//# sourceMappingURL=css-var.js.map
