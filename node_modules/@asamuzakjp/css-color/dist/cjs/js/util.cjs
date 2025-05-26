"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common = require("./common.cjs");
const resolve = require("./resolve.cjs");
const color = require("./color.cjs");
const constant = require("./constant.cjs");
const DEC = 10;
const HEX = 16;
const DEG = 360;
const DEG_HALF = 180;
const REG_COLOR = new RegExp(`^(?:${constant.SYN_COLOR_TYPE})$`);
const REG_MIX = new RegExp(`${constant.SYN_MIX}`);
const isColor = (value) => {
  if (common.isString(value)) {
    value = value.toLowerCase().trim();
    if (value) {
      if (/^[a-z]+$/.test(value)) {
        if (/^(?:currentcolor|transparent)$/.test(value) || Object.prototype.hasOwnProperty.call(color.NAMED_COLORS, value)) {
          return true;
        }
      } else if (REG_COLOR.test(value) || REG_MIX.test(value)) {
        return true;
      } else {
        const resolvedValue = resolve.resolve(value, {
          format: constant.VAL_SPEC
        });
        if (resolvedValue) {
          return true;
        }
        return false;
      }
    }
  }
  return false;
};
const valueToJsonString = (value, func = false) => {
  if (typeof value === "undefined") {
    return "";
  }
  const res = JSON.stringify(value, (_key, val) => {
    let replacedValue;
    if (typeof val === "undefined") {
      replacedValue = null;
    } else if (typeof val === "function") {
      if (func) {
        replacedValue = val.toString();
      } else {
        replacedValue = val.name;
      }
    } else if (val instanceof Map || val instanceof Set) {
      replacedValue = [...val];
    } else if (typeof val === "bigint") {
      replacedValue = val.toString();
    } else {
      replacedValue = val;
    }
    return replacedValue;
  });
  return res;
};
const roundToPrecision = (value, bit = 0) => {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${value} is not a number.`);
  }
  if (!Number.isFinite(bit)) {
    throw new TypeError(`${bit} is not a number.`);
  } else if (bit < 0 || bit > HEX) {
    throw new RangeError(`${bit} is not between 0 and ${HEX}.`);
  }
  if (bit === 0) {
    return Math.round(value);
  }
  let val;
  if (bit === HEX) {
    val = value.toPrecision(6);
  } else if (bit < DEC) {
    val = value.toPrecision(4);
  } else {
    val = value.toPrecision(5);
  }
  return parseFloat(val);
};
const interpolateHue = (hueA, hueB, arc = "shorter") => {
  if (!Number.isFinite(hueA)) {
    throw new TypeError(`${hueA} is not a number.`);
  }
  if (!Number.isFinite(hueB)) {
    throw new TypeError(`${hueB} is not a number.`);
  }
  switch (arc) {
    case "decreasing": {
      if (hueB > hueA) {
        hueA += DEG;
      }
      break;
    }
    case "increasing": {
      if (hueB < hueA) {
        hueB += DEG;
      }
      break;
    }
    case "longer": {
      if (hueB > hueA && hueB < hueA + DEG_HALF) {
        hueA += DEG;
      } else if (hueB > hueA + DEG_HALF * -1 && hueB <= hueA) {
        hueB += DEG;
      }
      break;
    }
    case "shorter":
    default: {
      if (hueB > hueA + DEG_HALF) {
        hueA += DEG;
      } else if (hueB < hueA + DEG_HALF * -1) {
        hueB += DEG;
      }
    }
  }
  return [hueA, hueB];
};
exports.interpolateHue = interpolateHue;
exports.isColor = isColor;
exports.roundToPrecision = roundToPrecision;
exports.valueToJsonString = valueToJsonString;
//# sourceMappingURL=util.cjs.map
