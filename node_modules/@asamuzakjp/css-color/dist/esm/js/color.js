import { isString } from "./common.js";
import { roundToPrecision, interpolateHue } from "./util.js";
import { VAL_SPEC, FN_MIX, FN_COLOR, VAL_COMP, NONE, SYN_COLOR_TYPE, CS_HUE_CAPT, SYN_FN_COLOR, SYN_MIX, SYN_MIX_CAPT, CS_RGB, CS_XYZ, CS_MIX, PCT, SYN_HSL, SYN_HSL_LV3, SYN_MOD, SYN_LCH, SYN_RGB_LV3, NUM, ANGLE } from "./constant.js";
const VAL_MIX = "mixValue";
const PPTH = 1e-3;
const HALF = 0.5;
const DUO = 2;
const TRIA = 3;
const QUAT = 4;
const OCT = 8;
const DEC = 10;
const DOZ = 12;
const HEX = 16;
const SEXA = 60;
const DEG = 360;
const MAX_PCT = 100;
const MAX_RGB = 255;
const POW_SQR = 2;
const POW_CUBE = 3;
const POW_LINEAR = 2.4;
const LINEAR_COEF = 12.92;
const LINEAR_OFFSET = 0.055;
const LAB_L = 116;
const LAB_A = 500;
const LAB_B = 200;
const LAB_EPSILON = 216 / 24389;
const LAB_KAPPA = 24389 / 27;
const D50 = [0.3457 / 0.3585, 1, (1 - 0.3457 - 0.3585) / 0.3585];
const MATRIX_D50_TO_D65 = [
  [0.955473421488075, -0.02309845494876471, 0.06325924320057072],
  [-0.0283697093338637, 1.0099953980813041, 0.021041441191917323],
  [0.012314014864481998, -0.020507649298898964, 1.330365926242124]
];
const MATRIX_D65_TO_D50 = [
  [1.0479297925449969, 0.022946870601609652, -0.05019226628920524],
  [0.02962780877005599, 0.9904344267538799, -0.017073799063418826],
  [-0.009243040646204504, 0.015055191490298152, 0.7518742814281371]
];
const MATRIX_L_RGB_TO_XYZ = [
  [506752 / 1228815, 87881 / 245763, 12673 / 70218],
  [87098 / 409605, 175762 / 245763, 12673 / 175545],
  [7918 / 409605, 87881 / 737289, 1001167 / 1053270]
];
const MATRIX_XYZ_TO_L_RGB = [
  [12831 / 3959, -329 / 214, -1974 / 3959],
  [-851781 / 878810, 1648619 / 878810, 36519 / 878810],
  [705 / 12673, -2585 / 12673, 705 / 667]
];
const MATRIX_XYZ_TO_LMS = [
  [0.819022437996703, 0.3619062600528904, -0.1288737815209879],
  [0.0329836539323885, 0.9292868615863434, 0.0361446663506424],
  [0.0481771893596242, 0.2642395317527308, 0.6335478284694309]
];
const MATRIX_LMS_TO_XYZ = [
  [1.2268798758459243, -0.5578149944602171, 0.2813910456659647],
  [-0.0405757452148008, 1.112286803280317, -0.0717110580655164],
  [-0.0763729366746601, -0.4214933324022432, 1.5869240198367816]
];
const MATRIX_OKLAB_TO_LMS = [
  [1, 0.3963377773761749, 0.2158037573099136],
  [1, -0.1055613458156586, -0.0638541728258133],
  [1, -0.0894841775298119, -1.2914855480194092]
];
const MATRIX_LMS_TO_OKLAB = [
  [0.210454268309314, 0.7936177747023054, -0.0040720430116193],
  [1.9779985324311684, -2.42859224204858, 0.450593709617411],
  [0.0259040424655478, 0.7827717124575296, -0.8086757549230774]
];
const MATRIX_P3_TO_XYZ = [
  [608311 / 1250200, 189793 / 714400, 198249 / 1000160],
  [35783 / 156275, 247089 / 357200, 198249 / 2500400],
  [0 / 1, 32229 / 714400, 5220557 / 5000800]
];
const MATRIX_REC2020_TO_XYZ = [
  [63426534 / 99577255, 20160776 / 139408157, 47086771 / 278816314],
  [26158966 / 99577255, 472592308 / 697040785, 8267143 / 139408157],
  [0 / 1, 19567812 / 697040785, 295819943 / 278816314]
];
const MATRIX_A98_TO_XYZ = [
  [573536 / 994567, 263643 / 1420810, 187206 / 994567],
  [591459 / 1989134, 6239551 / 9945670, 374412 / 4972835],
  [53769 / 1989134, 351524 / 4972835, 4929758 / 4972835]
];
const MATRIX_PROPHOTO_TO_XYZ_D50 = [
  [0.7977666449006423, 0.13518129740053308, 0.0313477341283922],
  [0.2880748288194013, 0.711835234241873, 8993693872564e-17],
  [0, 0, 0.8251046025104602]
];
const REG_COLOR = new RegExp(`^(?:${SYN_COLOR_TYPE})$`);
const REG_CS_HUE = new RegExp(`^${CS_HUE_CAPT}$`);
const REG_CS_XYZ = /^xyz(?:-d(?:50|65))?$/;
const REG_CURRENT = /^currentColor$/i;
const REG_FN_COLOR = new RegExp(`^color\\(\\s*(${SYN_FN_COLOR})\\s*\\)$`);
const REG_HSL = new RegExp(`^hsla?\\(\\s*(${SYN_HSL}|${SYN_HSL_LV3})\\s*\\)$`);
const REG_HWB = new RegExp(`^hwb\\(\\s*(${SYN_HSL})\\s*\\)$`);
const REG_LAB = new RegExp(`^lab\\(\\s*(${SYN_MOD})\\s*\\)$`);
const REG_LCH = new RegExp(`^lch\\(\\s*(${SYN_LCH})\\s*\\)$`);
const REG_MIX = new RegExp(`^${SYN_MIX}$`);
const REG_MIX_CAPT = new RegExp(`^${SYN_MIX_CAPT}$`);
const REG_MIX_NEST = new RegExp(`${SYN_MIX}`, "g");
const REG_OKLAB = new RegExp(`^oklab\\(\\s*(${SYN_MOD})\\s*\\)$`);
const REG_OKLCH = new RegExp(`^oklch\\(\\s*(${SYN_LCH})\\s*\\)$`);
const REG_SPEC = /^(?:specifi|comput)edValue$/;
const NAMED_COLORS = {
  aliceblue: [240, 248, 255],
  antiquewhite: [250, 235, 215],
  aqua: [0, 255, 255],
  aquamarine: [127, 255, 212],
  azure: [240, 255, 255],
  beige: [245, 245, 220],
  bisque: [255, 228, 196],
  black: [0, 0, 0],
  blanchedalmond: [255, 235, 205],
  blue: [0, 0, 255],
  blueviolet: [138, 43, 226],
  brown: [165, 42, 42],
  burlywood: [222, 184, 135],
  cadetblue: [95, 158, 160],
  chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30],
  coral: [255, 127, 80],
  cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220],
  crimson: [220, 20, 60],
  cyan: [0, 255, 255],
  darkblue: [0, 0, 139],
  darkcyan: [0, 139, 139],
  darkgoldenrod: [184, 134, 11],
  darkgray: [169, 169, 169],
  darkgreen: [0, 100, 0],
  darkgrey: [169, 169, 169],
  darkkhaki: [189, 183, 107],
  darkmagenta: [139, 0, 139],
  darkolivegreen: [85, 107, 47],
  darkorange: [255, 140, 0],
  darkorchid: [153, 50, 204],
  darkred: [139, 0, 0],
  darksalmon: [233, 150, 122],
  darkseagreen: [143, 188, 143],
  darkslateblue: [72, 61, 139],
  darkslategray: [47, 79, 79],
  darkslategrey: [47, 79, 79],
  darkturquoise: [0, 206, 209],
  darkviolet: [148, 0, 211],
  deeppink: [255, 20, 147],
  deepskyblue: [0, 191, 255],
  dimgray: [105, 105, 105],
  dimgrey: [105, 105, 105],
  dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34],
  floralwhite: [255, 250, 240],
  forestgreen: [34, 139, 34],
  fuchsia: [255, 0, 255],
  gainsboro: [220, 220, 220],
  ghostwhite: [248, 248, 255],
  gold: [255, 215, 0],
  goldenrod: [218, 165, 32],
  gray: [128, 128, 128],
  green: [0, 128, 0],
  greenyellow: [173, 255, 47],
  grey: [128, 128, 128],
  honeydew: [240, 255, 240],
  hotpink: [255, 105, 180],
  indianred: [205, 92, 92],
  indigo: [75, 0, 130],
  ivory: [255, 255, 240],
  khaki: [240, 230, 140],
  lavender: [230, 230, 250],
  lavenderblush: [255, 240, 245],
  lawngreen: [124, 252, 0],
  lemonchiffon: [255, 250, 205],
  lightblue: [173, 216, 230],
  lightcoral: [240, 128, 128],
  lightcyan: [224, 255, 255],
  lightgoldenrodyellow: [250, 250, 210],
  lightgray: [211, 211, 211],
  lightgreen: [144, 238, 144],
  lightgrey: [211, 211, 211],
  lightpink: [255, 182, 193],
  lightsalmon: [255, 160, 122],
  lightseagreen: [32, 178, 170],
  lightskyblue: [135, 206, 250],
  lightslategray: [119, 136, 153],
  lightslategrey: [119, 136, 153],
  lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224],
  lime: [0, 255, 0],
  limegreen: [50, 205, 50],
  linen: [250, 240, 230],
  magenta: [255, 0, 255],
  maroon: [128, 0, 0],
  mediumaquamarine: [102, 205, 170],
  mediumblue: [0, 0, 205],
  mediumorchid: [186, 85, 211],
  mediumpurple: [147, 112, 219],
  mediumseagreen: [60, 179, 113],
  mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154],
  mediumturquoise: [72, 209, 204],
  mediumvioletred: [199, 21, 133],
  midnightblue: [25, 25, 112],
  mintcream: [245, 255, 250],
  mistyrose: [255, 228, 225],
  moccasin: [255, 228, 181],
  navajowhite: [255, 222, 173],
  navy: [0, 0, 128],
  oldlace: [253, 245, 230],
  olive: [128, 128, 0],
  olivedrab: [107, 142, 35],
  orange: [255, 165, 0],
  orangered: [255, 69, 0],
  orchid: [218, 112, 214],
  palegoldenrod: [238, 232, 170],
  palegreen: [152, 251, 152],
  paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147],
  papayawhip: [255, 239, 213],
  peachpuff: [255, 218, 185],
  peru: [205, 133, 63],
  pink: [255, 192, 203],
  plum: [221, 160, 221],
  powderblue: [176, 224, 230],
  purple: [128, 0, 128],
  rebeccapurple: [102, 51, 153],
  red: [255, 0, 0],
  rosybrown: [188, 143, 143],
  royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19],
  salmon: [250, 128, 114],
  sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87],
  seashell: [255, 245, 238],
  sienna: [160, 82, 45],
  silver: [192, 192, 192],
  skyblue: [135, 206, 235],
  slateblue: [106, 90, 205],
  slategray: [112, 128, 144],
  slategrey: [112, 128, 144],
  snow: [255, 250, 250],
  springgreen: [0, 255, 127],
  steelblue: [70, 130, 180],
  tan: [210, 180, 140],
  teal: [0, 128, 128],
  thistle: [216, 191, 216],
  tomato: [255, 99, 71],
  turquoise: [64, 224, 208],
  violet: [238, 130, 238],
  wheat: [245, 222, 179],
  white: [255, 255, 255],
  whitesmoke: [245, 245, 245],
  yellow: [255, 255, 0],
  yellowgreen: [154, 205, 50]
};
const validateColorComponents = (arr, opt = {}) => {
  if (!Array.isArray(arr)) {
    throw new TypeError(`${arr} is not an array.`);
  }
  const {
    alpha = false,
    minLength = TRIA,
    maxLength = QUAT,
    minRange = 0,
    maxRange = 1,
    validateRange = true
  } = opt;
  if (!Number.isFinite(minLength)) {
    throw new TypeError(`${minLength} is not a number.`);
  }
  if (!Number.isFinite(maxLength)) {
    throw new TypeError(`${maxLength} is not a number.`);
  }
  if (!Number.isFinite(minRange)) {
    throw new TypeError(`${minRange} is not a number.`);
  }
  if (!Number.isFinite(maxRange)) {
    throw new TypeError(`${maxRange} is not a number.`);
  }
  const l = arr.length;
  if (l < minLength || l > maxLength) {
    throw new Error(`Unexpected array length ${l}.`);
  }
  let i = 0;
  while (i < l) {
    const v = arr[i];
    if (!Number.isFinite(v)) {
      throw new TypeError(`${v} is not a number.`);
    } else if (i < TRIA && validateRange && (v < minRange || v > maxRange)) {
      throw new RangeError(`${v} is not between ${minRange} and ${maxRange}.`);
    } else if (i === TRIA && (v < 0 || v > 1)) {
      throw new RangeError(`${v} is not between 0 and 1.`);
    }
    i++;
  }
  if (alpha && l === TRIA) {
    arr.push(1);
  }
  return arr;
};
const transformMatrix = (mtx, vct, skip = false) => {
  if (!Array.isArray(mtx)) {
    throw new TypeError(`${mtx} is not an array.`);
  } else if (mtx.length !== TRIA) {
    throw new Error(`Unexpected array length ${mtx.length}.`);
  } else if (!skip) {
    for (let i of mtx) {
      i = validateColorComponents(i, {
        maxLength: TRIA,
        validateRange: false
      });
    }
  }
  const [[r1c1, r1c2, r1c3], [r2c1, r2c2, r2c3], [r3c1, r3c2, r3c3]] = mtx;
  let v1, v2, v3;
  if (skip) {
    [v1, v2, v3] = vct;
  } else {
    [v1, v2, v3] = validateColorComponents(vct, {
      maxLength: TRIA,
      validateRange: false
    });
  }
  const p1 = r1c1 * v1 + r1c2 * v2 + r1c3 * v3;
  const p2 = r2c1 * v1 + r2c2 * v2 + r2c3 * v3;
  const p3 = r3c1 * v1 + r3c2 * v2 + r3c3 * v3;
  return [p1, p2, p3];
};
const normalizeColorComponents = (colorA, colorB, skip = false) => {
  if (!Array.isArray(colorA)) {
    throw new TypeError(`${colorA} is not an array.`);
  } else if (colorA.length !== QUAT) {
    throw new Error(`Unexpected array length ${colorA.length}.`);
  }
  if (!Array.isArray(colorB)) {
    throw new TypeError(`${colorB} is not an array.`);
  } else if (colorB.length !== QUAT) {
    throw new Error(`Unexpected array length ${colorB.length}.`);
  }
  let i = 0;
  while (i < QUAT) {
    if (colorA[i] === NONE && colorB[i] === NONE) {
      colorA[i] = 0;
      colorB[i] = 0;
    } else if (colorA[i] === NONE) {
      colorA[i] = colorB[i];
    } else if (colorB[i] === NONE) {
      colorB[i] = colorA[i];
    }
    i++;
  }
  if (!skip) {
    colorA = validateColorComponents(colorA, {
      minLength: QUAT,
      validateRange: false
    });
    colorB = validateColorComponents(colorB, {
      minLength: QUAT,
      validateRange: false
    });
  }
  return [colorA, colorB];
};
const numberToHexString = (value) => {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${value} is not a number.`);
  } else {
    value = Math.round(value);
    if (value < 0 || value > MAX_RGB) {
      throw new RangeError(`${value} is not between 0 and ${MAX_RGB}.`);
    }
  }
  let hex = value.toString(HEX);
  if (hex.length === 1) {
    hex = `0${hex}`;
  }
  return hex;
};
const angleToDeg = (angle) => {
  if (isString(angle)) {
    angle = angle.trim();
  } else {
    throw new TypeError(`${angle} is not a string.`);
  }
  const GRAD = DEG / 400;
  const RAD = DEG / (Math.PI * DUO);
  const reg = new RegExp(`^(${NUM})(${ANGLE})?$`);
  if (!reg.test(angle)) {
    throw new SyntaxError(`Invalid property value: ${angle}`);
  }
  const [, val, unit] = angle.match(reg);
  const value = val[0] === "." ? `0${val}` : val;
  let deg;
  switch (unit) {
    case "grad":
      deg = parseFloat(value) * GRAD;
      break;
    case "rad":
      deg = parseFloat(value) * RAD;
      break;
    case "turn":
      deg = parseFloat(value) * DEG;
      break;
    default:
      deg = parseFloat(value);
  }
  deg %= DEG;
  if (deg < 0) {
    deg += DEG;
  } else if (Object.is(deg, -0)) {
    deg = 0;
  }
  return deg;
};
const parseAlpha = (_alpha) => {
  let alpha = _alpha;
  if (isString(alpha)) {
    alpha = alpha.trim();
    if (!alpha) {
      alpha = 1;
    } else if (alpha === NONE) {
      alpha = 0;
    } else {
      if (alpha[0] === ".") {
        alpha = `0${alpha}`;
      }
      if (alpha.endsWith("%")) {
        alpha = parseFloat(alpha) / MAX_PCT;
      } else {
        alpha = parseFloat(alpha);
      }
      if (!Number.isFinite(alpha)) {
        throw new TypeError(`${alpha} is not a number.`);
      }
      if (alpha < PPTH) {
        alpha = 0;
      } else if (alpha > 1) {
        alpha = 1;
      } else {
        alpha = parseFloat(alpha.toFixed(3));
      }
    }
  } else {
    alpha = 1;
  }
  return alpha;
};
const parseHexAlpha = (value) => {
  if (isString(value)) {
    if (value === "") {
      throw new SyntaxError("Invalid property value: (empty string)");
    }
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  let alpha = parseInt(value, HEX);
  if (alpha <= 0) {
    return 0;
  }
  if (alpha >= MAX_RGB) {
    return 1;
  }
  const alphaMap = /* @__PURE__ */ new Map();
  for (let i = 1; i < MAX_PCT; i++) {
    alphaMap.set(Math.round(i * MAX_RGB / MAX_PCT), i);
  }
  if (alphaMap.has(alpha)) {
    alpha = alphaMap.get(alpha) / MAX_PCT;
  } else {
    alpha = Math.round(alpha / MAX_RGB / PPTH) * PPTH;
  }
  return parseFloat(alpha.toFixed(3));
};
const convertRgbToLinearRgb = (rgb, skip = false) => {
  let rr, gg, bb;
  if (skip) {
    [rr, gg, bb] = rgb;
  } else {
    [rr, gg, bb] = validateColorComponents(rgb, {
      maxLength: TRIA,
      maxRange: MAX_RGB
    });
  }
  let r = rr / MAX_RGB;
  let g = gg / MAX_RGB;
  let b = bb / MAX_RGB;
  const COND_POW = 0.04045;
  if (r > COND_POW) {
    r = Math.pow((r + LINEAR_OFFSET) / (1 + LINEAR_OFFSET), POW_LINEAR);
  } else {
    r /= LINEAR_COEF;
  }
  if (g > COND_POW) {
    g = Math.pow((g + LINEAR_OFFSET) / (1 + LINEAR_OFFSET), POW_LINEAR);
  } else {
    g /= LINEAR_COEF;
  }
  if (b > COND_POW) {
    b = Math.pow((b + LINEAR_OFFSET) / (1 + LINEAR_OFFSET), POW_LINEAR);
  } else {
    b /= LINEAR_COEF;
  }
  return [r, g, b];
};
const convertRgbToXyz = (rgb, skip = false) => {
  let r, g, b, alpha;
  if (skip) {
    [r, g, b, alpha] = rgb;
  } else {
    [r, g, b, alpha] = validateColorComponents(rgb, {
      alpha: true,
      maxRange: MAX_RGB
    });
  }
  const [rr, gg, bb] = convertRgbToLinearRgb([r, g, b], true);
  const [x, y, z] = transformMatrix(MATRIX_L_RGB_TO_XYZ, [rr, gg, bb], true);
  return [x, y, z, alpha];
};
const convertRgbToHex = (rgb) => {
  const [r, g, b, alpha] = validateColorComponents(rgb, {
    alpha: true,
    maxRange: MAX_RGB
  });
  const rr = numberToHexString(r);
  const gg = numberToHexString(g);
  const bb = numberToHexString(b);
  const aa = numberToHexString(alpha * MAX_RGB);
  let hex;
  if (aa === "ff") {
    hex = `#${rr}${gg}${bb}`;
  } else {
    hex = `#${rr}${gg}${bb}${aa}`;
  }
  return hex;
};
const convertLinearRgbToRgb = (rgb, round = false) => {
  let [r, g, b] = validateColorComponents(rgb, {
    maxLength: TRIA
  });
  const COND_POW = 809 / 258400;
  if (r > COND_POW) {
    r = Math.pow(r, 1 / POW_LINEAR) * (1 + LINEAR_OFFSET) - LINEAR_OFFSET;
  } else {
    r *= LINEAR_COEF;
  }
  r *= MAX_RGB;
  if (g > COND_POW) {
    g = Math.pow(g, 1 / POW_LINEAR) * (1 + LINEAR_OFFSET) - LINEAR_OFFSET;
  } else {
    g *= LINEAR_COEF;
  }
  g *= MAX_RGB;
  if (b > COND_POW) {
    b = Math.pow(b, 1 / POW_LINEAR) * (1 + LINEAR_OFFSET) - LINEAR_OFFSET;
  } else {
    b *= LINEAR_COEF;
  }
  b *= MAX_RGB;
  return [
    round ? Math.round(r) : r,
    round ? Math.round(g) : g,
    round ? Math.round(b) : b
  ];
};
const convertXyzToRgb = (xyz, skip = false) => {
  let x, y, z, alpha;
  if (skip) {
    [x, y, z, alpha] = xyz;
  } else {
    [x, y, z, alpha] = validateColorComponents(xyz, {
      validateRange: false
    });
  }
  let [r, g, b] = transformMatrix(MATRIX_XYZ_TO_L_RGB, [x, y, z], true);
  [r, g, b] = convertLinearRgbToRgb(
    [
      Math.min(Math.max(r, 0), 1),
      Math.min(Math.max(g, 0), 1),
      Math.min(Math.max(b, 0), 1)
    ],
    true
  );
  return [r, g, b, alpha];
};
const convertXyzToHsl = (xyz, skip = false) => {
  const [rr, gg, bb, alpha] = convertXyzToRgb(xyz, skip);
  const r = rr / MAX_RGB;
  const g = gg / MAX_RGB;
  const b = bb / MAX_RGB;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = (max + min) * HALF * MAX_PCT;
  let h, s;
  if (Math.round(l) === 0 || Math.round(l) === MAX_PCT) {
    h = NONE;
    s = NONE;
  } else {
    s = d / (1 - Math.abs(max + min - 1)) * MAX_PCT;
    if (s === 0) {
      h = NONE;
    } else {
      switch (max) {
        case r:
          h = (g - b) / d;
          break;
        case g:
          h = (b - r) / d + DUO;
          break;
        case b:
        default:
          h = (r - g) / d + QUAT;
          break;
      }
      h = h * SEXA % DEG;
      if (h < 0) {
        h += DEG;
      }
    }
  }
  return [h, s, l, alpha];
};
const convertXyzToHwb = (xyz, skip = false) => {
  const [r, g, b, alpha] = convertXyzToRgb(xyz, skip);
  const w = Math.min(r, g, b) / MAX_RGB;
  const bk = 1 - Math.max(r, g, b) / MAX_RGB;
  let h;
  if (w + bk === 1) {
    h = NONE;
  } else {
    [h] = convertXyzToHsl(xyz);
  }
  return [h, w * MAX_PCT, bk * MAX_PCT, alpha];
};
const convertXyzToOklab = (xyz, skip = false) => {
  let x, y, z, alpha;
  if (skip) {
    [x, y, z, alpha] = xyz;
  } else {
    [x, y, z, alpha] = validateColorComponents(xyz, {
      validateRange: false
    });
  }
  const lms = transformMatrix(MATRIX_XYZ_TO_LMS, [x, y, z], true);
  const xyzLms = lms.map((c) => Math.cbrt(c));
  let [l, a, b] = transformMatrix(MATRIX_LMS_TO_OKLAB, xyzLms, true);
  l = Math.min(Math.max(l, 0), 1);
  const lPct = Math.round(parseFloat(l.toFixed(QUAT)) * MAX_PCT);
  if (lPct === 0 || lPct === MAX_PCT) {
    a = NONE;
    b = NONE;
  }
  return [l, a, b, alpha];
};
const convertXyzToOklch = (xyz, skip = false) => {
  const [l, a, b, aa] = convertXyzToOklab(xyz, skip);
  let c, h;
  const lPct = Math.round(parseFloat(l.toFixed(QUAT)) * MAX_PCT);
  if (lPct === 0 || lPct === MAX_PCT) {
    c = NONE;
    h = NONE;
  } else {
    c = Math.max(Math.sqrt(Math.pow(a, POW_SQR) + Math.pow(b, POW_SQR)), 0);
    if (parseFloat(c.toFixed(QUAT)) === 0) {
      h = NONE;
    } else {
      h = Math.atan2(b, a) * DEG * HALF / Math.PI;
      if (h < 0) {
        h += DEG;
      }
    }
  }
  return [l, c, h, aa];
};
const convertXyzD50ToRgb = (xyz, skip = false) => {
  let x, y, z, alpha;
  if (skip) {
    [x, y, z, alpha] = xyz;
  } else {
    [x, y, z, alpha] = validateColorComponents(xyz, {
      minLength: QUAT,
      validateRange: false
    });
  }
  const xyzD65 = transformMatrix(MATRIX_D50_TO_D65, [x, y, z], true);
  const [r, g, b] = convertXyzToRgb(xyzD65, true);
  return [r, g, b, alpha];
};
const convertXyzD50ToLab = (xyz, skip = false) => {
  let x, y, z, alpha;
  if (skip) {
    [x, y, z, alpha] = xyz;
  } else {
    [x, y, z, alpha] = validateColorComponents(xyz, {
      validateRange: false
    });
  }
  const xyzD50 = [x, y, z].map((val, i) => val / D50[i]);
  const [f0, f1, f2] = xyzD50.map(
    (val) => val > LAB_EPSILON ? Math.cbrt(val) : (val * LAB_KAPPA + HEX) / LAB_L
  );
  const l = Math.min(Math.max(LAB_L * f1 - HEX, 0), MAX_PCT);
  let a, b;
  if (l === 0 || l === MAX_PCT) {
    a = NONE;
    b = NONE;
  } else {
    a = (f0 - f1) * LAB_A;
    b = (f1 - f2) * LAB_B;
  }
  return [l, a, b, alpha];
};
const convertXyzD50ToLch = (xyz, skip = false) => {
  const [l, a, b, alpha] = convertXyzD50ToLab(xyz, skip);
  let c, h;
  if (l === 0 || l === MAX_PCT) {
    c = NONE;
    h = NONE;
  } else {
    c = Math.max(Math.sqrt(Math.pow(a, POW_SQR) + Math.pow(b, POW_SQR)), 0);
    h = Math.atan2(b, a) * DEG * HALF / Math.PI;
    if (h < 0) {
      h += DEG;
    }
  }
  return [l, c, h, alpha];
};
const convertHexToRgb = (value) => {
  if (isString(value)) {
    value = value.toLowerCase().trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  if (!(/^#[\da-f]{6}$/.test(value) || /^#[\da-f]{3}$/.test(value) || /^#[\da-f]{8}$/.test(value) || /^#[\da-f]{4}$/.test(value))) {
    throw new SyntaxError(`Invalid property value: ${value}`);
  }
  const arr = [];
  if (/^#[\da-f]{6}$/.test(value)) {
    const [, r, g, b] = value.match(
      /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/
    );
    arr.push(parseInt(r, HEX), parseInt(g, HEX), parseInt(b, HEX), 1);
  } else if (/^#[\da-f]{3}$/.test(value)) {
    const [, r, g, b] = value.match(/^#([\da-f])([\da-f])([\da-f])$/);
    arr.push(
      parseInt(`${r}${r}`, HEX),
      parseInt(`${g}${g}`, HEX),
      parseInt(`${b}${b}`, HEX),
      1
    );
  } else if (/^#[\da-f]{8}$/.test(value)) {
    const [, r, g, b, alpha] = value.match(
      /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})([\da-f]{2})$/
    );
    arr.push(
      parseInt(r, HEX),
      parseInt(g, HEX),
      parseInt(b, HEX),
      parseHexAlpha(alpha)
    );
  } else if (/^#[\da-f]{4}$/.test(value)) {
    const [, r, g, b, alpha] = value.match(
      /^#([\da-f])([\da-f])([\da-f])([\da-f])$/
    );
    arr.push(
      parseInt(`${r}${r}`, HEX),
      parseInt(`${g}${g}`, HEX),
      parseInt(`${b}${b}`, HEX),
      parseHexAlpha(`${alpha}${alpha}`)
    );
  }
  return arr;
};
const convertHexToLinearRgb = (value) => {
  const [rr, gg, bb, alpha] = convertHexToRgb(value);
  const [r, g, b] = convertRgbToLinearRgb([rr, gg, bb], true);
  return [r, g, b, alpha];
};
const convertHexToXyz = (value) => {
  const [r, g, b, alpha] = convertHexToLinearRgb(value);
  const [x, y, z] = transformMatrix(MATRIX_L_RGB_TO_XYZ, [r, g, b], true);
  return [x, y, z, alpha];
};
const parseRgb = (value, opt = {}) => {
  if (isString(value)) {
    value = value.toLowerCase().trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { format } = opt;
  const reg = new RegExp(`^rgba?\\(\\s*(${SYN_MOD}|${SYN_RGB_LV3})\\s*\\)$`);
  if (!reg.test(value)) {
    switch (format) {
      case VAL_MIX: {
        return null;
      }
      case VAL_SPEC: {
        return "";
      }
      default: {
        return ["rgb", 0, 0, 0, 0];
      }
    }
  }
  const [, val] = value.match(reg);
  let [v1, v2, v3, v4] = val.replace(/[,/]/g, " ").split(/\s+/);
  let r, g, b;
  if (v1 === NONE) {
    r = 0;
  } else {
    if (v1[0] === ".") {
      v1 = `0${v1}`;
    }
    if (v1.endsWith("%")) {
      r = parseFloat(v1) * MAX_RGB / MAX_PCT;
    } else {
      r = parseFloat(v1);
    }
    r = Math.min(Math.max(roundToPrecision(r, OCT), 0), MAX_RGB);
  }
  if (v2 === NONE) {
    g = 0;
  } else {
    if (v2[0] === ".") {
      v2 = `0${v2}`;
    }
    if (v2.endsWith("%")) {
      g = parseFloat(v2) * MAX_RGB / MAX_PCT;
    } else {
      g = parseFloat(v2);
    }
    g = Math.min(Math.max(roundToPrecision(g, OCT), 0), MAX_RGB);
  }
  if (v3 === NONE) {
    b = 0;
  } else {
    if (v3[0] === ".") {
      v3 = `0${v3}`;
    }
    if (v3.endsWith("%")) {
      b = parseFloat(v3) * MAX_RGB / MAX_PCT;
    } else {
      b = parseFloat(v3);
    }
    b = Math.min(Math.max(roundToPrecision(b, OCT), 0), MAX_RGB);
  }
  const alpha = parseAlpha(v4);
  return ["rgb", r, g, b, format === VAL_MIX && v4 === NONE ? NONE : alpha];
};
const parseHsl = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { format } = opt;
  if (!REG_HSL.test(value)) {
    switch (format) {
      case "hsl":
      case VAL_MIX: {
        return null;
      }
      case VAL_SPEC: {
        return "";
      }
      default: {
        return ["rgb", 0, 0, 0, 0];
      }
    }
  }
  const [, val] = value.match(REG_HSL);
  let [h, s, l, alpha] = val.replace(/[,/]/g, " ").split(/\s+/);
  if (h === NONE) {
    if (format !== "hsl") {
      h = 0;
    }
  } else {
    h = angleToDeg(h);
  }
  if (s === NONE) {
    if (format !== "hsl") {
      s = 0;
    }
  } else {
    if (s[0] === ".") {
      s = `0${s}`;
    }
    s = Math.min(Math.max(parseFloat(s), 0), MAX_PCT);
  }
  if (l === NONE) {
    if (format !== "hsl") {
      l = 0;
    }
  } else {
    if (l[0] === ".") {
      l = `0${l}`;
    }
    l = Math.min(Math.max(parseFloat(l), 0), MAX_PCT);
  }
  if (alpha !== NONE || format !== "hsl") {
    alpha = parseAlpha(alpha);
  }
  if (format === "hsl") {
    return [format, h, s, l, alpha];
  }
  const ll = l / MAX_PCT;
  const sa = s / MAX_PCT * Math.min(ll, 1 - ll);
  const rk = h / DEG * DOZ % DOZ;
  const gk = (8 + h / DEG * DOZ) % DOZ;
  const bk = (4 + h / DEG * DOZ) % DOZ;
  const r = ll - sa * Math.max(-1, Math.min(rk - TRIA, TRIA ** POW_SQR - rk, 1));
  const g = ll - sa * Math.max(-1, Math.min(gk - TRIA, TRIA ** POW_SQR - gk, 1));
  const b = ll - sa * Math.max(-1, Math.min(bk - TRIA, TRIA ** POW_SQR - bk, 1));
  return [
    "rgb",
    Math.min(Math.max(roundToPrecision(r * MAX_RGB, OCT), 0), MAX_RGB),
    Math.min(Math.max(roundToPrecision(g * MAX_RGB, OCT), 0), MAX_RGB),
    Math.min(Math.max(roundToPrecision(b * MAX_RGB, OCT), 0), MAX_RGB),
    alpha
  ];
};
const parseHwb = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { format } = opt;
  if (!REG_HWB.test(value)) {
    switch (format) {
      case "hwb":
      case VAL_MIX: {
        return null;
      }
      case VAL_SPEC: {
        return "";
      }
      default: {
        return ["rgb", 0, 0, 0, 0];
      }
    }
  }
  const [, val] = value.match(REG_HWB);
  let [h, w, b, alpha] = val.replace("/", " ").split(/\s+/);
  if (h === NONE) {
    if (format !== "hwb") {
      h = 0;
    }
  } else {
    h = angleToDeg(h);
  }
  if (w === NONE) {
    if (format !== "hwb") {
      w = 0;
    }
  } else {
    if (w[0] === ".") {
      w = `0${w}`;
    }
    w = Math.min(Math.max(parseFloat(w), 0), MAX_PCT) / MAX_PCT;
  }
  if (b === NONE) {
    if (format !== "hwb") {
      b = 0;
    }
  } else {
    if (b[0] === ".") {
      b = `0${b}`;
    }
    b = Math.min(Math.max(parseFloat(b), 0), MAX_PCT) / MAX_PCT;
  }
  if (alpha !== NONE || format !== "hwb") {
    alpha = parseAlpha(alpha);
  }
  if (format === "hwb") {
    return [
      format,
      h,
      w === NONE ? w : w * MAX_PCT,
      b === NONE ? b : b * MAX_PCT,
      alpha
    ];
  }
  if (w + b >= 1) {
    const v = roundToPrecision(
      w / (w + b) * MAX_RGB,
      OCT
    );
    return ["rgb", v, v, v, alpha];
  }
  const factor = (1 - w - b) / MAX_RGB;
  let [, rr, gg, bb] = parseHsl(`hsl(${h} 100 50)`);
  rr = roundToPrecision(
    (rr * factor + w) * MAX_RGB,
    OCT
  );
  gg = roundToPrecision(
    (gg * factor + w) * MAX_RGB,
    OCT
  );
  bb = roundToPrecision(
    (bb * factor + w) * MAX_RGB,
    OCT
  );
  return [
    "rgb",
    Math.min(Math.max(rr, 0), MAX_RGB),
    Math.min(Math.max(gg, 0), MAX_RGB),
    Math.min(Math.max(bb, 0), MAX_RGB),
    alpha
  ];
};
const parseLab = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { format } = opt;
  if (!REG_LAB.test(value)) {
    switch (format) {
      case VAL_MIX: {
        return null;
      }
      case VAL_SPEC: {
        return "";
      }
      default: {
        return ["rgb", 0, 0, 0, 0];
      }
    }
  }
  const COEF_PCT = 1.25;
  const COND_POW = 8;
  const [, val] = value.match(REG_LAB);
  let [l, a, b, alpha] = val.replace("/", " ").split(/\s+/);
  if (l === NONE) {
    if (!REG_SPEC.test(format)) {
      l = 0;
    }
  } else {
    if (l[0] === ".") {
      l = `0${l}`;
    }
    if (l.endsWith("%")) {
      l = parseFloat(l);
      if (l > MAX_PCT) {
        l = MAX_PCT;
      }
    } else {
      l = parseFloat(l);
    }
    if (l < 0) {
      l = 0;
    }
  }
  if (a === NONE) {
    if (!REG_SPEC.test(format)) {
      a = 0;
    }
  } else {
    if (a[0] === ".") {
      a = `0${a}`;
    }
    if (a.endsWith("%")) {
      a = parseFloat(a) * COEF_PCT;
    } else {
      a = parseFloat(a);
    }
  }
  if (b === NONE) {
    if (!REG_SPEC.test(format)) {
      b = 0;
    }
  } else {
    if (b.endsWith("%")) {
      b = parseFloat(b) * COEF_PCT;
    } else {
      b = parseFloat(b);
    }
  }
  if (alpha !== NONE || !REG_SPEC.test(format)) {
    alpha = parseAlpha(alpha);
  }
  if (REG_SPEC.test(format)) {
    return [
      "lab",
      l === NONE ? l : roundToPrecision(l, HEX),
      a === NONE ? a : roundToPrecision(a, HEX),
      b === NONE ? b : roundToPrecision(b, HEX),
      alpha
    ];
  }
  const fl = (l + HEX) / LAB_L;
  const fa = a / LAB_A + fl;
  const fb = fl - b / LAB_B;
  const powFl = Math.pow(fl, POW_CUBE);
  const powFa = Math.pow(fa, POW_CUBE);
  const powFb = Math.pow(fb, POW_CUBE);
  const xyz = [
    powFa > LAB_EPSILON ? powFa : (fa * LAB_L - HEX) / LAB_KAPPA,
    l > COND_POW ? powFl : l / LAB_KAPPA,
    powFb > LAB_EPSILON ? powFb : (fb * LAB_L - HEX) / LAB_KAPPA
  ];
  const [x, y, z] = xyz.map((val2, i) => val2 * D50[i]);
  return [
    "xyz-d50",
    roundToPrecision(x, HEX),
    roundToPrecision(y, HEX),
    roundToPrecision(z, HEX),
    alpha
  ];
};
const parseLch = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { format } = opt;
  if (!REG_LCH.test(value)) {
    switch (format) {
      case VAL_MIX: {
        return null;
      }
      case VAL_SPEC: {
        return "";
      }
      default: {
        return ["rgb", 0, 0, 0, 0];
      }
    }
  }
  const COEF_PCT = 1.5;
  const [, val] = value.match(REG_LCH);
  let [l, c, h, alpha] = val.replace("/", " ").split(/\s+/);
  if (l === NONE) {
    if (!REG_SPEC.test(format)) {
      l = 0;
    }
  } else {
    if (l[0] === ".") {
      l = `0${l}`;
    }
    l = parseFloat(l);
    if (l < 0) {
      l = 0;
    }
  }
  if (c === NONE) {
    if (!REG_SPEC.test(format)) {
      c = 0;
    }
  } else {
    if (c[0] === ".") {
      c = `0${c}`;
    }
    if (c.endsWith("%")) {
      c = parseFloat(c) * COEF_PCT;
    } else {
      c = parseFloat(c);
    }
  }
  if (h === NONE) {
    if (!REG_SPEC.test(format)) {
      h = 0;
    }
  } else {
    h = angleToDeg(h);
  }
  if (alpha !== NONE || !REG_SPEC.test(format)) {
    alpha = parseAlpha(alpha);
  }
  if (REG_SPEC.test(format)) {
    return [
      "lch",
      l === NONE ? l : roundToPrecision(l, HEX),
      c === NONE ? c : roundToPrecision(c, HEX),
      h === NONE ? h : roundToPrecision(h, HEX),
      alpha
    ];
  }
  const a = c * Math.cos(h * Math.PI / (DEG * HALF));
  const b = c * Math.sin(h * Math.PI / (DEG * HALF));
  const [, x, y, z] = parseLab(`lab(${l} ${a} ${b})`);
  return [
    "xyz-d50",
    roundToPrecision(x, HEX),
    roundToPrecision(y, HEX),
    roundToPrecision(z, HEX),
    alpha
  ];
};
const parseOklab = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { format } = opt;
  if (!REG_OKLAB.test(value)) {
    switch (format) {
      case VAL_MIX: {
        return null;
      }
      case VAL_SPEC: {
        return "";
      }
      default: {
        return ["rgb", 0, 0, 0, 0];
      }
    }
  }
  const COEF_PCT = 0.4;
  const [, val] = value.match(REG_OKLAB);
  let [l, a, b, alpha] = val.replace("/", " ").split(/\s+/);
  if (l === NONE) {
    if (!REG_SPEC.test(format)) {
      l = 0;
    }
  } else {
    if (l[0] === ".") {
      l = `0${l}`;
    }
    if (l.endsWith("%")) {
      l = parseFloat(l) / MAX_PCT;
    } else {
      l = parseFloat(l);
    }
    if (l < 0) {
      l = 0;
    }
  }
  if (a === NONE) {
    if (!REG_SPEC.test(format)) {
      a = 0;
    }
  } else {
    if (a[0] === ".") {
      a = `0${a}`;
    }
    if (a.endsWith("%")) {
      a = parseFloat(a) * COEF_PCT / MAX_PCT;
    } else {
      a = parseFloat(a);
    }
  }
  if (b === NONE) {
    if (!REG_SPEC.test(format)) {
      b = 0;
    }
  } else {
    if (b.endsWith("%")) {
      b = parseFloat(b) * COEF_PCT / MAX_PCT;
    } else {
      b = parseFloat(b);
    }
  }
  if (alpha !== NONE || !REG_SPEC.test(format)) {
    alpha = parseAlpha(alpha);
  }
  if (REG_SPEC.test(format)) {
    return [
      "oklab",
      l === NONE ? l : roundToPrecision(l, HEX),
      a === NONE ? a : roundToPrecision(a, HEX),
      b === NONE ? b : roundToPrecision(b, HEX),
      alpha
    ];
  }
  const lms = transformMatrix(MATRIX_OKLAB_TO_LMS, [
    l,
    a,
    b
  ]);
  const xyzLms = lms.map((c) => Math.pow(c, POW_CUBE));
  const [x, y, z] = transformMatrix(MATRIX_LMS_TO_XYZ, xyzLms, true);
  return [
    "xyz-d65",
    roundToPrecision(x, HEX),
    roundToPrecision(y, HEX),
    roundToPrecision(z, HEX),
    alpha
  ];
};
const parseOklch = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { format } = opt;
  if (!REG_OKLCH.test(value)) {
    switch (format) {
      case VAL_MIX: {
        return null;
      }
      case VAL_SPEC: {
        return "";
      }
      default: {
        return ["rgb", 0, 0, 0, 0];
      }
    }
  }
  const COEF_PCT = 0.4;
  const [, val] = value.match(REG_OKLCH);
  let [l, c, h, alpha] = val.replace("/", " ").split(/\s+/);
  if (l === NONE) {
    if (!REG_SPEC.test(format)) {
      l = 0;
    }
  } else {
    if (l[0] === ".") {
      l = `0${l}`;
    }
    if (l.endsWith("%")) {
      l = parseFloat(l) / MAX_PCT;
    } else {
      l = parseFloat(l);
    }
    if (l < 0) {
      l = 0;
    }
  }
  if (c === NONE) {
    if (!REG_SPEC.test(format)) {
      c = 0;
    }
  } else {
    if (c[0] === ".") {
      c = `0${c}`;
    }
    if (c.endsWith("%")) {
      c = parseFloat(c) * COEF_PCT / MAX_PCT;
    } else {
      c = parseFloat(c);
    }
    if (c < 0) {
      c = 0;
    }
  }
  if (h === NONE) {
    if (!REG_SPEC.test(format)) {
      h = 0;
    }
  } else {
    h = angleToDeg(h);
  }
  if (alpha !== NONE || !REG_SPEC.test(format)) {
    alpha = parseAlpha(alpha);
  }
  if (REG_SPEC.test(format)) {
    return [
      "oklch",
      l === NONE ? l : roundToPrecision(l, HEX),
      c === NONE ? c : roundToPrecision(c, HEX),
      h === NONE ? h : roundToPrecision(h, HEX),
      alpha
    ];
  }
  const a = c * Math.cos(h * Math.PI / (DEG * HALF));
  const b = c * Math.sin(h * Math.PI / (DEG * HALF));
  const lms = transformMatrix(MATRIX_OKLAB_TO_LMS, [l, a, b]);
  const xyzLms = lms.map((cl) => Math.pow(cl, POW_CUBE));
  const [x, y, z] = transformMatrix(MATRIX_LMS_TO_XYZ, xyzLms, true);
  return [
    "xyz-d65",
    roundToPrecision(x, HEX),
    roundToPrecision(y, HEX),
    roundToPrecision(z, HEX),
    alpha
  ];
};
const parseColorFunc = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { colorSpace, d50, format } = opt;
  if (!REG_FN_COLOR.test(value)) {
    switch (format) {
      case VAL_MIX: {
        return null;
      }
      case VAL_SPEC: {
        return "";
      }
      default: {
        return ["rgb", 0, 0, 0, 0];
      }
    }
  }
  const [, val] = value.match(REG_FN_COLOR);
  let [cs, v1, v2, v3, v4] = val.replace("/", " ").split(/\s+/);
  let r, g, b;
  if (cs === "xyz") {
    cs = "xyz-d65";
  }
  if (v1 === NONE) {
    r = 0;
  } else {
    if (v1[0] === ".") {
      v1 = `0${v1}`;
    }
    r = v1.endsWith("%") ? parseFloat(v1) / MAX_PCT : parseFloat(v1);
  }
  if (v2 === NONE) {
    g = 0;
  } else {
    if (v2[0] === ".") {
      v2 = `0${v2}`;
    }
    g = v2.endsWith("%") ? parseFloat(v2) / MAX_PCT : parseFloat(v2);
  }
  if (v3 === NONE) {
    b = 0;
  } else {
    if (v3[0] === ".") {
      v3 = `0${v3}`;
    }
    b = v3.endsWith("%") ? parseFloat(v3) / MAX_PCT : parseFloat(v3);
  }
  const alpha = parseAlpha(v4);
  if (REG_SPEC.test(format) || format === VAL_MIX && cs === colorSpace) {
    return [
      cs,
      v1 === NONE ? NONE : roundToPrecision(r, DEC),
      v2 === NONE ? NONE : roundToPrecision(g, DEC),
      v3 === NONE ? NONE : roundToPrecision(b, DEC),
      v4 === NONE ? NONE : alpha
    ];
  }
  let x, y, z;
  if (cs === "srgb") {
    [x, y, z] = convertRgbToXyz([r * MAX_RGB, g * MAX_RGB, b * MAX_RGB]);
    if (d50) {
      [x, y, z] = transformMatrix(
        MATRIX_D65_TO_D50,
        [x, y, z],
        true
      );
    }
  } else if (cs === "srgb-linear") {
    [x, y, z] = transformMatrix(MATRIX_L_RGB_TO_XYZ, [r, g, b]);
    if (d50) {
      [x, y, z] = transformMatrix(
        MATRIX_D65_TO_D50,
        [x, y, z],
        true
      );
    }
  } else if (cs === "display-p3") {
    const linearRgb = convertRgbToLinearRgb([
      r * MAX_RGB,
      g * MAX_RGB,
      b * MAX_RGB
    ]);
    [x, y, z] = transformMatrix(MATRIX_P3_TO_XYZ, linearRgb);
    if (d50) {
      [x, y, z] = transformMatrix(
        MATRIX_D65_TO_D50,
        [x, y, z],
        true
      );
    }
  } else if (cs === "rec2020") {
    const ALPHA = 1.09929682680944;
    const BETA = 0.018053968510807;
    const REC_COEF = 0.45;
    const rgb = [r, g, b].map((c) => {
      let cl;
      if (c < BETA * REC_COEF * DEC) {
        cl = c / (REC_COEF * DEC);
      } else {
        cl = Math.pow((c + ALPHA - 1) / ALPHA, 1 / REC_COEF);
      }
      return cl;
    });
    [x, y, z] = transformMatrix(MATRIX_REC2020_TO_XYZ, rgb);
    if (d50) {
      [x, y, z] = transformMatrix(
        MATRIX_D65_TO_D50,
        [x, y, z],
        true
      );
    }
  } else if (cs === "a98-rgb") {
    const POW_A98 = 563 / 256;
    const rgb = [r, g, b].map((c) => {
      const cl = Math.pow(c, POW_A98);
      return cl;
    });
    [x, y, z] = transformMatrix(MATRIX_A98_TO_XYZ, rgb);
    if (d50) {
      [x, y, z] = transformMatrix(
        MATRIX_D65_TO_D50,
        [x, y, z],
        true
      );
    }
  } else if (cs === "prophoto-rgb") {
    const POW_PROPHOTO = 1.8;
    const rgb = [r, g, b].map((c) => {
      let cl;
      if (c > 1 / (HEX * DUO)) {
        cl = Math.pow(c, POW_PROPHOTO);
      } else {
        cl = c / HEX;
      }
      return cl;
    });
    [x, y, z] = transformMatrix(MATRIX_PROPHOTO_TO_XYZ_D50, rgb);
    if (!d50) {
      [x, y, z] = transformMatrix(
        MATRIX_D50_TO_D65,
        [x, y, z],
        true
      );
    }
  } else if (/^xyz(?:-d(?:50|65))?$/.test(cs)) {
    [x, y, z] = [r, g, b];
    if (cs === "xyz-d50") {
      if (!d50) {
        [x, y, z] = transformMatrix(MATRIX_D50_TO_D65, [x, y, z]);
      }
    } else if (d50) {
      [x, y, z] = transformMatrix(MATRIX_D65_TO_D50, [x, y, z], true);
    }
  }
  return [
    d50 ? "xyz-d50" : "xyz-d65",
    roundToPrecision(x, HEX),
    roundToPrecision(y, HEX),
    roundToPrecision(z, HEX),
    format === VAL_MIX && v4 === NONE ? NONE : alpha
  ];
};
const parseColorValue = (value, opt = {}) => {
  if (isString(value)) {
    value = value.toLowerCase().trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { d50, format } = opt;
  if (!REG_COLOR.test(value)) {
    switch (format) {
      case VAL_MIX: {
        return null;
      }
      case VAL_SPEC: {
        return "";
      }
      default: {
        return ["rgb", 0, 0, 0, 0];
      }
    }
  }
  let x, y, z, alpha;
  if (REG_CURRENT.test(value)) {
    if (format === VAL_COMP) {
      return ["rgb", 0, 0, 0, 0];
    }
    if (format === VAL_SPEC) {
      return value;
    }
    x = 0;
    y = 0;
    z = 0;
    alpha = 0;
  } else if (/^[a-z]+$/.test(value)) {
    if (Object.prototype.hasOwnProperty.call(NAMED_COLORS, value)) {
      if (format === VAL_SPEC) {
        return value;
      }
      const [r, g, b] = NAMED_COLORS[value];
      alpha = 1;
      if (format === VAL_COMP) {
        return ["rgb", r, g, b, alpha];
      }
      [x, y, z] = convertRgbToXyz([r, g, b], true);
      if (d50) {
        [x, y, z] = transformMatrix(
          MATRIX_D65_TO_D50,
          [x, y, z],
          true
        );
      }
    } else {
      if (format === VAL_COMP) {
        return ["rgb", 0, 0, 0, 0];
      }
      if (format === VAL_SPEC) {
        if (value === "transparent") {
          return value;
        }
        return "";
      }
      if (format === VAL_MIX) {
        if (value === "transparent") {
          return ["rgb", 0, 0, 0, 0];
        }
        return null;
      }
      x = 0;
      y = 0;
      z = 0;
      alpha = 0;
    }
  } else if (value[0] === "#") {
    if (REG_SPEC.test(format)) {
      const rgb = convertHexToRgb(value);
      return ["rgb", ...rgb];
    }
    [x, y, z, alpha] = convertHexToXyz(value);
    if (d50) {
      [x, y, z] = transformMatrix(
        MATRIX_D65_TO_D50,
        [x, y, z],
        true
      );
    }
  } else if (value.startsWith("lab")) {
    if (REG_SPEC.test(format)) {
      return parseLab(value, opt);
    }
    [, x, y, z, alpha] = parseLab(value);
    if (!d50) {
      [x, y, z] = transformMatrix(
        MATRIX_D50_TO_D65,
        [x, y, z],
        true
      );
    }
  } else if (value.startsWith("lch")) {
    if (REG_SPEC.test(format)) {
      return parseLch(value, opt);
    }
    [, x, y, z, alpha] = parseLch(value);
    if (!d50) {
      [x, y, z] = transformMatrix(
        MATRIX_D50_TO_D65,
        [x, y, z],
        true
      );
    }
  } else if (value.startsWith("oklab")) {
    if (REG_SPEC.test(format)) {
      return parseOklab(value, opt);
    }
    [, x, y, z, alpha] = parseOklab(value);
    if (d50) {
      [x, y, z] = transformMatrix(
        MATRIX_D65_TO_D50,
        [x, y, z],
        true
      );
    }
  } else if (value.startsWith("oklch")) {
    if (REG_SPEC.test(format)) {
      return parseOklch(value, opt);
    }
    [, x, y, z, alpha] = parseOklch(value);
    if (d50) {
      [x, y, z] = transformMatrix(
        MATRIX_D65_TO_D50,
        [x, y, z],
        true
      );
    }
  } else {
    let r, g, b;
    if (value.startsWith("hsl")) {
      [, r, g, b, alpha] = parseHsl(value);
    } else if (value.startsWith("hwb")) {
      [, r, g, b, alpha] = parseHwb(value);
    } else {
      [, r, g, b, alpha] = parseRgb(value, opt);
    }
    if (REG_SPEC.test(format)) {
      return [
        "rgb",
        Math.round(r),
        Math.round(g),
        Math.round(b),
        alpha
      ];
    }
    [x, y, z] = convertRgbToXyz([r, g, b]);
    if (d50) {
      [x, y, z] = transformMatrix(
        MATRIX_D65_TO_D50,
        [x, y, z],
        true
      );
    }
  }
  return [
    d50 ? "xyz-d50" : "xyz-d65",
    roundToPrecision(x, HEX),
    roundToPrecision(y, HEX),
    roundToPrecision(z, HEX),
    alpha
  ];
};
const resolveColorValue = (value, opt = {}) => {
  if (isString(value)) {
    value = value.toLowerCase().trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { colorSpace, format } = opt;
  if (!REG_COLOR.test(value)) {
    switch (format) {
      case VAL_MIX: {
        return null;
      }
      case VAL_SPEC: {
        return "";
      }
      default: {
        return ["rgb", 0, 0, 0, 0];
      }
    }
  }
  let cs, r, g, b, alpha;
  if (REG_CURRENT.test(value)) {
    if (format === VAL_SPEC) {
      return value;
    }
    r = 0;
    g = 0;
    b = 0;
    alpha = 0;
  } else if (/^[a-z]+$/.test(value)) {
    if (Object.prototype.hasOwnProperty.call(NAMED_COLORS, value)) {
      if (format === VAL_SPEC) {
        return value;
      }
      [r, g, b] = NAMED_COLORS[value];
      alpha = 1;
    } else {
      if (format === VAL_SPEC) {
        if (value === "transparent") {
          return value;
        }
        return "";
      }
      if (format === VAL_MIX) {
        if (value === "transparent") {
          return ["rgb", 0, 0, 0, 0];
        }
        return null;
      }
      r = 0;
      g = 0;
      b = 0;
      alpha = 0;
    }
  } else if (value[0] === "#") {
    [r, g, b, alpha] = convertHexToRgb(value);
  } else if (value.startsWith("rgb")) {
    [, r, g, b, alpha] = parseRgb(value, opt);
  } else if (value.startsWith("hsl")) {
    [, r, g, b, alpha] = parseHsl(value, opt);
  } else if (value.startsWith("hwb")) {
    [, r, g, b, alpha] = parseHwb(value, opt);
  } else if (/^l(?:ab|ch)/.test(value)) {
    let x, y, z;
    if (value.startsWith("lab")) {
      [cs, x, y, z, alpha] = parseLab(value, opt);
    } else {
      [cs, x, y, z, alpha] = parseLch(value, opt);
    }
    if (REG_SPEC.test(format)) {
      return [cs, x, y, z, alpha];
    }
    [r, g, b, alpha] = convertXyzD50ToRgb([
      x,
      y,
      z,
      alpha
    ]);
  } else if (/^okl(?:ab|ch)/.test(value)) {
    let x, y, z;
    if (value.startsWith("oklab")) {
      [cs, x, y, z, alpha] = parseOklab(value, opt);
    } else {
      [cs, x, y, z, alpha] = parseOklch(value, opt);
    }
    if (REG_SPEC.test(format)) {
      return [cs, x, y, z, alpha];
    }
    [r, g, b, alpha] = convertXyzToRgb([
      x,
      y,
      z,
      alpha
    ]);
  }
  if (format === VAL_MIX && colorSpace === "srgb") {
    return [
      "srgb",
      r / MAX_RGB,
      g / MAX_RGB,
      b / MAX_RGB,
      alpha
    ];
  }
  return [
    "rgb",
    Math.round(r),
    Math.round(g),
    Math.round(b),
    alpha
  ];
};
const resolveColorFunc = (value, opt = {}) => {
  if (isString(value)) {
    value = value.toLowerCase().trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { colorSpace, format } = opt;
  if (!REG_FN_COLOR.test(value)) {
    switch (format) {
      case VAL_MIX: {
        return null;
      }
      case VAL_SPEC: {
        return "";
      }
      default: {
        return ["rgb", 0, 0, 0, 0];
      }
    }
  }
  const [cs, x, y, z, alpha] = parseColorFunc(value, opt);
  if (REG_SPEC.test(format) || format === VAL_MIX && cs === colorSpace) {
    return [cs, x, y, z, alpha];
  }
  const [r, g, b] = convertXyzToRgb([
    x,
    y,
    z
  ], true);
  return ["rgb", r, g, b, alpha];
};
const convertColorToLinearRgb = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { colorSpace, format } = opt;
  let cs, r, g, b, alpha, x, y, z;
  if (format === VAL_MIX) {
    let xyz;
    if (value.startsWith(FN_COLOR)) {
      xyz = parseColorFunc(value, opt);
    } else {
      xyz = parseColorValue(value, opt);
    }
    if (xyz === null) {
      return xyz;
    }
    [cs, x, y, z, alpha] = xyz;
    if (cs === colorSpace) {
      return [x, y, z, alpha];
    }
    [r, g, b] = transformMatrix(MATRIX_XYZ_TO_L_RGB, [x, y, z], true);
  } else if (value.startsWith(FN_COLOR)) {
    const [, val] = value.match(REG_FN_COLOR);
    const [cs2] = val.replace("/", " ").split(/\s+/);
    if (cs2 === "srgb-linear") {
      [, r, g, b, alpha] = resolveColorFunc(value, {
        format: VAL_COMP
      });
    } else {
      [, x, y, z, alpha] = parseColorFunc(value);
      [r, g, b] = transformMatrix(MATRIX_XYZ_TO_L_RGB, [x, y, z], true);
    }
  } else {
    [, x, y, z, alpha] = parseColorValue(value);
    [r, g, b] = transformMatrix(MATRIX_XYZ_TO_L_RGB, [x, y, z], true);
  }
  return [
    Math.min(Math.max(r, 0), 1),
    Math.min(Math.max(g, 0), 1),
    Math.min(Math.max(b, 0), 1),
    alpha
  ];
};
const convertColorToRgb = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { format } = opt;
  let r, g, b, alpha;
  if (format === VAL_MIX) {
    let rgb;
    if (value.startsWith(FN_COLOR)) {
      rgb = resolveColorFunc(value, opt);
    } else {
      rgb = resolveColorValue(value, opt);
    }
    if (rgb === null) {
      return rgb;
    }
    [, r, g, b, alpha] = rgb;
  } else if (value.startsWith(FN_COLOR)) {
    const [, val] = value.match(REG_FN_COLOR);
    const [cs] = val.replace("/", " ").split(/\s+/);
    if (cs === "srgb") {
      [, r, g, b, alpha] = resolveColorFunc(value, {
        format: VAL_COMP
      });
      r *= MAX_RGB;
      g *= MAX_RGB;
      b *= MAX_RGB;
    } else {
      [, r, g, b, alpha] = resolveColorFunc(value);
    }
  } else if (/^(?:ok)?l(?:ab|ch)/.test(value)) {
    [r, g, b, alpha] = convertColorToLinearRgb(value);
    [r, g, b] = convertLinearRgbToRgb([r, g, b]);
  } else {
    [, r, g, b, alpha] = resolveColorValue(value, {
      format: VAL_COMP
    });
  }
  return [r, g, b, alpha];
};
const convertColorToXyz = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { d50, format } = opt;
  let x, y, z, alpha;
  if (format === VAL_MIX) {
    let xyz;
    if (value.startsWith(FN_COLOR)) {
      xyz = parseColorFunc(value, opt);
    } else {
      xyz = parseColorValue(value, opt);
    }
    if (xyz === null) {
      return xyz;
    }
    [, x, y, z, alpha] = xyz;
  } else if (value.startsWith(FN_COLOR)) {
    const [, val] = value.match(REG_FN_COLOR);
    const [cs] = val.replace("/", " ").split(/\s+/);
    if (d50) {
      if (cs === "xyz-d50") {
        [, x, y, z, alpha] = resolveColorFunc(value, {
          format: VAL_COMP
        });
      } else {
        [, x, y, z, alpha] = parseColorFunc(value, opt);
      }
    } else if (/^xyz(?:-d65)?$/.test(cs)) {
      [, x, y, z, alpha] = resolveColorFunc(value, {
        format: VAL_COMP
      });
    } else {
      [, x, y, z, alpha] = parseColorFunc(value);
    }
  } else {
    [, x, y, z, alpha] = parseColorValue(value, opt);
  }
  return [x, y, z, alpha];
};
const convertColorToHsl = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { format } = opt;
  let h, s, l, alpha, x, y, z;
  if (REG_HSL.test(value)) {
    [, h, s, l, alpha] = parseHsl(value, {
      format: "hsl"
    });
    if (format === "hsl") {
      return [
        Math.round(h),
        Math.round(s),
        Math.round(l),
        alpha
      ];
    }
    return [h, s, l, alpha];
  }
  if (format === VAL_MIX) {
    let xyz;
    if (value.startsWith(FN_COLOR)) {
      xyz = parseColorFunc(value, opt);
    } else {
      xyz = parseColorValue(value, opt);
    }
    if (xyz === null) {
      return xyz;
    }
    [, x, y, z, alpha] = xyz;
  } else if (value.startsWith(FN_COLOR)) {
    [, x, y, z, alpha] = parseColorFunc(value);
  } else {
    [, x, y, z, alpha] = parseColorValue(value);
  }
  [h, s, l] = convertXyzToHsl([x, y, z], true);
  if (format === "hsl") {
    return [Math.round(h), Math.round(s), Math.round(l), alpha];
  }
  return [h, s, l, alpha];
};
const convertColorToHwb = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { format } = opt;
  let h, w, b, alpha, x, y, z;
  if (REG_HWB.test(value)) {
    [, h, w, b, alpha] = parseHwb(value, {
      format: "hwb"
    });
    if (format === "hwb") {
      return [Math.round(h), Math.round(w), Math.round(b), alpha];
    }
    return [h, w, b, alpha];
  }
  if (format === VAL_MIX) {
    let xyz;
    if (value.startsWith(FN_COLOR)) {
      xyz = parseColorFunc(value, opt);
    } else {
      xyz = parseColorValue(value, opt);
    }
    if (xyz === null) {
      return xyz;
    }
    [, x, y, z, alpha] = xyz;
  } else if (value.startsWith(FN_COLOR)) {
    [, x, y, z, alpha] = parseColorFunc(value);
  } else {
    [, x, y, z, alpha] = parseColorValue(value);
  }
  [h, w, b] = convertXyzToHwb([x, y, z], true);
  if (format === "hwb") {
    return [Math.round(h), Math.round(w), Math.round(b), alpha];
  }
  return [h, w, b, alpha];
};
const convertColorToLab = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { format } = opt;
  let l, a, b, alpha, x, y, z;
  if (REG_LAB.test(value)) {
    [, l, a, b, alpha] = parseLab(value, {
      format: VAL_COMP
    });
    return [l, a, b, alpha];
  }
  if (format === VAL_MIX) {
    let xyz;
    opt.d50 = true;
    if (value.startsWith(FN_COLOR)) {
      xyz = parseColorFunc(value, opt);
    } else {
      xyz = parseColorValue(value, opt);
    }
    if (xyz === null) {
      return xyz;
    }
    [, x, y, z, alpha] = xyz;
  } else if (value.startsWith(FN_COLOR)) {
    [, x, y, z, alpha] = parseColorFunc(value, {
      d50: true
    });
  } else {
    [, x, y, z, alpha] = parseColorValue(value, {
      d50: true
    });
  }
  [l, a, b] = convertXyzD50ToLab([x, y, z], true);
  return [l, a, b, alpha];
};
const convertColorToLch = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { format } = opt;
  let l, c, h, alpha, x, y, z;
  if (REG_LCH.test(value)) {
    [, l, c, h, alpha] = parseLch(value, {
      format: VAL_COMP
    });
    return [l, c, h, alpha];
  }
  if (format === VAL_MIX) {
    let xyz;
    opt.d50 = true;
    if (value.startsWith(FN_COLOR)) {
      xyz = parseColorFunc(value, opt);
    } else {
      xyz = parseColorValue(value, opt);
    }
    if (xyz === null) {
      return xyz;
    }
    [, x, y, z, alpha] = xyz;
  } else if (value.startsWith(FN_COLOR)) {
    [, x, y, z, alpha] = parseColorFunc(value, {
      d50: true
    });
  } else {
    [, x, y, z, alpha] = parseColorValue(value, {
      d50: true
    });
  }
  [l, c, h] = convertXyzD50ToLch([x, y, z], true);
  return [l, c, h, alpha];
};
const convertColorToOklab = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { format } = opt;
  let l, a, b, alpha, x, y, z;
  if (REG_OKLAB.test(value)) {
    [, l, a, b, alpha] = parseOklab(value, {
      format: VAL_COMP
    });
    return [l, a, b, alpha];
  }
  if (format === VAL_MIX) {
    let xyz;
    if (value.startsWith(FN_COLOR)) {
      xyz = parseColorFunc(value, opt);
    } else {
      xyz = parseColorValue(value, opt);
    }
    if (xyz === null) {
      return xyz;
    }
    [, x, y, z, alpha] = xyz;
  } else if (value.startsWith(FN_COLOR)) {
    [, x, y, z, alpha] = parseColorFunc(value);
  } else {
    [, x, y, z, alpha] = parseColorValue(value);
  }
  [l, a, b] = convertXyzToOklab([x, y, z], true);
  return [l, a, b, alpha];
};
const convertColorToOklch = (value, opt = {}) => {
  if (isString(value)) {
    value = value.trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { format } = opt;
  let l, c, h, alpha, x, y, z;
  if (REG_OKLCH.test(value)) {
    [, l, c, h, alpha] = parseOklch(value, {
      format: VAL_COMP
    });
    return [l, c, h, alpha];
  }
  if (format === VAL_MIX) {
    let xyz;
    if (value.startsWith(FN_COLOR)) {
      xyz = parseColorFunc(value, opt);
    } else {
      xyz = parseColorValue(value, opt);
    }
    if (xyz === null) {
      return xyz;
    }
    [, x, y, z, alpha] = xyz;
  } else if (value.startsWith(FN_COLOR)) {
    [, x, y, z, alpha] = parseColorFunc(value);
  } else {
    [, x, y, z, alpha] = parseColorValue(value);
  }
  [l, c, h] = convertXyzToOklch([x, y, z], true);
  return [l, c, h, alpha];
};
const resolveColorMix = (value, opt = {}) => {
  if (isString(value)) {
    value = value.toLowerCase().trim();
  } else {
    throw new TypeError(`${value} is not a string.`);
  }
  const { format } = opt;
  const nestedItems = [];
  if (!REG_MIX.test(value)) {
    if (value.startsWith(FN_MIX) && REG_MIX_NEST.test(value)) {
      const regColorSpace = new RegExp(`^(?:${CS_RGB}|${CS_XYZ})$`);
      const items = value.match(REG_MIX_NEST);
      for (const item of items) {
        let val = resolveColorMix(item, {
          format: format === VAL_SPEC ? format : VAL_COMP
        });
        if (Array.isArray(val)) {
          const [v1, v2, v3, v4, v5] = val;
          if (v2 === 0 && v3 === 0 && v4 === 0 && v5 === 0) {
            value = "";
            break;
          }
          if (regColorSpace.test(v1)) {
            if (v5 === 1) {
              val = `color(${v1} ${v2} ${v3} ${v4})`;
            } else {
              val = `color(${v1} ${v2} ${v3} ${v4} / ${v5})`;
            }
          } else if (v5 === 1) {
            val = `${v1}(${v2} ${v3} ${v4})`;
          } else {
            val = `${v1}(${v2} ${v3} ${v4} / ${v5})`;
          }
        } else if (!REG_MIX.test(val)) {
          value = "";
          break;
        }
        nestedItems.push(val);
        value = value.replace(item, val);
      }
      if (!value) {
        if (format === VAL_SPEC) {
          return "";
        }
        return ["rgb", 0, 0, 0, 0];
      }
    } else if (format === VAL_SPEC) {
      return "";
    } else {
      return ["rgb", 0, 0, 0, 0];
    }
  }
  let colorSpace, hueArc, colorA, pctA, colorB, pctB;
  if (nestedItems.length && format === VAL_SPEC) {
    const regColorSpace = new RegExp(`^color-mix\\(\\s*in\\s+(${CS_MIX})\\s*,`);
    const [, cs] = value.match(regColorSpace);
    if (REG_CS_HUE.test(cs)) {
      [, colorSpace, hueArc] = cs.match(REG_CS_HUE);
    } else {
      colorSpace = cs;
    }
    if (nestedItems.length === 2) {
      const itemA = nestedItems[0].replace(/(?=[()])/g, "\\");
      const regA = new RegExp(`(${itemA})(?:\\s+(${PCT}))?`);
      [, colorA, pctA] = value.match(regA);
      const itemB = nestedItems[1].replace(/(?=[()])/g, "\\");
      const regB = new RegExp(`(${itemB})(?:\\s+(${PCT}))?`);
      [, colorB, pctB] = value.match(regB);
    } else {
      const colorPart = `(?:${SYN_COLOR_TYPE})(?:\\s+${PCT})?`;
      const item = nestedItems[0].replace(/(?=[()])/g, "\\");
      const itemPart = `${item}(?:\\s+${PCT})?`;
      const itemPartCapt = `(${item})(?:\\s+(${PCT}))?`;
      const regColorPart = new RegExp(`^(${SYN_COLOR_TYPE})(?:\\s+(${PCT}))?$`);
      const regItemPart = new RegExp(`^${itemPartCapt}$`);
      const regPosition = new RegExp(`${itemPartCapt}\\s*\\)$`);
      if (regPosition.test(value)) {
        const reg = new RegExp(`(${colorPart})\\s*,\\s*(${itemPart})\\s*\\)$`);
        const [, colorPartA, colorPartB] = value.match(reg);
        [, colorA, pctA] = colorPartA.match(regColorPart);
        [, colorB, pctB] = colorPartB.match(regItemPart);
      } else {
        const reg = new RegExp(`(${itemPart})\\s*,\\s*(${colorPart})\\s*\\)$`);
        const [, colorPartA, colorPartB] = value.match(reg);
        [, colorA, pctA] = colorPartA.match(regItemPart);
        [, colorB, pctB] = colorPartB.match(regColorPart);
      }
    }
  } else {
    const [, cs, colorPartA, colorPartB] = value.match(REG_MIX_CAPT);
    const reg = new RegExp(`^(${SYN_COLOR_TYPE})(?:\\s+(${PCT}))?$`);
    [, colorA, pctA] = colorPartA.match(reg);
    [, colorB, pctB] = colorPartB.match(reg);
    if (REG_CS_HUE.test(cs)) {
      [, colorSpace, hueArc] = REG_CS_HUE.exec(cs);
    } else {
      colorSpace = cs;
    }
  }
  let pA, pB, m;
  if (pctA && pctB) {
    const p1 = parseFloat(pctA) / MAX_PCT;
    const p2 = parseFloat(pctB) / MAX_PCT;
    if (p1 < 0 || p1 > 1 || p2 < 0 || p2 > 1) {
      if (format === VAL_SPEC) {
        return "";
      }
      return ["rgb", 0, 0, 0, 0];
    }
    const factor = p1 + p2;
    if (factor === 0) {
      if (format === VAL_SPEC) {
        return "";
      }
      return ["rgb", 0, 0, 0, 0];
    }
    pA = p1 / factor;
    pB = p2 / factor;
    m = factor < 1 ? factor : 1;
  } else {
    if (pctA) {
      pA = parseFloat(pctA) / MAX_PCT;
      if (pA < 0 || pA > 1) {
        if (format === VAL_SPEC) {
          return "";
        }
        return ["rgb", 0, 0, 0, 0];
      }
      pB = 1 - pA;
    } else if (pctB) {
      pB = parseFloat(pctB) / MAX_PCT;
      if (pB < 0 || pB > 1) {
        if (format === VAL_SPEC) {
          return "";
        }
        return ["rgb", 0, 0, 0, 0];
      }
      pA = 1 - pB;
    } else {
      pA = HALF;
      pB = HALF;
    }
    m = 1;
  }
  if (colorSpace === "xyz") {
    colorSpace = "xyz-d65";
  }
  if (format === VAL_SPEC) {
    let valueA, valueB;
    if (colorA.startsWith(FN_MIX)) {
      valueA = colorA;
    } else if (colorA.startsWith(FN_COLOR)) {
      valueA = parseColorFunc(colorA, opt);
      if (Array.isArray(valueA)) {
        const [v1, v2, v3, v4, v5] = [...valueA];
        if (v5 === 1) {
          valueA = `color(${v1} ${v2} ${v3} ${v4})`;
        } else {
          valueA = `color(${v1} ${v2} ${v3} ${v4} / ${v5})`;
        }
      }
    } else {
      valueA = parseColorValue(colorA, opt);
      if (valueA === "") {
        return valueA;
      }
      if (Array.isArray(valueA)) {
        const [v1, v2, v3, v4, v5] = [...valueA];
        if (v5 === 1) {
          if (v1 === "rgb") {
            valueA = `${v1}(${v2}, ${v3}, ${v4})`;
          } else {
            valueA = `${v1}(${v2} ${v3} ${v4})`;
          }
        } else if (v1 === "rgb") {
          valueA = `${v1}a(${v2}, ${v3}, ${v4}, ${v5})`;
        } else {
          valueA = `${v1}(${v2} ${v3} ${v4} / ${v5})`;
        }
      }
    }
    if (colorB.startsWith(FN_MIX)) {
      valueB = colorB;
    } else if (colorB.startsWith(FN_COLOR)) {
      valueB = parseColorFunc(colorB, opt);
      if (Array.isArray(valueB)) {
        const [v1, v2, v3, v4, v5] = [...valueB];
        if (v5 === 1) {
          valueB = `color(${v1} ${v2} ${v3} ${v4})`;
        } else {
          valueB = `color(${v1} ${v2} ${v3} ${v4} / ${v5})`;
        }
      }
    } else {
      valueB = parseColorValue(colorB, opt);
      if (valueB === "") {
        return valueB;
      }
      if (Array.isArray(valueB)) {
        const [v1, v2, v3, v4, v5] = [...valueB];
        if (v5 === 1) {
          if (v1 === "rgb") {
            valueB = `${v1}(${v2}, ${v3}, ${v4})`;
          } else {
            valueB = `${v1}(${v2} ${v3} ${v4})`;
          }
        } else if (v1 === "rgb") {
          valueB = `${v1}a(${v2}, ${v3}, ${v4}, ${v5})`;
        } else {
          valueB = `${v1}(${v2} ${v3} ${v4} / ${v5})`;
        }
      }
    }
    if (pctA && pctB) {
      valueA += ` ${parseFloat(pctA)}%`;
      valueB += ` ${parseFloat(pctB)}%`;
    } else if (pctA) {
      const pA2 = parseFloat(pctA);
      if (pA2 !== MAX_PCT * HALF) {
        valueA += ` ${pA2}%`;
      }
    } else if (pctB) {
      const pA2 = MAX_PCT - parseFloat(pctB);
      if (pA2 !== MAX_PCT * HALF) {
        valueA += ` ${pA2}%`;
      }
    }
    if (hueArc) {
      return `color-mix(in ${colorSpace} ${hueArc} hue, ${valueA}, ${valueB})`;
    } else {
      return `color-mix(in ${colorSpace}, ${valueA}, ${valueB})`;
    }
  }
  let r, g, b, alpha;
  if (/^srgb(?:-linear)?$/.test(colorSpace)) {
    let rgbA, rgbB;
    if (colorSpace === "srgb") {
      if (REG_CURRENT.test(colorA)) {
        rgbA = [NONE, NONE, NONE, NONE];
      } else {
        rgbA = convertColorToRgb(colorA, {
          colorSpace,
          format: VAL_MIX
        });
      }
      if (REG_CURRENT.test(colorB)) {
        rgbB = [NONE, NONE, NONE, NONE];
      } else {
        rgbB = convertColorToRgb(colorB, {
          colorSpace,
          format: VAL_MIX
        });
      }
    } else {
      if (REG_CURRENT.test(colorA)) {
        rgbA = [NONE, NONE, NONE, NONE];
      } else {
        rgbA = convertColorToLinearRgb(colorA, {
          colorSpace,
          format: VAL_MIX
        });
      }
      if (REG_CURRENT.test(colorB)) {
        rgbB = [NONE, NONE, NONE, NONE];
      } else {
        rgbB = convertColorToLinearRgb(colorB, {
          colorSpace,
          format: VAL_MIX
        });
      }
    }
    if (rgbA === null || rgbB === null) {
      return ["rgb", 0, 0, 0, 0];
    }
    let [rA, gA, bA, alphaA] = rgbA;
    let [rB, gB, bB, alphaB] = rgbB;
    const rNone = rA === NONE && rB === NONE;
    const gNone = gA === NONE && gB === NONE;
    const bNone = bA === NONE && bB === NONE;
    const alphaNone = alphaA === NONE && alphaB === NONE;
    [[rA, gA, bA, alphaA], [rB, gB, bB, alphaB]] = normalizeColorComponents(
      [rA, gA, bA, alphaA],
      [rB, gB, bB, alphaB],
      true
    );
    const factorA = alphaA * pA;
    const factorB = alphaB * pB;
    alpha = factorA + factorB;
    if (alpha === 0) {
      r = rA * pA + rB * pB;
      g = gA * pA + gB * pB;
      b = bA * pA + bB * pB;
    } else {
      r = (rA * factorA + rB * factorB) / alpha;
      g = (gA * factorA + gB * factorB) / alpha;
      b = (bA * factorA + bB * factorB) / alpha;
      alpha = parseFloat(alpha.toFixed(3));
    }
    if (format === VAL_COMP) {
      return [
        colorSpace,
        rNone ? NONE : roundToPrecision(r, HEX),
        gNone ? NONE : roundToPrecision(g, HEX),
        bNone ? NONE : roundToPrecision(b, HEX),
        alphaNone ? NONE : alpha * m
      ];
    }
    r *= MAX_RGB;
    g *= MAX_RGB;
    b *= MAX_RGB;
  } else if (REG_CS_XYZ.test(colorSpace)) {
    let xyzA, xyzB;
    if (REG_CURRENT.test(colorA)) {
      xyzA = [NONE, NONE, NONE, NONE];
    } else {
      xyzA = convertColorToXyz(colorA, {
        colorSpace,
        d50: colorSpace === "xyz-d50",
        format: VAL_MIX
      });
    }
    if (REG_CURRENT.test(colorB)) {
      xyzB = [NONE, NONE, NONE, NONE];
    } else {
      xyzB = convertColorToXyz(colorB, {
        colorSpace,
        d50: colorSpace === "xyz-d50",
        format: VAL_MIX
      });
    }
    if (xyzA === null || xyzB === null) {
      return ["rgb", 0, 0, 0, 0];
    }
    let [xA, yA, zA, alphaA] = xyzA;
    let [xB, yB, zB, alphaB] = xyzB;
    const xNone = xA === NONE && xB === NONE;
    const yNone = yA === NONE && yB === NONE;
    const zNone = zA === NONE && zB === NONE;
    const alphaNone = alphaA === NONE && alphaB === NONE;
    [[xA, yA, zA, alphaA], [xB, yB, zB, alphaB]] = normalizeColorComponents(
      [xA, yA, zA, alphaA],
      [xB, yB, zB, alphaB],
      true
    );
    const factorA = alphaA * pA;
    const factorB = alphaB * pB;
    alpha = factorA + factorB;
    let x, y, z;
    if (alpha === 0) {
      x = xA * pA + xB * pB;
      y = yA * pA + yB * pB;
      z = zA * pA + zB * pB;
    } else {
      x = (xA * factorA + xB * factorB) / alpha;
      y = (yA * factorA + yB * factorB) / alpha;
      z = (zA * factorA + zB * factorB) / alpha;
      alpha = parseFloat(alpha.toFixed(3));
    }
    if (format === VAL_COMP) {
      return [
        colorSpace,
        xNone ? NONE : roundToPrecision(x, HEX),
        yNone ? NONE : roundToPrecision(y, HEX),
        zNone ? NONE : roundToPrecision(z, HEX),
        alphaNone ? NONE : alpha * m
      ];
    }
    if (colorSpace === "xyz-d50") {
      [r, g, b] = convertXyzD50ToRgb([x, y, z], true);
    } else {
      [r, g, b] = convertXyzToRgb([x, y, z], true);
    }
  } else if (/^h(?:sl|wb)$/.test(colorSpace)) {
    let hslA, hslB;
    if (colorSpace === "hsl") {
      if (REG_CURRENT.test(colorA)) {
        hslA = [NONE, NONE, NONE, NONE];
      } else {
        hslA = convertColorToHsl(colorA, {
          colorSpace,
          format: VAL_MIX
        });
      }
      if (REG_CURRENT.test(colorB)) {
        hslB = [NONE, NONE, NONE, NONE];
      } else {
        hslB = convertColorToHsl(colorB, {
          colorSpace,
          format: VAL_MIX
        });
      }
    } else {
      if (REG_CURRENT.test(colorA)) {
        hslA = [NONE, NONE, NONE, NONE];
      } else {
        hslA = convertColorToHwb(colorA, {
          colorSpace,
          format: VAL_MIX
        });
      }
      if (REG_CURRENT.test(colorB)) {
        hslB = [NONE, NONE, NONE, NONE];
      } else {
        hslB = convertColorToHwb(colorB, {
          colorSpace,
          format: VAL_MIX
        });
      }
    }
    if (hslA === null || hslB === null) {
      return ["rgb", 0, 0, 0, 0];
    }
    let [hA, sA, lA, alphaA] = hslA;
    let [hB, sB, lB, alphaB] = hslB;
    const alphaNone = alphaA === NONE && alphaB === NONE;
    [[hA, sA, lA, alphaA], [hB, sB, lB, alphaB]] = normalizeColorComponents(
      [hA, sA, lA, alphaA],
      [hB, sB, lB, alphaB],
      true
    );
    if (hueArc) {
      [hA, hB] = interpolateHue(hA, hB, hueArc);
    }
    const factorA = alphaA * pA;
    const factorB = alphaB * pB;
    alpha = factorA + factorB;
    const h = (hA * pA + hB * pB) % DEG;
    let s, l;
    if (alpha === 0) {
      s = sA * pA + sB * pB;
      l = lA * pA + lB * pB;
    } else {
      s = (sA * factorA + sB * factorB) / alpha;
      l = (lA * factorA + lB * factorB) / alpha;
      alpha = parseFloat(alpha.toFixed(3));
    }
    [r, g, b] = convertColorToRgb(`${colorSpace}(${h} ${s} ${l})`);
    if (format === VAL_COMP) {
      return [
        "srgb",
        roundToPrecision(r / MAX_RGB, HEX),
        roundToPrecision(g / MAX_RGB, HEX),
        roundToPrecision(b / MAX_RGB, HEX),
        alphaNone ? NONE : alpha * m
      ];
    }
  } else if (/^(?:ok)?lab$/.test(colorSpace)) {
    let labA, labB;
    if (colorSpace === "lab") {
      if (REG_CURRENT.test(colorA)) {
        labA = [NONE, NONE, NONE, NONE];
      } else {
        labA = convertColorToLab(colorA, {
          colorSpace,
          format: VAL_MIX
        });
      }
      if (REG_CURRENT.test(colorB)) {
        labB = [NONE, NONE, NONE, NONE];
      } else {
        labB = convertColorToLab(colorB, {
          colorSpace,
          format: VAL_MIX
        });
      }
    } else {
      if (REG_CURRENT.test(colorA)) {
        labA = [NONE, NONE, NONE, NONE];
      } else {
        labA = convertColorToOklab(colorA, {
          colorSpace,
          format: VAL_MIX
        });
      }
      if (REG_CURRENT.test(colorB)) {
        labB = [NONE, NONE, NONE, NONE];
      } else {
        labB = convertColorToOklab(colorB, {
          colorSpace,
          format: VAL_MIX
        });
      }
    }
    if (labA === null || labB === null) {
      return ["rgb", 0, 0, 0, 0];
    }
    let [lA, aA, bA, alphaA] = labA;
    let [lB, aB, bB, alphaB] = labB;
    const lNone = lA === NONE && lB === NONE;
    const aNone = aA === NONE && aB === NONE;
    const bNone = bA === NONE && bB === NONE;
    const alphaNone = alphaA === NONE && alphaB === NONE;
    [[lA, aA, bA, alphaA], [lB, aB, bB, alphaB]] = normalizeColorComponents(
      [lA, aA, bA, alphaA],
      [lB, aB, bB, alphaB],
      true
    );
    const factorA = alphaA * pA;
    const factorB = alphaB * pB;
    alpha = factorA + factorB;
    let l, aO, bO;
    if (alpha === 0) {
      l = lA * pA + lB * pB;
      aO = aA * pA + aB * pB;
      bO = bA * pA + bB * pB;
    } else {
      l = (lA * factorA + lB * factorB) / alpha;
      aO = (aA * factorA + aB * factorB) / alpha;
      bO = (bA * factorA + bB * factorB) / alpha;
      alpha = parseFloat(alpha.toFixed(3));
    }
    if (format === VAL_COMP) {
      return [
        colorSpace,
        lNone ? NONE : roundToPrecision(l, HEX),
        aNone ? NONE : roundToPrecision(aO, HEX),
        bNone ? NONE : roundToPrecision(bO, HEX),
        alphaNone ? NONE : alpha * m
      ];
    }
    [, r, g, b] = resolveColorValue(`${colorSpace}(${l} ${aO} ${bO})`);
  } else if (/^(?:ok)?lch$/.test(colorSpace)) {
    let lchA, lchB;
    if (colorSpace === "lch") {
      if (REG_CURRENT.test(colorA)) {
        lchA = [NONE, NONE, NONE, NONE];
      } else {
        lchA = convertColorToLch(colorA, {
          colorSpace,
          format: VAL_MIX
        });
      }
      if (REG_CURRENT.test(colorB)) {
        lchB = [NONE, NONE, NONE, NONE];
      } else {
        lchB = convertColorToLch(colorB, {
          colorSpace,
          format: VAL_MIX
        });
      }
    } else {
      if (REG_CURRENT.test(colorA)) {
        lchA = [NONE, NONE, NONE, NONE];
      } else {
        lchA = convertColorToOklch(colorA, {
          colorSpace,
          format: VAL_MIX
        });
      }
      if (REG_CURRENT.test(colorB)) {
        lchB = [NONE, NONE, NONE, NONE];
      } else {
        lchB = convertColorToOklch(colorB, {
          colorSpace,
          format: VAL_MIX
        });
      }
    }
    if (lchA === null || lchB === null) {
      return ["rgb", 0, 0, 0, 0];
    }
    let [lA, cA, hA, alphaA] = lchA;
    let [lB, cB, hB, alphaB] = lchB;
    const lNone = lA === NONE && lB === NONE;
    const cNone = cA === NONE && cB === NONE;
    const hNone = hA === NONE && hB === NONE;
    const alphaNone = alphaA === NONE && alphaB === NONE;
    [[lA, cA, hA, alphaA], [lB, cB, hB, alphaB]] = normalizeColorComponents(
      [lA, cA, hA, alphaA],
      [lB, cB, hB, alphaB],
      true
    );
    if (hueArc) {
      [hA, hB] = interpolateHue(hA, hB, hueArc);
    }
    const factorA = alphaA * pA;
    const factorB = alphaB * pB;
    alpha = factorA + factorB;
    const h = (hA * pA + hB * pB) % DEG;
    let l, c;
    if (alpha === 0) {
      l = lA * pA + lB * pB;
      c = cA * pA + cB * pB;
    } else {
      l = (lA * factorA + lB * factorB) / alpha;
      c = (cA * factorA + cB * factorB) / alpha;
      alpha = parseFloat(alpha.toFixed(3));
    }
    if (format === VAL_COMP) {
      return [
        colorSpace,
        lNone ? NONE : roundToPrecision(l, HEX),
        cNone ? NONE : roundToPrecision(c, HEX),
        hNone ? NONE : roundToPrecision(h, HEX),
        alphaNone ? NONE : alpha * m
      ];
    }
    [, r, g, b] = resolveColorValue(`${colorSpace}(${l} ${c} ${h})`);
  }
  return [
    "rgb",
    Math.round(r),
    Math.round(g),
    Math.round(b),
    parseFloat((alpha * m).toFixed(3))
  ];
};
export {
  NAMED_COLORS,
  angleToDeg,
  convertColorToHsl,
  convertColorToHwb,
  convertColorToLab,
  convertColorToLch,
  convertColorToLinearRgb,
  convertColorToOklab,
  convertColorToOklch,
  convertColorToRgb,
  convertColorToXyz,
  convertHexToLinearRgb,
  convertHexToRgb,
  convertHexToXyz,
  convertLinearRgbToRgb,
  convertRgbToHex,
  convertRgbToLinearRgb,
  convertRgbToXyz,
  convertXyzD50ToLab,
  convertXyzD50ToLch,
  convertXyzD50ToRgb,
  convertXyzToHsl,
  convertXyzToHwb,
  convertXyzToOklab,
  convertXyzToOklch,
  convertXyzToRgb,
  normalizeColorComponents,
  numberToHexString,
  parseAlpha,
  parseColorFunc,
  parseColorValue,
  parseHexAlpha,
  parseHsl,
  parseHwb,
  parseLab,
  parseLch,
  parseOklab,
  parseOklch,
  parseRgb,
  resolveColorFunc,
  resolveColorMix,
  resolveColorValue,
  transformMatrix,
  validateColorComponents
};
//# sourceMappingURL=color.js.map
