import { LRUCache } from "lru-cache";
import { resolveColorMix, resolveColorFunc, resolveColorValue, convertRgbToHex } from "./color.js";
import { isString } from "./common.js";
import { cssCalc } from "./css-calc.js";
import { cssVar } from "./css-var.js";
import { resolveRelativeColor } from "./relative-color.js";
import { valueToJsonString } from "./util.js";
import { VAL_SPEC, VAL_COMP, FN_MIX, FN_COLOR, SYN_FN_MATH_CALC, SYN_FN_REL, SYN_FN_VAR } from "./constant.js";
const RGB_TRANSPARENT = "rgba(0, 0, 0, 0)";
const REG_FN_MATH_CALC = new RegExp(SYN_FN_MATH_CALC);
const REG_FN_REL = new RegExp(SYN_FN_REL);
const REG_FN_VAR = new RegExp(SYN_FN_VAR);
const cachedResults = new LRUCache({
  max: 4096
});
const resolve = (color, opt = {}) => {
  if (isString(color)) {
    color = color.trim();
  } else {
    throw new TypeError(`${color} is not a string.`);
  }
  const { currentColor, customProperty = {}, format = VAL_COMP, key } = opt;
  let cacheKey;
  if (!REG_FN_VAR.test(color) || typeof customProperty.callback === "function") {
    cacheKey = `{resolve:${color},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
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
  color = color.toLowerCase();
  if (REG_FN_REL.test(color)) {
    const resolvedColor = resolveRelativeColor(color, opt);
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
        res = "";
      }
      if (cacheKey) {
        cachedResults.set(cacheKey, res);
      }
      return res;
    }
    if (resolvedColor) {
      color = resolvedColor;
    } else {
      color = "";
    }
  }
  if (REG_FN_MATH_CALC.test(color)) {
    const resolvedColor = cssCalc(color, opt);
    if (resolvedColor) {
      color = resolvedColor;
    } else {
      color = "";
    }
  }
  if (color === "transparent") {
    switch (format) {
      case VAL_SPEC: {
        if (cacheKey) {
          cachedResults.set(cacheKey, color);
        }
        return color;
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
      case VAL_COMP:
      default: {
        res = RGB_TRANSPARENT;
        if (cacheKey) {
          cachedResults.set(cacheKey, res);
        }
        return res;
      }
    }
  } else if (color === "currentcolor") {
    if (format === VAL_SPEC) {
      if (cacheKey) {
        cachedResults.set(cacheKey, color);
      }
      return color;
    }
    if (currentColor) {
      if (currentColor.startsWith(FN_MIX)) {
        [cs, r, g, b, alpha] = resolveColorMix(currentColor, opt);
      } else if (currentColor.startsWith(FN_COLOR)) {
        [cs, r, g, b, alpha] = resolveColorFunc(currentColor, opt);
      } else {
        [cs, r, g, b, alpha] = resolveColorValue(currentColor, opt);
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
        cachedResults.set(cacheKey, res);
      }
      return res;
    } else if (color.startsWith(FN_COLOR)) {
      [cs, r, g, b, alpha] = resolveColorFunc(color, opt);
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
  } else if (/currentcolor/.test(color)) {
    if (currentColor) {
      color = color.replace(/currentcolor/g, currentColor);
    }
    if (/transparent/.test(color)) {
      color = color.replace(/transparent/g, RGB_TRANSPARENT);
    }
    if (color.startsWith(FN_MIX)) {
      [cs, r, g, b, alpha] = resolveColorMix(color, opt);
    }
  } else if (/transparent/.test(color)) {
    color = color.replace(/transparent/g, RGB_TRANSPARENT);
    if (color.startsWith(FN_MIX)) {
      [cs, r, g, b, alpha] = resolveColorMix(color, opt);
    }
  } else if (color.startsWith(FN_MIX)) {
    [cs, r, g, b, alpha] = resolveColorMix(color, opt);
  } else if (color.startsWith(FN_COLOR)) {
    [cs, r, g, b, alpha] = resolveColorFunc(color, opt);
  } else if (color) {
    [cs, r, g, b, alpha] = resolveColorValue(color, opt);
  }
  switch (format) {
    case "hex": {
      let hex;
      if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(alpha) || alpha === 0) {
        hex = null;
      } else {
        hex = convertRgbToHex([r, g, b]);
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
        hex = convertRgbToHex([
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
    case VAL_COMP:
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
export {
  cachedResults,
  resolve
};
//# sourceMappingURL=resolve.js.map
