/**
 * color.js
 *
 * Ref: CSS Color Module Level 4
 *      Sample code for Color Conversions
 *      https://w3c.github.io/csswg-drafts/css-color-4/#color-conversion-code
 */
export declare const NAMED_COLORS: {
    readonly aliceblue: readonly [240, 248, 255];
    readonly antiquewhite: readonly [250, 235, 215];
    readonly aqua: readonly [0, 255, 255];
    readonly aquamarine: readonly [127, 255, 212];
    readonly azure: readonly [240, 255, 255];
    readonly beige: readonly [245, 245, 220];
    readonly bisque: readonly [255, 228, 196];
    readonly black: readonly [0, 0, 0];
    readonly blanchedalmond: readonly [255, 235, 205];
    readonly blue: readonly [0, 0, 255];
    readonly blueviolet: readonly [138, 43, 226];
    readonly brown: readonly [165, 42, 42];
    readonly burlywood: readonly [222, 184, 135];
    readonly cadetblue: readonly [95, 158, 160];
    readonly chartreuse: readonly [127, 255, 0];
    readonly chocolate: readonly [210, 105, 30];
    readonly coral: readonly [255, 127, 80];
    readonly cornflowerblue: readonly [100, 149, 237];
    readonly cornsilk: readonly [255, 248, 220];
    readonly crimson: readonly [220, 20, 60];
    readonly cyan: readonly [0, 255, 255];
    readonly darkblue: readonly [0, 0, 139];
    readonly darkcyan: readonly [0, 139, 139];
    readonly darkgoldenrod: readonly [184, 134, 11];
    readonly darkgray: readonly [169, 169, 169];
    readonly darkgreen: readonly [0, 100, 0];
    readonly darkgrey: readonly [169, 169, 169];
    readonly darkkhaki: readonly [189, 183, 107];
    readonly darkmagenta: readonly [139, 0, 139];
    readonly darkolivegreen: readonly [85, 107, 47];
    readonly darkorange: readonly [255, 140, 0];
    readonly darkorchid: readonly [153, 50, 204];
    readonly darkred: readonly [139, 0, 0];
    readonly darksalmon: readonly [233, 150, 122];
    readonly darkseagreen: readonly [143, 188, 143];
    readonly darkslateblue: readonly [72, 61, 139];
    readonly darkslategray: readonly [47, 79, 79];
    readonly darkslategrey: readonly [47, 79, 79];
    readonly darkturquoise: readonly [0, 206, 209];
    readonly darkviolet: readonly [148, 0, 211];
    readonly deeppink: readonly [255, 20, 147];
    readonly deepskyblue: readonly [0, 191, 255];
    readonly dimgray: readonly [105, 105, 105];
    readonly dimgrey: readonly [105, 105, 105];
    readonly dodgerblue: readonly [30, 144, 255];
    readonly firebrick: readonly [178, 34, 34];
    readonly floralwhite: readonly [255, 250, 240];
    readonly forestgreen: readonly [34, 139, 34];
    readonly fuchsia: readonly [255, 0, 255];
    readonly gainsboro: readonly [220, 220, 220];
    readonly ghostwhite: readonly [248, 248, 255];
    readonly gold: readonly [255, 215, 0];
    readonly goldenrod: readonly [218, 165, 32];
    readonly gray: readonly [128, 128, 128];
    readonly green: readonly [0, 128, 0];
    readonly greenyellow: readonly [173, 255, 47];
    readonly grey: readonly [128, 128, 128];
    readonly honeydew: readonly [240, 255, 240];
    readonly hotpink: readonly [255, 105, 180];
    readonly indianred: readonly [205, 92, 92];
    readonly indigo: readonly [75, 0, 130];
    readonly ivory: readonly [255, 255, 240];
    readonly khaki: readonly [240, 230, 140];
    readonly lavender: readonly [230, 230, 250];
    readonly lavenderblush: readonly [255, 240, 245];
    readonly lawngreen: readonly [124, 252, 0];
    readonly lemonchiffon: readonly [255, 250, 205];
    readonly lightblue: readonly [173, 216, 230];
    readonly lightcoral: readonly [240, 128, 128];
    readonly lightcyan: readonly [224, 255, 255];
    readonly lightgoldenrodyellow: readonly [250, 250, 210];
    readonly lightgray: readonly [211, 211, 211];
    readonly lightgreen: readonly [144, 238, 144];
    readonly lightgrey: readonly [211, 211, 211];
    readonly lightpink: readonly [255, 182, 193];
    readonly lightsalmon: readonly [255, 160, 122];
    readonly lightseagreen: readonly [32, 178, 170];
    readonly lightskyblue: readonly [135, 206, 250];
    readonly lightslategray: readonly [119, 136, 153];
    readonly lightslategrey: readonly [119, 136, 153];
    readonly lightsteelblue: readonly [176, 196, 222];
    readonly lightyellow: readonly [255, 255, 224];
    readonly lime: readonly [0, 255, 0];
    readonly limegreen: readonly [50, 205, 50];
    readonly linen: readonly [250, 240, 230];
    readonly magenta: readonly [255, 0, 255];
    readonly maroon: readonly [128, 0, 0];
    readonly mediumaquamarine: readonly [102, 205, 170];
    readonly mediumblue: readonly [0, 0, 205];
    readonly mediumorchid: readonly [186, 85, 211];
    readonly mediumpurple: readonly [147, 112, 219];
    readonly mediumseagreen: readonly [60, 179, 113];
    readonly mediumslateblue: readonly [123, 104, 238];
    readonly mediumspringgreen: readonly [0, 250, 154];
    readonly mediumturquoise: readonly [72, 209, 204];
    readonly mediumvioletred: readonly [199, 21, 133];
    readonly midnightblue: readonly [25, 25, 112];
    readonly mintcream: readonly [245, 255, 250];
    readonly mistyrose: readonly [255, 228, 225];
    readonly moccasin: readonly [255, 228, 181];
    readonly navajowhite: readonly [255, 222, 173];
    readonly navy: readonly [0, 0, 128];
    readonly oldlace: readonly [253, 245, 230];
    readonly olive: readonly [128, 128, 0];
    readonly olivedrab: readonly [107, 142, 35];
    readonly orange: readonly [255, 165, 0];
    readonly orangered: readonly [255, 69, 0];
    readonly orchid: readonly [218, 112, 214];
    readonly palegoldenrod: readonly [238, 232, 170];
    readonly palegreen: readonly [152, 251, 152];
    readonly paleturquoise: readonly [175, 238, 238];
    readonly palevioletred: readonly [219, 112, 147];
    readonly papayawhip: readonly [255, 239, 213];
    readonly peachpuff: readonly [255, 218, 185];
    readonly peru: readonly [205, 133, 63];
    readonly pink: readonly [255, 192, 203];
    readonly plum: readonly [221, 160, 221];
    readonly powderblue: readonly [176, 224, 230];
    readonly purple: readonly [128, 0, 128];
    readonly rebeccapurple: readonly [102, 51, 153];
    readonly red: readonly [255, 0, 0];
    readonly rosybrown: readonly [188, 143, 143];
    readonly royalblue: readonly [65, 105, 225];
    readonly saddlebrown: readonly [139, 69, 19];
    readonly salmon: readonly [250, 128, 114];
    readonly sandybrown: readonly [244, 164, 96];
    readonly seagreen: readonly [46, 139, 87];
    readonly seashell: readonly [255, 245, 238];
    readonly sienna: readonly [160, 82, 45];
    readonly silver: readonly [192, 192, 192];
    readonly skyblue: readonly [135, 206, 235];
    readonly slateblue: readonly [106, 90, 205];
    readonly slategray: readonly [112, 128, 144];
    readonly slategrey: readonly [112, 128, 144];
    readonly snow: readonly [255, 250, 250];
    readonly springgreen: readonly [0, 255, 127];
    readonly steelblue: readonly [70, 130, 180];
    readonly tan: readonly [210, 180, 140];
    readonly teal: readonly [0, 128, 128];
    readonly thistle: readonly [216, 191, 216];
    readonly tomato: readonly [255, 99, 71];
    readonly turquoise: readonly [64, 224, 208];
    readonly violet: readonly [238, 130, 238];
    readonly wheat: readonly [245, 222, 179];
    readonly white: readonly [255, 255, 255];
    readonly whitesmoke: readonly [245, 245, 245];
    readonly yellow: readonly [255, 255, 0];
    readonly yellowgreen: readonly [154, 205, 50];
};
/**
 * validate color components
 * @param {Array} arr - array of color components
 * @param {object} [opt] - options
 * @param {boolean} [opt.alpha] - alpha channel
 * @param {number} [opt.minLength] - min length
 * @param {number} [opt.maxLength] - max length
 * @param {number} [opt.minRange] - min range
 * @param {number} [opt.maxRange] - max range
 * @param {boolean} [opt.validateRange] - validate range
 * @returns {Array} - validated color components
 */
