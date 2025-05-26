/**
 * util.js
 */
/**
 * is color
 * @param {string} value - value
 * @returns {boolean} - result
 */
export declare const isColor: (value: string) => boolean;
/**
 * value to JSON string
 * @param {*} value - value
 * @param {boolean} func - stringify function
 * @returns {string} - stringified value in JSON notation
 */
export declare const valueToJsonString: (value: any, func?: boolean) => string;
/**
 * round to specified precision
 * @param {number} value - value
 * @param {number} bit - minimum bits
 * @returns {number} - rounded value
 */
export declare const roundToPrecision: (value: number, bit?: number) => number;
/**
 * interpolate hue
 * @param {number} hueA - hue
 * @param {number} hueB - hue
 * @param {string} arc - arc
 * @returns {Array} - [hueA, hueB]
 */
export declare const interpolateHue: (hueA: number, hueB: number, arc?: string) => Array<number>;
