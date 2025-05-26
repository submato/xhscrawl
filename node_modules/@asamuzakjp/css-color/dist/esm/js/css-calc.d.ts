import { LRUCache } from 'lru-cache';
export declare const cachedResults: LRUCache<{}, {}, unknown>;
/**
 * calclator
 */
export declare class Calculator {
    #private;
    /**
     * constructor
     */
    constructor();
    get hasNum(): boolean;
    set hasNum(value: boolean);
    get numSum(): any[];
    get numMul(): any[];
    get hasPct(): boolean;
    set hasPct(value: boolean);
    get pctSum(): any[];
    get pctMul(): any[];
    get hasDim(): boolean;
    set hasDim(value: boolean);
    get dimSum(): any[];
    get dimSub(): any[];
    get dimMul(): any[];
    get dimDiv(): any[];
    get hasEtc(): boolean;
    set hasEtc(value: boolean);
    get etcSum(): any[];
    get etcSub(): any[];
    get etcMul(): any[];
    get etcDiv(): any[];
    /**
     * clear values
     * @returns {void}
     */
    clear(): void;
    /**
     * sort values
     * @param {Array} values - values
     * @returns {Array} - sorted values
     */
    sort(values?: Array<any>): Array<any>;
    /**
     * multiply values
     * @returns {?string} - resolved value
     */
    multiply(): string | null;
    /**
     * sum values
     * @returns {?string} - resolved value
     */
    sum(): string | null;
}
/**
 * sort calc values
 * @param {Array} values - values
 * @param {boolean} finalize - finalize
 * @returns {?string} - sorted value
 */
export declare const sortCalcValues: (values?: string[], finalize?: boolean) => string | null;
/**
 * serialize calc
 * @param {string} value - value
 * @param {object} [opt] - options
 * @param {string} [opt.format] - output format
 * @returns {?string} - resolved value
 */
export declare const serializeCalc: (value: string, opt?: {
    format?: string;
}) => string | null;
/**
 * resolve dimension
 * @param {Array} token - token
 * @param {object} [opt] - options
 * @param {object} [opt.dimension] - dimension
 * @returns {?string} - resolved value
 */
export declare const resolveDimension: (token: Array<any>, opt?: {
    dimension?: object;
}) => string | null;
/**
 * parse tokens
 * @param {Array.<Array>} tokens - tokens
 * @param {object} [opt] - options
 * @returns {Array.<string>} - parsed tokens
 */
export declare const parseTokens: (tokens: Array<Array<any>>, opt?: {
    dimension?: object;
    format?: string;
}) => Array<string>;
/**
 * resolve CSS calc()
 * @param {string} value - color value including calc()
 * @param {object} [opt] - options
 * @param {object} [opt.dimension] - dimension
 * @param {string} [opt.format] - output format
 * @returns {?string} - value
 */
export declare const cssCalc: (value: string, opt?: {
    dimension?: object;
    format?: string;
}) => string | null;