export declare const validateColorComponents: (arr: Array<any>, opt?: {
    alpha?: boolean;
    minLength?: number;
    maxLength?: number;
    minRange?: number;
    maxRange?: number;
    validateRange?: boolean;
}) => Array<any>;
/**
 * transform matrix
 * @param {Array.<Array.<number>>} mtx - 3 * 3 matrix
 * @param {Array.<number>} vct - vector
 * @param {boolean} skip - skip validate
 * @returns {Array.<number>} - [p1, p2, p3]
 */
export declare const transformMatrix: (mtx: Array<Array<number>>, vct: Array<number>, skip?: boolean) => Array<number>;
/**
 * normalize color components
 * @param {Array} colorA - array of color components [v1, v2, v3, v4]
 * @param {Array} colorB - array of color components [v1, v2, v3, v4]
 * @param {boolean} skip - skip validate
 * @returns {Array.<Array.<number>>} - [colorA, colorB]
 */
export declare const normalizeColorComponents: (colorA: Array<any>, colorB: Array<any>, skip?: boolean) => Array<Array<number>>;
/**
 * number to hex string
 * @param {number} value - color value
 * @returns {string} - hex string
 */
export declare const numberToHexString: (value: number) => string;
/**
 * angle to deg
 * @param {string} angle - angle
 * @returns {number} - deg: 0..360
 */
