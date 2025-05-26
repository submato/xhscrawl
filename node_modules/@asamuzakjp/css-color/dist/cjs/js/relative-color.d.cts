import { LRUCache } from 'lru-cache';
import { CSSToken } from '@csstools/css-tokenizer';
export declare const cachedResults: LRUCache<{}, {}, unknown>;
/**
 * resolve relative color channels
 * @param {Array.<Array>} tokens - tokens
 * @param {object} [opt] - options
 * @param {string} [opt.colorSpace] - color space
 * @returns {?Array.<string>} - resolved channels
 */
export declare function resolveColorChannels(tokens: Array<CSSToken>, opt?: {
    colorSpace?: string;
    currentColor?: string;
    dimension?: object;
    format?: string;
}): Array<string> | null;
/**
 * extract origin color
 * @param {string} value - color value
 * @param {object} [opt] - options
 * @param {string} [opt.currentColor] - current color value
 * @returns {?string} - value
 */
export declare function extractOriginColor(value: string, opt?: {
    colorSpace?: string;
    currentColor?: string;
    dimension?: object;
    format?: string;
}): string | null;
/**
 * resolve relative color
 * @param {string} value - relative color value
 * @param {object} [opt] - options
 * @param {string} [opt.format] - output format
 * @returns {?string} - value
 */
export declare function resolveRelativeColor(value: string, opt?: {
    colorSpace?: string;
    currentColor?: string;
    dimension?: object;
    format?: string;
}): string | null;
