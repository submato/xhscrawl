import { LRUCache } from "lru-cache";
import { numberToHexString, convertColorToHsl, convertColorToHwb, convertColorToLab, convertColorToLch, convertColorToOklab, convertColorToOklch, convertColorToRgb, parseColorFunc, parseColorValue } from "./color.js";
import { isString } from "./common.js";
import { cssCalc } from "./css-calc.js";
import { cssVar } from "./css-var.js";
import { resolveRelativeColor } from "./relative-color.js";
import { resolve } from "./resolve.js";
import { valueToJsonString } from "./util.js";
import { VAL_COMP, SYN_FN_MATH_CALC, SYN_FN_REL, SYN_FN_VAR } from "./constant.js";
const REG_FN_MATH_CALC = new RegExp(SYN_FN_MATH_CALC);
const REG_FN_REL = new RegExp(SYN_FN_REL);
const REG_FN_VAR = new RegExp(SYN_FN_VAR);
const cachedResults = new LRUCache({
  max: 4096
});
const preProcess = (value, opt = {}) => {
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
  if (typeof (customProperty == null ? void 0 : customProperty.callback) !== "function") {
    cacheKey = `{preProcess:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  if (REG_FN_VAR.test(value)) {
    const resolvedValue = cssVar(value, opt);
    if (resolvedValue) {
      value = resolvedValue;
    } else {
      if (cacheKey) {
        cachedResults.set(cacheKey, resolvedValue);
      }
      return null;
    }
  }
  if (REG_FN_REL.test(value)) {
    value = resolveRelativeColor(value, opt);
  } else if (REG_FN_MATH_CALC.test(value)) {
    const resolvedValue = cssCalc(value, opt);
    if (resolvedValue) {
      value = resolvedValue;
    } else {
      if (cacheKey) {
        cachedResults.set(cacheKey, resolvedValue);
      }
      return null;
    }
  }
  if (value.startsWith("color-mix")) {
    value = resolve(value, {
      format: VAL_COMP
    });
  }
  if (cacheKey) {
    cachedResults.set(cacheKey, value);
  }
  return value;
};
const numberToHex = (value) => {
  const cacheKey = typeof value === "number" && `{numberToHex:${value}}`;
  if (cacheKey && cachedResults.has(cacheKey)) {
    return cachedResults.get(cacheKey);
  }
  const hex = numberToHexString(value);
  if (cacheKey) {
    cachedResults.set(cacheKey, hex);
  }
  return hex;
};
const colorToHex = (value, opt = {}) => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt);
    if (resolvedValue) {
      value = resolvedValue.toLowerCase();
    } else {
      return null;
    }
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { alpha, customProperty } = opt;
  let cacheKey;
  if (typeof (customProperty == null ? void 0 : customProperty.callback) !== "function") {
    cacheKey = `{colorToHex:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  let hex;
  if (alpha) {
    opt.format = "hexAlpha";
    hex = resolve(value, opt);
  } else {
    opt.format = "hex";
    hex = resolve(value, opt);
  }
  if (cacheKey) {
    cachedResults.set(cacheKey, hex);
  }
  return hex;
};
const colorToHsl = (value, opt = {}) => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt);
    if (resolvedValue) {
      value = resolvedValue.toLowerCase();
    } else {
      return [0, 0, 0, 0];
    }
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { customProperty } = opt;
  let cacheKey;
  if (typeof (customProperty == null ? void 0 : customProperty.callback) !== "function") {
    cacheKey = `{colorToHsl:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  opt.format = "hsl";
  const hsl = convertColorToHsl(value, opt);
  if (cacheKey) {
    cachedResults.set(cacheKey, hsl);
  }
  return hsl;
};
const colorToHwb = (value, opt = {}) => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt);
    if (resolvedValue) {
      value = resolvedValue.toLowerCase();
    } else {
      return [0, 0, 0, 0];
    }
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { customProperty } = opt;
  let cacheKey;
  if (typeof (customProperty == null ? void 0 : customProperty.callback) !== "function") {
    cacheKey = `{colorToHwb:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  opt.format = "hwb";
  const hwb = convertColorToHwb(value, opt);
  if (cacheKey) {
    cachedResults.set(cacheKey, hwb);
  }
  return hwb;
};
const colorToLab = (value, opt = {}) => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt);
    if (resolvedValue) {
      value = resolvedValue.toLowerCase();
    } else {
      return [0, 0, 0, 0];
    }
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { customProperty } = opt;
  let cacheKey;
  if (typeof (customProperty == null ? void 0 : customProperty.callback) !== "function") {
    cacheKey = `{colorToLab:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  const lab = convertColorToLab(value, opt);
  if (cacheKey) {
    cachedResults.set(cacheKey, lab);
  }
  return lab;
};
const colorToLch = (value, opt = {}) => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt);
    if (resolvedValue) {
      value = resolvedValue.toLowerCase();
    } else {
      return [0, 0, 0, 0];
    }
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { customProperty } = opt;
  let cacheKey;
  if (typeof (customProperty == null ? void 0 : customProperty.callback) !== "function") {
    cacheKey = `{colorToLch:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  const lch = convertColorToLch(value, opt);
  if (cacheKey) {
    cachedResults.set(cacheKey, lch);
  }
  return lch;
};
const colorToOklab = (value, opt = {}) => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt);
    if (resolvedValue) {
      value = resolvedValue.toLowerCase();
    } else {
      return [0, 0, 0, 0];
    }
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { customProperty } = opt;
  let cacheKey;
  if (typeof (customProperty == null ? void 0 : customProperty.callback) !== "function") {
    cacheKey = `{colorToOklab:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  const lab = convertColorToOklab(value, opt);
  if (cacheKey) {
    cachedResults.set(cacheKey, lab);
  }
  return lab;
};
const colorToOklch = (value, opt = {}) => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt);
    if (resolvedValue) {
      value = resolvedValue.toLowerCase();
    } else {
      return [0, 0, 0, 0];
    }
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { customProperty } = opt;
  let cacheKey;
  if (typeof (customProperty == null ? void 0 : customProperty.callback) !== "function") {
    cacheKey = `{colorToOklch:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  const lch = convertColorToOklch(value, opt);
  if (cacheKey) {
    cachedResults.set(cacheKey, lch);
  }
  return lch;
};
const colorToRgb = (value, opt = {}) => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt);
    if (resolvedValue) {
      value = resolvedValue.toLowerCase();
    } else {
      return [0, 0, 0, 0];
    }
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { customProperty } = opt;
  let cacheKey;
  if (typeof (customProperty == null ? void 0 : customProperty.callback) !== "function") {
    cacheKey = `{colorToRgb:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  const rgb = convertColorToRgb(value, opt);
  if (cacheKey) {
    cachedResults.set(cacheKey, rgb);
  }
  return rgb;
};
const colorToXyz = (value, opt = {}) => {
  if (isString(value)) {
    const resolvedValue = preProcess(value, opt);
    if (resolvedValue) {
      value = resolvedValue.toLowerCase();
    } else {
      return [0, 0, 0, 0];
    }
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { customProperty } = opt;
  let cacheKey;
  if (typeof (customProperty == null ? void 0 : customProperty.callback) !== "function") {
    cacheKey = `{colorToXyz:${value},opt:${valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  let xyz;
  if (value.startsWith("color(")) {
    [, ...xyz] = parseColorFunc(value, opt);
  } else {
    [, ...xyz] = parseColorValue(value, opt);
  }
  if (cacheKey) {
    cachedResults.set(cacheKey, xyz);
  }
  return xyz;
};
const colorToXyzD50 = (value, opt = {}) => {
  opt.d50 = true;
  return colorToXyz(value, opt);
};
const convert = {
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
export {
  cachedResults,
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
  convert,
  numberToHex,
  preProcess
};
//# sourceMappingURL=convert.js.map