export declare const angleToDeg: (angle: string) => number;
/**
 * parse alpha
 * @param {?string} [_alpha] - alpha value
 * @returns {number} - alpha: 0..1
 */
export declare const parseAlpha: (_alpha?: string | null) => number;
/**
 * parse hex alpha
 * @param {string} value - alpha value in hex string
 * @returns {number} - alpha: 0..1
 */
export declare const parseHexAlpha: (value: string) => number;
/**
 * convert rgb to linear rgb
 * @param {Array.<number>} rgb - [r, g, b] r|g|b: 0..255
 * @param {boolean} skip - skip validate
 * @returns {Array.<number>} - [r, g, b] r|g|b: 0..1
 */
export declare const convertRgbToLinearRgb: (rgb: Array<number>, skip?: boolean) => Array<number>;
/**
 * convert rgb to xyz
 * @param {Array.<number>} rgb - [r, g, b, ?alpha] r|g|b: 0..255 alpha: 0..1
 * @param {boolean} skip - skip validate
 * @returns {Array.<number>} - [x, y, z, alpha]
 */
export declare const convertRgbToXyz: (rgb: Array<number>, skip?: boolean) => Array<number>;
/**
 * convert rgb to xyz-d50
 * @param {Array.<number>} rgb - [r, g, b, ?alpha] r|g|b: 0..255 alpha: 0..1
 * @returns {Array.<number>} - [x, y, z, alpha]
 */
export declare const convertRgbToXyzD50: (rgb: Array<number>) => Array<number>;
/**
 * convert rgb to hex color
 * @param {Array.<number>} rgb - [r, g, b, alpha] r|g|b: 0..255 alpha: 0..1
 * @returns {string} - hex color
 */
