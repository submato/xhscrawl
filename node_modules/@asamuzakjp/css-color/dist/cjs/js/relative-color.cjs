"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const cssColorParser = require("@csstools/css-color-parser");
const cssParserAlgorithms = require("@csstools/css-parser-algorithms");
const cssTokenizer = require("@csstools/css-tokenizer");
const lruCache = require("lru-cache");
const common = require("./common.cjs");
const convert = require("./convert.cjs");
const cssCalc = require("./css-calc.cjs");
const resolve = require("./resolve.cjs");
const util = require("./util.cjs");
const constant = require("./constant.cjs");
const color = require("./color.cjs");
const {
  CloseParen: PAREN_CLOSE,
  Comment: COMMENT,
  Dimension: DIM,
  EOF,
  Function: FUNC,
  Ident: IDENT,
  Number: NUM,
  OpenParen: PAREN_OPEN,
  Percentage: PCT,
  Whitespace: W_SPACE
} = cssTokenizer.TokenType;
const {
  HasNoneKeywords: NONE_KEY
} = cssColorParser.SyntaxFlag;
const OCT = 8;
const DEC = 10;
const HEX = 16;
const MAX_PCT = 100;
const MAX_RGB = 255;
const REG_COLOR_CAPT = new RegExp(
  `^${constant.FN_REL}(${constant.SYN_COLOR_TYPE}|${constant.SYN_MIX})\\s+`
);
const REG_CS_HSL = /(?:hsla?|hwb)$/;
const REG_CS_CIE = new RegExp(`^(?:${constant.CS_LAB}|${constant.CS_LCH})$`);
const REG_FN_VAR = new RegExp(constant.SYN_FN_VAR);
const REG_REL = new RegExp(constant.FN_REL);
const REG_REL_CAPT = new RegExp(`^${constant.FN_REL_CAPT}`);
const REG_START_MATH = new RegExp(constant.SYN_FN_MATH);
const REG_START_REL = new RegExp(`^${constant.FN_REL}`);
const cachedResults = new lruCache.LRUCache({
  max: 4096
});
function resolveColorChannels(tokens, opt = {}) {
  if (!Array.isArray(tokens)) {
    throw new TypeError(`${tokens} is not an array.`);
  }
  const { colorSpace, format } = opt;
  const colorChannels = /* @__PURE__ */ new Map([
    ["color", ["r", "g", "b", "alpha"]],
    ["hsl", ["h", "s", "l", "alpha"]],
    ["hsla", ["h", "s", "l", "alpha"]],
    ["hwb", ["h", "w", "b", "alpha"]],
    ["lab", ["l", "a", "b", "alpha"]],
    ["lch", ["l", "c", "h", "alpha"]],
    ["oklab", ["l", "a", "b", "alpha"]],
    ["oklch", ["l", "c", "h", "alpha"]],
    ["rgb", ["r", "g", "b", "alpha"]],
    ["rgba", ["r", "g", "b", "alpha"]]
  ]);
  const colorChannel = colorChannels.get(colorSpace);
  const mathFunc = /* @__PURE__ */ new Set();
  const channels = [[], [], [], []];
  let i = 0;
  let nest = 0;
  let func = false;
  while (tokens.length) {
    const token = tokens.shift();
    if (!Array.isArray(token)) {
      throw new TypeError(`${token} is not an array.`);
    }
    const [type, value, , , detail = {}] = token;
    const numValue = detail == null ? void 0 : detail.value;
    const channel = channels[i];
    switch (type) {
      case DIM: {
        let resolvedValue = cssCalc.resolveDimension(token, opt);
        if (!resolvedValue) {
          resolvedValue = value;
        }
        channel.push(resolvedValue);
        break;
      }
      case FUNC: {
        channel.push(value);
        func = true;
        nest++;
        if (REG_START_MATH.test(value)) {
          mathFunc.add(nest);
        }
        break;
      }
      case IDENT: {
        if (!colorChannel || !colorChannel.includes(value)) {
          return null;
        }
        channel.push(value);
        if (!func) {
          i++;
        }
        break;
      }
      case NUM: {
        const n = numValue ?? parseFloat(value);
        channel.push(n);
        if (!func) {
          i++;
        }
        break;
      }
      case PAREN_OPEN: {
        channel.push(value);
        nest++;
        break;
      }
      case PAREN_CLOSE: {
        if (func) {
          const lastValue = channel[channel.length - 1];
          if (lastValue === " ") {
            channel.splice(-1, 1, value);
          } else {
            channel.push(value);
          }
          if (mathFunc.has(nest)) {
            mathFunc.delete(nest);
          }
          nest--;
          if (nest === 0) {
            func = false;
            i++;
          }
        }
        break;
      }
      case PCT: {
        const n = numValue ?? parseFloat(value);
        channel.push(n / MAX_PCT);
        if (!func) {
          i++;
        }
        break;
      }
      case W_SPACE: {
        if (channel.length && func) {
          const lastValue = channel[channel.length - 1];
          if (typeof lastValue === "number") {
            channel.push(value);
          } else if (common.isString(lastValue) && !lastValue.endsWith("(") && lastValue !== " ") {
            channel.push(value);
          }
        }
        break;
      }
      default: {
        if (type !== COMMENT && type !== EOF && func) {
          channel.push(value);
        }
      }
    }
  }
  const channelValues = [];
  for (const channel of channels) {
    if (channel.length === 1) {
      const [resolvedValue] = channel;
      channelValues.push(resolvedValue);
    } else if (channel.length) {
      const resolvedValue = cssCalc.serializeCalc(channel.join(""), {
        format
      });
      if (resolvedValue) {
        channelValues.push(resolvedValue);
      } else {
        return null;
      }
    }
  }
  return channelValues;
}
function extractOriginColor(value, opt = {}) {
  if (common.isString(value)) {
    value = value.toLowerCase().trim();
    if (!value) {
      return null;
    }
    if (!REG_START_REL.test(value)) {
      return value;
    }
  } else {
    return null;
  }
  const { currentColor, format } = opt;
  const cacheKey = `{preProcess:${value},opt:${util.valueToJsonString(opt)}}`;
  if (cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  if (/currentcolor/.test(value)) {
    if (currentColor) {
      value = value.replace(/currentcolor/g, currentColor);
    } else {
      if (cacheKey) {
        cachedResults.set(cacheKey, null);
      }
      return null;
    }
  }
  const cs = value.match(REG_REL_CAPT);
  let colorSpace;
  if (cs) {
    [, colorSpace] = cs;
  } else {
    return null;
  }
  opt.colorSpace = colorSpace;
  if (REG_COLOR_CAPT.test(value)) {
    const [, originColor] = value.match(REG_COLOR_CAPT);
    const [, restValue] = value.split(originColor);
    if (/^[a-z]+$/.test(originColor)) {
      if (!/^transparent$/.test(originColor) && !Object.prototype.hasOwnProperty.call(color.NAMED_COLORS, originColor)) {
        if (cacheKey) {
          cachedResults.set(cacheKey, null);
        }
        return null;
      }
    } else if (format === constant.VAL_SPEC) {
      const resolvedOriginColor = resolve.resolve(originColor, opt);
      value = value.replace(originColor, resolvedOriginColor);
    }
    if (format === constant.VAL_SPEC) {
      const tokens = cssTokenizer.tokenize({ css: restValue });
      const channelValues = resolveColorChannels(tokens, opt);
      if (!Array.isArray(channelValues)) {
        if (cacheKey) {
          cachedResults.set(cacheKey, null);
        }
        return null;
      }
      let channelValue;
      if (channelValues.length === 3) {
        channelValue = ` ${channelValues.join(" ")})`;
      } else {
        const [v1, v2, v3, v4] = channelValues;
        channelValue = ` ${v1} ${v2} ${v3} / ${v4})`;
      }
      value = value.replace(restValue, channelValue);
    }
  } else {
    const [, restValue] = value.split(REG_START_REL);
    if (REG_START_REL.test(restValue)) {
      const tokens = cssTokenizer.tokenize({ css: restValue });
      const originColor = [];
      let nest = 0;
      while (tokens.length) {
        const token = tokens.shift();
        const [type, tokenValue] = token;
        switch (type) {
          case FUNC:
          case PAREN_OPEN: {
            originColor.push(tokenValue);
            nest++;
            break;
          }
          case PAREN_CLOSE: {
            const lastValue = originColor[originColor.length - 1];
            if (lastValue === " ") {
              originColor.splice(-1, 1, tokenValue);
            } else {
              originColor.push(tokenValue);
            }
            nest--;
            break;
          }
          case W_SPACE: {
            const lastValue = originColor[originColor.length - 1];
            if (!lastValue.endsWith("(") && lastValue !== " ") {
              originColor.push(tokenValue);
            }
            break;
          }
          default: {
            if (type !== COMMENT && type !== EOF) {
              originColor.push(tokenValue);
            }
          }
        }
        if (nest === 0) {
          break;
        }
      }
      const resolvedOriginColor = resolveRelativeColor(
        originColor.join("").trim(),
        opt
      );
      if (!resolvedOriginColor) {
        if (cacheKey) {
          cachedResults.set(cacheKey, null);
        }
        return null;
      }
      const channelValues = resolveColorChannels(tokens, opt);
      if (!Array.isArray(channelValues)) {
        if (cacheKey) {
          cachedResults.set(cacheKey, null);
        }
        return null;
      }
      let channelValue;
      if (channelValues.length === 3) {
        channelValue = ` ${channelValues.join(" ")})`;
      } else {
        const [v1, v2, v3, v4] = channelValues;
        channelValue = ` ${v1} ${v2} ${v3} / ${v4})`;
      }
      value = value.replace(restValue, `${resolvedOriginColor}${channelValue}`);
    }
  }
  if (cacheKey) {
    cachedResults.set(cacheKey, value);
  }
  return value;
}
function resolveRelativeColor(value, opt = {}) {
  const { format } = opt;
  if (common.isString(value)) {
    if (REG_FN_VAR.test(value)) {
      if (format === constant.VAL_SPEC) {
        return value;
      } else {
        throw new SyntaxError(`Unexpected token ${constant.FN_VAR} found.`);
      }
    } else if (!REG_REL.test(value)) {
      return value;
    }
    value = value.toLowerCase().trim();
  } else {
    throw new TypeError(`${value} is not a string`);
  }
  const cacheKey = `{relativeColor:${value},opt:${util.valueToJsonString(opt)}}`;
  if (cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  const originColor = extractOriginColor(value, opt);
  if (originColor) {
    value = originColor;
  } else {
    if (cacheKey) {
      cachedResults.set(cacheKey, null);
    }
    return null;
  }
  if (format === constant.VAL_SPEC) {
    if (value.startsWith("rgba(")) {
      value = value.replace(/^rgba\(/, "rgb(");
    } else if (value.startsWith("hsla(")) {
      value = value.replace(/^hsla\(/, "hsl(");
    }
    return value;
  }
  const tokens = cssTokenizer.tokenize({ css: value });
  const components = cssParserAlgorithms.parseComponentValue(tokens);
  const parsedComponents = cssColorParser.color(components);
  if (!parsedComponents) {
    if (cacheKey) {
      cachedResults.set(cacheKey, null);
    }
    return null;
  }
  const {
    alpha: alphaComponent,
    channels: channelsComponent,
    colorNotation,
    syntaxFlags
  } = parsedComponents;
  let alpha;
  if (Number.isNaN(Number(alphaComponent))) {
    if (syntaxFlags instanceof Set && syntaxFlags.has(NONE_KEY)) {
      alpha = constant.NONE;
    } else {
      alpha = 0;
    }
  } else {
    alpha = util.roundToPrecision(alphaComponent, OCT);
  }
  let v1;
  let v2;
  let v3;
  [v1, v2, v3] = channelsComponent;
  let resolvedValue;
  if (REG_CS_CIE.test(colorNotation)) {
    const hasNone = syntaxFlags instanceof Set && syntaxFlags.has(NONE_KEY);
    if (Number.isNaN(v1)) {
      if (hasNone) {
        v1 = constant.NONE;
      } else {
        v1 = 0;
      }
    } else {
      v1 = util.roundToPrecision(v1, HEX);
    }
    if (Number.isNaN(v2)) {
      if (hasNone) {
        v2 = constant.NONE;
      } else {
        v2 = 0;
      }
    } else {
      v2 = util.roundToPrecision(v2, HEX);
    }
    if (Number.isNaN(v3)) {
      if (hasNone) {
        v3 = constant.NONE;
      } else {
        v3 = 0;
      }
    } else {
      v3 = util.roundToPrecision(v3, HEX);
    }
    if (alpha === 1) {
      resolvedValue = `${colorNotation}(${v1} ${v2} ${v3})`;
    } else {
      resolvedValue = `${colorNotation}(${v1} ${v2} ${v3} / ${alpha})`;
    }
  } else if (REG_CS_HSL.test(colorNotation)) {
    if (Number.isNaN(v1)) {
      v1 = 0;
    }
    if (Number.isNaN(v2)) {
      v2 = 0;
    }
    if (Number.isNaN(v3)) {
      v3 = 0;
    }
    let [r, g, b] = convert.colorToRgb(
      `${colorNotation}(${v1} ${v2} ${v3} / ${alpha})`
    );
    r = util.roundToPrecision(r / MAX_RGB, DEC);
    g = util.roundToPrecision(g / MAX_RGB, DEC);
    b = util.roundToPrecision(b / MAX_RGB, DEC);
    if (alpha === 1) {
      resolvedValue = `color(srgb ${r} ${g} ${b})`;
    } else {
      resolvedValue = `color(srgb ${r} ${g} ${b} / ${alpha})`;
    }
  } else {
    const cs = colorNotation === "rgb" ? "srgb" : colorNotation;
    const hasNone = syntaxFlags instanceof Set && syntaxFlags.has(NONE_KEY);
    if (Number.isNaN(v1)) {
      if (hasNone) {
        v1 = constant.NONE;
      } else {
        v1 = 0;
      }
    } else {
      v1 = util.roundToPrecision(v1, DEC);
    }
    if (Number.isNaN(v2)) {
      if (hasNone) {
        v2 = constant.NONE;
      } else {
        v2 = 0;
      }
    } else {
      v2 = util.roundToPrecision(v2, DEC);
    }
    if (Number.isNaN(v3)) {
      if (hasNone) {
        v3 = constant.NONE;
      } else {
        v3 = 0;
      }
    } else {
      v3 = util.roundToPrecision(v3, DEC);
    }
    if (alpha === 1) {
      resolvedValue = `color(${cs} ${v1} ${v2} ${v3})`;
    } else {
      resolvedValue = `color(${cs} ${v1} ${v2} ${v3} / ${alpha})`;
    }
  }
  if (cacheKey) {
    cachedResults.set(cacheKey, resolvedValue);
  }
  return resolvedValue;
}
exports.cachedResults = cachedResults;
exports.extractOriginColor = extractOriginColor;
exports.resolveColorChannels = resolveColorChannels;
exports.resolveRelativeColor = resolveRelativeColor;
//# sourceMappingURL=relative-color.cjs.map
