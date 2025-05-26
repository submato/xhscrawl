"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const lruCache = require("lru-cache");
const color = require("./color.cjs");
const common = require("./common.cjs");
const cssCalc = require("./css-calc.cjs");
const cssVar = require("./css-var.cjs");
const relativeColor = require("./relative-color.cjs");
const util = require("./util.cjs");
const constant = require("./constant.cjs");
const RGB_TRANSPARENT = "rgba(0, 0, 0, 0)";
const REG_FN_MATH_CALC = new RegExp(constant.SYN_FN_MATH_CALC);
const REG_FN_REL = new RegExp(constant.SYN_FN_REL);
const REG_FN_VAR = new RegExp(constant.SYN_FN_VAR);
const cachedResults = new lruCache.LRUCache({
  max: 4096
});
const resolve = (color$1, opt = {}) => {
  if (common.isString(color$1)) {
    color$1 = color$1.trim();
  } else {
    throw new TypeError(`${color$1} is not a string.`);
  }
  const { currentColor, customProperty = {}, format = constant.VAL_COMP, key } = opt;
  let cacheKey;
  if (!REG_FN_VAR.test(color$1) || typeof customProperty.callback === "function") {
    cacheKey = `{resolve:${color$1},opt:${util.valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  let res, cs, r, g, b, alpha;
  if (REG_FN_VAR.test(color$1)) {
    if (format === constant.VAL_SPEC) {
      if (cacheKey) {
        cachedResults.set(cacheKey, color$1);
      }
      return color$1;
    }
    const resolvedColor = cssVar.cssVar(color$1, opt);
    if (resolvedColor) {
      color$1 = resolvedColor;
    } else {
      switch (format) {
        case "hex":
        case "hexAlpha": {
          if (cacheKey) {
            cachedResults.set(cacheKey, null);
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
  color$1 = color$1.toLowerCase();
  if (REG_FN_REL.test(color$1)) {
    const resolvedColor = relativeColor.resolveRelativeColor(color$1, opt);
    if (format === constant.VAL_COMP) {
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
    if (format === constant.VAL_SPEC) {
      if (resolvedColor) {
        res = resolvedColor;
      } else {
        res = "";
      }
      if (cacheKey) {
        cachedResults.set(cacheKey, res);
      }
      return res;
    }
    if (resolvedColor) {
      color$1 = resolvedColor;
    } else {
      color$1 = "";
    }
  }
  if (REG_FN_MATH_CALC.test(color$1)) {
    const resolvedColor = cssCalc.cssCalc(color$1, opt);
    if (resolvedColor) {
      color$1 = resolvedColor;
    } else {
      color$1 = "";
    }
  }
  if (color$1 === "transparent") {
    switch (format) {
      case constant.VAL_SPEC: {
        if (cacheKey) {
          cachedResults.set(cacheKey, color$1);
        }
        return color$1;
      }
      case "hex": {
        if (cacheKey) {
          cachedResults.set(cacheKey, null);
        }
        return null;
      }
      case "hexAlpha": {
        res = "#00000000";
        if (cacheKey) {
          cachedResults.set(cacheKey, res);
        }
        return res;
      }
      case constant.VAL_COMP:
      default: {
        res = RGB_TRANSPARENT;
        if (cacheKey) {
          cachedResults.set(cacheKey, res);
        }
        return res;
      }
    }
  } else if (color$1 === "currentcolor") {
    if (format === constant.VAL_SPEC) {
      if (cacheKey) {
        cachedResults.set(cacheKey, color$1);
      }
      return color$1;
    }
    if (currentColor) {
      if (currentColor.startsWith(constant.FN_MIX)) {
        [cs, r, g, b, alpha] = color.resolveColorMix(currentColor, opt);
      } else if (currentColor.startsWith(constant.FN_COLOR)) {
        [cs, r, g, b, alpha] = color.resolveColorFunc(currentColor, opt);
      } else {
        [cs, r, g, b, alpha] = color.resolveColorValue(currentColor, opt);
      }
    } else if (format === constant.VAL_COMP) {
      res = RGB_TRANSPARENT;
      if (cacheKey) {
        cachedResults.set(cacheKey, res);
      }
      return res;
    }
  } else if (format === constant.VAL_SPEC) {
    if (color$1.startsWith(constant.FN_MIX)) {
      res = color.resolveColorMix(color$1, opt);
      if (cacheKey) {
        cachedResults.set(cacheKey, res);
      }
      return res;
    } else if (color$1.startsWith(constant.FN_COLOR)) {
      [cs, r, g, b, alpha] = color.resolveColorFunc(color$1, opt);
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
      const rgb = color.resolveColorValue(color$1, opt);
      if (!rgb) {
        res = "";
        if (cacheKey) {
          cachedResults.set(cacheKey, res);
        }
        return res;
      }
      [cs, r, g, b, alpha] = rgb;
      if (cs === "rgb") {
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
  } else if (/currentcolor/.test(color$1)) {
    if (currentColor) {
      color$1 = color$1.replace(/currentcolor/g, currentColor);
    }
    if (/transparent/.test(color$1)) {
      color$1 = color$1.replace(/transparent/g, RGB_TRANSPARENT);
    }
    if (color$1.startsWith(constant.FN_MIX)) {
      [cs, r, g, b, alpha] = color.resolveColorMix(color$1, opt);
    }
  } else if (/transparent/.test(color$1)) {
    color$1 = color$1.replace(/transparent/g, RGB_TRANSPARENT);
    if (color$1.startsWith(constant.FN_MIX)) {
      [cs, r, g, b, alpha] = color.resolveColorMix(color$1, opt);
    }
  } else if (color$1.startsWith(constant.FN_MIX)) {
    [cs, r, g, b, alpha] = color.resolveColorMix(color$1, opt);
  } else if (color$1.startsWith(constant.FN_COLOR)) {
    [cs, r, g, b, alpha] = color.resolveColorFunc(color$1, opt);
  } else if (color$1) {
    [cs, r, g, b, alpha] = color.resolveColorValue(color$1, opt);
  }
  switch (format) {
    case "hex": {
      let hex;
      if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(alpha) || alpha === 0) {
        hex = null;
      } else {
        hex = color.convertRgbToHex([r, g, b]);
      }
      if (key) {
        res = [key, hex];
      } else {
        res = hex;
      }
      break;
    }
    case "hexAlpha": {
      let hex;
      if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(alpha)) {
        hex = null;
      } else {
        hex = color.convertRgbToHex([
          r,
          g,
          b,
          alpha
        ]);
      }
      if (key) {
        res = [key, hex];
      } else {
        res = hex;
      }
      break;
    }
    case constant.VAL_COMP:
    default: {
      let value;
      switch (cs) {
        case "rgb": {
          if (alpha === 1) {
            value = `${cs}(${r}, ${g}, ${b})`;
          } else {
            value = `${cs}a(${r}, ${g}, ${b}, ${alpha})`;
          }
          break;
        }
        case "lab":
        case "lch":
        case "oklab":
        case "oklch": {
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
    cachedResults.set(cacheKey, res);
  }
  return res;
};
exports.cachedResults = cachedResults;
exports.resolve = resolve;
//# sourceMappingURL=resolve.cjs.map