export declare const convertRgbToHex: (rgb: Array<number>) => string;
/**
 * convert linear rgb to rgb
 * @param {Array.<number>} rgb - [r, g, b] r|g|b: 0..1
 * @param {boolean} round - round result
 * @returns {Array.<number>} - [r, g, b] r|g|b: 0..255
 */
export declare const convertLinearRgbToRgb: (rgb: Array<number>, round?: boolean) => Array<number>;
/**
 * convert linear rgb to hex color
 * @param {Array.<number>} rgb - [r, g, b, alpha] r|g|b|alpha: 0..1
 * @param {boolean} skip - skip validate
 * @returns {string} - hex color
 */
export declare const convertLinearRgbToHex: (rgb: Array<number>, skip?: boolean) => string;
/**
 * convert xyz to hex color
 * @param {Array.<number>} xyz - [x, y, z, alpha]
 * @returns {string} - hex color
 */
export declare const convertXyzToHex: (xyz: Array<number>) => string;
/**
 * convert xyz D50 to hex color
 * @param {Array.<number>} xyz - [x, y, z, alpha]
 * @returns {string} - hex color
 */
export declare const convertXyzD50ToHex: (xyz: Array<number>) => string;
/**
 * convert xyz to rgb
 * @param {Array.<number>} xyz - [x, y, z, alpha]
 * @param {boolean} skip - skip validate
 * @returns {Array.<number>} - [r, g, b, alpha] r|g|b: 0..255 alpha: 0..1
 */
export declare const convertXyzToRgb: (xyz: Array<number>, skip?: boolean) => Array<number>;
/**
 * convert xyz to xyz-d50
 * @param {Array.<number>} xyz - [x, y, z, alpha]
 * @returns {Array.<number>} - [x, y, z, alpha]
 */
export declare const convertXyzToXyzD50: (xyz: Array<number>) => Array<number>;
/**
 * convert xyz to hsl
 * @param {Array.<number>} xyz - [x, y, z, alpha]
 * @param {boolean} skip - skip validate
 * @returns {Array.<number>} - [h, s, l, alpha]
 */
export declare const convertXyzToHsl: (xyz: Array<number>, skip?: boolean) => Array<number>;
/**
 * convert xyz to hwb
 * @param {Array.<number>} xyz - [x, y, z, alpha]
 * @param {boolean} skip - skip validate
 * @returns {Array.<number>} - [h, w, b, alpha]
 */
export declare const convertXyzToHwb: (xyz: Array<number>, skip?: boolean) => Array<number>;
/**
 * convert xyz to oklab
 * @param {Array.<number>} xyz - [x, y, z, alpha]
 * @param {boolean} skip - skip validate
 * @returns {Array.<number>} - [l, a, b, alpha]
 */
export declare const convertXyzToOklab: (xyz: Array<number>, skip?: boolean) => Array<number>;
/**
 * convert xyz to oklch
 * @param {Array.<number>} xyz - [x, y, z, alpha]
 * @param {boolean} skip - skip validate
 * @returns {Array.<number>} - [l, c, h, alpha]
 */
export declare const convertXyzToOklch: (xyz: Array<number>, skip?: boolean) => Array<number>;
/**
 * convert xyz D50 to rgb
 * @param {Array.<number>} xyz - [x, y, z, alpha]
 * @param {boolean} skip - skip validate
 * @returns {Array.<number>} - [r, g, b, alpha] r|g|b: 0..255 alpha: 0..1
 */
export declare const convertXyzD50ToRgb: (xyz: Array<number>, skip?: boolean) => Array<number>;
/**
 * convert xyz-d50 to lab
 * @param {Array.<number>} xyz - [x, y, z, a]
 * @param {boolean} skip - skip validate
 * @returns {Array.<number>} - [l, a, b, alpha]
 */
export declare const convertXyzD50ToLab: (xyz: Array<number>, skip?: boolean) => Array<number>;
/**
 * convert xyz-d50 to lch
 * @param {Array.<number>} xyz - [x, y, z, alpha]
 * @param {boolean} skip - skip validate
 * @returns {Array.<number>} - [l, c, h, alpha]
 */
