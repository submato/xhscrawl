import { LRUCache } from 'lru-cache';
import { CSSToken } from '@csstools/css-tokenizer';
export declare const cachedResults: LRUCache<{}, {}, unknown>;
/**
 * resolve custom property
 * @param {Array.<Array>} tokens - tokens
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @returns {Array.<string|Array|undefined>} - [tokens, resolvedValue]
 */
export declare function resolveCustomProperty(tokens: Array<CSSToken>, opt?: {
    customProperty?: object;
    dimension?: object;
    format?: string;
}): Array<string | Array<CSSToken> | undefined>;
/**
 * parse tokens
 * @param {Array.<Array>} tokens - tokens
 * @param {object} [opt] - options
 * @returns {?Array.<string>} - parsed tokens
 */
export declare function parseTokens(tokens: Array<CSSToken>, opt?: object): Array<string> | null;
/**
 * resolve CSS var()
 * @param {string} value - color value including var()
 * @param {object} [opt] - options
 * @param {object} [opt.customProperty] - custom properties
 * @returns {?string} - value
 */
export declare function cssVar(value: string, opt?: {
    customProperty?: object;
    format?: string;
}): string | null;
