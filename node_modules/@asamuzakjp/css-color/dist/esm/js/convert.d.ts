import { LRUCache } from 'lru-cache';
export declare const cachedResults: LRUCache<{}, {}, unknown>;
/**
 * pre process
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @param {object} [opt.dimension] - dimension
 * @returns {?string} - value
 */
export declare const preProcess: (value: string, opt?: {
    customProperty?: object;
    dimension?: object;
    format?: string;
}) => string | null;
/**
 * convert number to hex string
 * @param {number} value - color value
 * @returns {string} - hex string: 00..ff
 */
export declare const numberToHex: (value: number) => string;
/**
 * convert color to hex
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {boolean} [opt.alpha] - return in #rrggbbaa notation
 * @param {object} [opt.customProperty] - custom properties
 * @param {object} [opt.dimension] - dimension
 * @returns {?string} - #rrggbb | #rrggbbaa | null
 */
export declare const colorToHex: (value: string, opt?: {
    alpha?: boolean;
    customProperty?: object;
    dimension?: object;
    format?: string;
}) => string | null;
/**
 * convert color to hsl
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @param {object} [opt.dimension] - dimension
 * @returns {Array.<number>} - [h, s, l, alpha]
 */
export declare const colorToHsl: (value: string, opt?: {
    customProperty?: object;
    dimension?: object;
    format?: string;
}) => Array<number>;
/**
 * convert color to hwb
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @param {object} [opt.dimension] - dimension
 * @returns {Array.<number>} - [h, w, b, alpha]
 */
export declare const colorToHwb: (value: string, opt?: {
    customProperty?: object;
    dimension?: object;
    format?: string;
}) => Array<number>;
/**
 * convert color to lab
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @param {object} [opt.dimension] - dimension
 * @returns {Array.<number>} - [l, a, b, alpha]
 */
export declare const colorToLab: (value: string, opt?: {
    customProperty?: object;
    dimension?: object;
    format?: string;
}) => Array<number>;
/**
 * convert color to lch
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @param {object} [opt.dimension] - dimension
 * @returns {Array.<number>} - [l, c, h, alpha]
 */
export declare const colorToLch: (value: string, opt?: {
    customProperty?: object;
    dimension?: object;
    format?: string;
}) => Array<number>;
/**
 * convert color to oklab
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @param {object} [opt.dimension] - dimension
 * @returns {Array.<number>} - [l, a, b, alpha]
 */
export declare const colorToOklab: (value: string, opt?: {
    customProperty?: object;
    dimension?: object;
    format?: string;
}) => Array<number>;
/**
 * convert color to oklch
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @param {object} [opt.dimension] - dimension
 * @returns {Array.<number>} - [l, c, h, alpha]
 */
export declare const colorToOklch: (value: string, opt?: {
    customProperty?: object;
    dimension?: object;
    format?: string;
}) => Array<number>;
/**
 * convert color to rgb
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @param {object} [opt.dimension] - dimension
 * @returns {Array.<number>} - [r, g, b, alpha]
 */
export declare const colorToRgb: (value: string, opt?: {
    customProperty?: object;
    dimension?: object;
    format?: string;
}) => Array<number>;
/**
 * convert color to xyz
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @param {object} [opt.d50] - white poin in d50
 * @param {object} [opt.dimension] - dimension
 * @returns {Array.<number>} - [x, y, z, alpha]
 */
export declare const colorToXyz: (value: string, opt?: {
    customProperty?: object;
    d50?: boolean;
    dimension?: object;
    format?: string;
}) => Array<number>;
/**
 * convert color to xyz-d50
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @param {object} [opt.dimension] - dimension
 * @returns {Array.<number>} - [x, y, z, alpha]
 */
export declare const colorToXyzD50: (value: string, opt?: {
    customProperty?: object;
    d50?: boolean;
    dimension?: object;
    format?: string;
}) => Array<number>;
export declare const convert: {
    colorToHex: (value: string, opt?: {
        alpha?: boolean;
        customProperty?: object;
        dimension?: object;
        format?: string;
    }) => string | null;
    colorToHsl: (value: string, opt?: {
        customProperty?: object;
        dimension?: object;
        format?: string;
    }) => Array<number>;
    colorToHwb: (value: string, opt?: {
        customProperty?: object;
        dimension?: object;
        format?: string;
    }) => Array<number>;
    colorToLab: (value: string, opt?: {
        customProperty?: object;
        dimension?: object;
        format?: string;
    }) => Array<number>;
    colorToLch: (value: string, opt?: {
        customProperty?: object;
        dimension?: object;
        format?: string;
    }) => Array<number>;
    colorToOklab: (value: string, opt?: {
        customProperty?: object;
        dimension?: object;
        format?: string;
    }) => Array<number>;
    colorToOklch: (value: string, opt?: {
        customProperty?: object;
        dimension?: object;
        format?: string;
    }) => Array<number>;
    colorToRgb: (value: string, opt?: {
        customProperty?: object;
        dimension?: object;
        format?: string;
    }) => Array<number>;
    colorToXyz: (value: string, opt?: {
        customProperty?: object;
        d50?: boolean;
        dimension?: object;
        format?: string;
    }) => Array<number>;
    colorToXyzD50: (value: string, opt?: {
        customProperty?: object;
        d50?: boolean;
        dimension?: object;
        format?: string;
    }) => Array<number>;
    numberToHex: (value: number) => string;
};