export declare const convertXyzD50ToLch: (xyz: Array<number>, skip?: boolean) => Array<number>;
/**
 * convert hex color to rgb
 * @param {string} value - color value
 * @returns {Array.<number>} - [r, g, b, alpha] r|g|b: 0..255 alpha: 0..1
 */
export declare const convertHexToRgb: (value: string) => Array<number>;
/**
 * convert hex color to linear rgb
 * @param {string} value - color value
 * @returns {Array.<number>} - [r, g, b, alpha] r|g|b|alpha: 0..1
 */
export declare const convertHexToLinearRgb: (value: string) => Array<number>;
/**
 * convert hex color to xyz
 * @param {string} value - color value
 * @returns {Array.<number>} - [x, y, z, alpha]
 */
export declare const convertHexToXyz: (value: string) => Array<number>;
/**
 * parse rgb()
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {string} [opt.format] - output format
 * @returns {Array.<string|number>|?string} - ['rgb', r, g, b, alpha], '(empty)'
 */
export declare const parseRgb: (value: string, opt?: {
    format?: string;
}) => Array<number | string> | string | null;
/**
 * parse hsl()
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {string} [opt.format] - output format
 * @returns {Array.<string|number>|?string}
 *   - ['rgb', r, g, b, alpha], '(empty)', null
 */
export declare const parseHsl: (value: string, opt?: {
    format?: string;
}) => Array<number | string> | string | null;
/**
 * parse hwb()
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {string} [opt.format] - output format
 * @returns {Array.<string|number>|?string}
 *   - ['rgb', r, g, b, alpha], '(empty)', null
 */
export declare const parseHwb: (value: string, opt?: {
    format?: string;
}) => Array<number | string> | string | null;
/**
 * parse lab()
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {string} [opt.format] - output format
 * @returns {Array.<string|number>|?string}
 *   - [xyz-d50, x, y, z, alpha], ['lab', l, a, b, alpha], '(empty)', null
 */
export declare const parseLab: (value: string, opt?: {
    format?: string;
}) => Array<number | string> | string | null;
/**
 * parse lch()
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {string} [opt.format] - output format
 * @returns {Array.<string|number>|?string}
 *   - ['xyz-d50', x, y, z, alpha], ['lch', l, c, h, alpha], '(empty)', null
 */
export declare const parseLch: (value: string, opt?: {
    format?: string;
}) => Array<number | string> | string | null;
/**
 * parse oklab()
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {string} [opt.format] - output format
 * @returns {Array.<string|number>|?string}
 *   - ['xyz-d65', x, y, z, alpha], ['oklab', l, a, b, alpha], '(empty)', null
 */
export declare const parseOklab: (value: string, opt?: {
    format?: string;
}) => Array<number | string> | string | null;
/**
 * parse oklch()
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {string} [opt.format] - output format
 * @returns {Array.<string|number>|?string}
 *   - ['xyz-d65', x, y, z, alpha], ['oklch', l, c, h, alpha], '(empty)', null
 */
export declare const parseOklch: (value: string, opt?: {
    format?: string;
}) => Array<number | string> | string | null;
/**
 * parse color()
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {string} [opt.colorSpace] - color space
 * @param {boolean} [opt.d50] - xyz in d50 white point
 * @param {string} [opt.format] - output format
 * @returns {Array.<string|number>|?string}
 *   - ['xyz-(d50|d65)', x, y, z, alpha], [cs, r, g, b, alpha], '(empty)', null
 */
export declare const parseColorFunc: (value: string, opt?: {
    colorSpace?: string;
    d50?: boolean;
    format?: string;
}) => Array<number | string> | string | null;
/**
 * parse color value
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {boolean} [opt.d50] - xyz in d50 white point
 * @param {string} [opt.format] - output format
 * @returns {Array.<string|number>|?string}
 *   - ['xyz-(d50|d65)', x, y, z, alpha], ['rgb', r, g, b, alpha]
 *   - value, '(empty)', null
 */
