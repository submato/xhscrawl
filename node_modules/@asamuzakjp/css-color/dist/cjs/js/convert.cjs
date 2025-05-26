"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const lruCache = require("lru-cache");
const color = require("./color.cjs");
const common = require("./common.cjs");
const cssCalc = require("./css-calc.cjs");
const cssVar = require("./css-var.cjs");
const relativeColor = require("./relative-color.cjs");
const resolve = require("./resolve.cjs");
const util = require("./util.cjs");
const constant = require("./constant.cjs");
const REG_FN_MATH_CALC = new RegExp(constant.SYN_FN_MATH_CALC);
const REG_FN_REL = new RegExp(constant.SYN_FN_REL);
const REG_FN_VAR = new RegExp(constant.SYN_FN_VAR);
const cachedResults = new lruCache.LRUCache({
  max: 4096
});
const preProcess = (value, opt = {}) => {
  if (common.isString(value)) {
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
    cacheKey = `{preProcess:${value},opt:${util.valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  if (REG_FN_VAR.test(value)) {
    const resolvedValue = cssVar.cssVar(value, opt);
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
    value = relativeColor.resolveRelativeColor(value, opt);
  } else if (REG_FN_MATH_CALC.test(value)) {
    const resolvedValue = cssCalc.cssCalc(value, opt);
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
    value = resolve.resolve(value, {
      format: constant.VAL_COMP
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
  const hex = color.numberToHexString(value);
  if (cacheKey) {
    cachedResults.set(cacheKey, hex);
  }
  return hex;
};
const colorToHex = (value, opt = {}) => {
  if (common.isString(value)) {
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
    cacheKey = `{colorToHex:${value},opt:${util.valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  let hex;
  if (alpha) {
    opt.format = "hexAlpha";
    hex = resolve.resolve(value, opt);
  } else {
    opt.format = "hex";
    hex = resolve.resolve(value, opt);
  }
  if (cacheKey) {
    cachedResults.set(cacheKey, hex);
  }
  return hex;
};
const colorToHsl = (value, opt = {}) => {
  if (common.isString(value)) {
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
    cacheKey = `{colorToHsl:${value},opt:${util.valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  opt.format = "hsl";
  const hsl = color.convertColorToHsl(value, opt);
  if (cacheKey) {
    cachedResults.set(cacheKey, hsl);
  }
  return hsl;
};
const colorToHwb = (value, opt = {}) => {
  if (common.isString(value)) {
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
    cacheKey = `{colorToHwb:${value},opt:${util.valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  opt.format = "hwb";
  const hwb = color.convertColorToHwb(value, opt);
  if (cacheKey) {
    cachedResults.set(cacheKey, hwb);
  }
  return hwb;
};
const colorToLab = (value, opt = {}) => {
  if (common.isString(value)) {
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
    cacheKey = `{colorToLab:${value},opt:${util.valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  const lab = color.convertColorToLab(value, opt);
  if (cacheKey) {
    cachedResults.set(cacheKey, lab);
  }
  return lab;
};
const colorToLch = (value, opt = {}) => {
  if (common.isString(value)) {
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
    cacheKey = `{colorToLch:${value},opt:${util.valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  const lch = color.convertColorToLch(value, opt);
  if (cacheKey) {
    cachedResults.set(cacheKey, lch);
  }
  return lch;
};
const colorToOklab = (value, opt = {}) => {
  if (common.isString(value)) {
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
    cacheKey = `{colorToOklab:${value},opt:${util.valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  const lab = color.convertColorToOklab(value, opt);
  if (cacheKey) {
    cachedResults.set(cacheKey, lab);
  }
  return lab;
};
const colorToOklch = (value, opt = {}) => {
  if (common.isString(value)) {
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
    cacheKey = `{colorToOklch:${value},opt:${util.valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  const lch = color.convertColorToOklch(value, opt);
  if (cacheKey) {
    cachedResults.set(cacheKey, lch);
  }
  return lch;
};
const colorToRgb = (value, opt = {}) => {
  if (common.isString(value)) {
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
    cacheKey = `{colorToRgb:${value},opt:${util.valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  const rgb = color.convertColorToRgb(value, opt);
  if (cacheKey) {
    cachedResults.set(cacheKey, rgb);
  }
  return rgb;
};
const colorToXyz = (value, opt = {}) => {
  if (common.isString(value)) {
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
    cacheKey = `{colorToXyz:${value},opt:${util.valueToJsonString(opt)}}`;
    if (cachedResults.has(cacheKey)) {
      return cachedResults.get(cacheKey);
    }
  }
  let xyz;
  if (value.startsWith("color(")) {
    [, ...xyz] = color.parseColorFunc(value, opt);
  } else {
    [, ...xyz] = color.parseColorValue(value, opt);
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
exports.cachedResults = cachedResults;
exports.colorToHex = colorToHex;
exports.colorToHsl = colorToHsl;
exports.colorToHwb = colorToHwb;
exports.colorToLab = colorToLab;
exports.colorToLch = colorToLch;
exports.colorToOklab = colorToOklab;
exports.colorToOklch = colorToOklch;
exports.colorToRgb = colorToRgb;
exports.colorToXyz = colorToXyz;
exports.colorToXyzD50 = colorToXyzD50;
exports.convert = convert;
exports.numberToHex = numberToHex;
exports.preProcess = preProcess;
//# sourceMappingURL=convert.cjs.map
