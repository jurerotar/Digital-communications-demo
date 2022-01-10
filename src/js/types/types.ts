import {Range} from "@/js/helpers/types/tail-recursion-elimination";

export interface Coordinates {
  x: number;
  y: number;
}

export type Color = string | Range<0, 255>;

export interface CanvasOptions {
  frameRate?: number;
}

export type Scheme = 'dark' | 'light';

/**
 * @typedef {Object} Text
 * @property {string} text
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {Object} Pulse
 * @property {string} label
 * @property {string} key
 * @property {function} drawingValues
 * @property {function} spectrumValues
 * @property {PulseLength[]} pulseLengths
 * @property {number[]} horizontal_pool
 * @property {SignalTexts} spectrumGraphTexts
 * @property {SignalTexts} logarithmGraphTexts
 */

/**
 * @typedef {Object} SignalTexts
 * @property {string} description
 * @property {string} note
 */


/**
 * @typedef {Object} PulseLength
 * @property {string} label
 * @property {number} key
 */

/**
 * @typedef {Object} BinarySignal
 * @property {number[]} values
 * @property {number[]} pool
 * @property {number} currentlyReturns
 */

/**
 * @typedef {Object} Modulation
 * @property {string} label
 * @property {string} key
 * @property {string} description
 * @property {string} note
 * @property {boolean} hasCarrier
 * @property {boolean} hasSineModulation
 * @property {boolean} hasBinaryLevel1
 * @property {boolean} hasBinaryLevel2
 * @property {boolean} hasBinaryLevel4
 */

/**
 * @typedef {Object} LogarithmicModifiers
 * @property {number} offset
 * @property {number} amplitude
 */

/**
 * @typedef {Class} P5
 * @method setup
 * @function frameRate
 * @function createCanvas
 */