export declare const parseColorValue: (value: string, opt?: {
    d50?: boolean;
    format?: string;
}) => Array<number | string> | string | null;
/**
 * resolve color value
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {string} [opt.colorSpace] - color space
 * @param {string} [opt.format] - output format
 * @returns {Array.<string|number>|?string}
 *   - [cs, v1, v2, v3, alpha], value, '(empty)', null
 */
export declare const resolveColorValue: (value: string, opt?: {
    colorSpace?: string;
    format?: string;
}) => Array<number | string> | string | null;
/**
 * resolve color()
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {string} [opt.colorSpace] - color space
 * @param {string} [opt.format] - output format
 * @returns {Array.<string|number>|?string}
 *   - [cs, v1, v2, v3, alpha], '(empty)', null
 */
export declare const resolveColorFunc: (value: string, opt?: {
    colorSpace?: string;
    format?: string;
}) => Array<number | string> | string | null;
/**
 * convert color value to linear rgb
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {string} [opt.colorSpace] - color space
 * @param {string} [opt.format] - output format
 * @returns {Array.<number>} - [r, g, b, alpha] r|g|b|alpha: 0..1
 */
export declare const convertColorToLinearRgb: (value: string, opt?: {
    colorSpace?: string;
    format?: string;
}) => Array<number>;
/**
 * convert color value to rgb
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {string} [opt.format] - output format
 * @returns {Array.<number>} - [r, g, b, alpha] r|g|b: 0..255 alpha: 0..1
 */
export declare const convertColorToRgb: (value: string, opt?: {
    colorSpace?: string;
    format?: string;
}) => Array<number>;
/**
 * convert color value to xyz
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {boolean} [opt.d50] - xyz in d50 white point
 * @param {string} [opt.format] - output format
 * @returns {Array.<number>} - [x, y, z, alpha]
 */
export declare const convertColorToXyz: (value: string, opt?: {
    colorSpace?: string;
    d50?: boolean;
    format?: string;
}) => Array<number>;
/**
 * convert color value to hsl
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {string} [opt.format] - output format
 * @returns {Array.<number>} - [h, s, l, alpha]
 */
export declare const convertColorToHsl: (value: string, opt?: {
    colorSpace?: string;
    format?: string;
}) => Array<number>;
/**
 * convert color value to hwb
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {string} [opt.format] - output format
 * @returns {Array.<number>} - [h, w, b, alpha]
 */
export declare const convertColorToHwb: (value: string, opt?: {
    colorSpace?: string;
    format?: string;
}) => Array<number>;
/**
 * convert color value to lab
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {string} [opt.format] - output format
 * @returns {Array.<number>} - [l, a, b, alpha]
 */
export declare const convertColorToLab: (value: string, opt?: {
    colorSpace?: string;
    format?: string;
}) => Array<number>;
/**
 * convert color value to lch
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {string} [opt.format] - output format
 * @returns {Array.<number>} - [l, c, h, alpha]
 */
export declare const convertColorToLch: (value: string, opt?: {
    colorSpace?: string;
    format?: string;
}) => Array<number>;
/**
 * convert color value to oklab
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {string} [opt.format] - output format
 * @returns {Array.<number>} - [l, a, b, alpha]
 */
export declare const convertColorToOklab: (value: string, opt?: {
    colorSpace?: string;
    format?: string;
}) => Array<number>;
/**
 * convert color value to oklch
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {string} [opt.format] - output format
 * @returns {Array.<number>} - [l, c, h, alpha]
 */
export declare const convertColorToOklch: (value: string, opt?: {
    colorSpace?: string;
    format?: string;
}) => Array<number>;
/**
 * resolve color-mix()
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {string} [opt.format] format - output format
 * @returns {Array.<string|number>|?string}
 *   - [cs, v1, v2, v3, alpha], '(empty)', null
 */
export declare const resolveColorMix: (value: string, opt?: {
    format?: string;
}) => Array<number | string> | (string | null);
