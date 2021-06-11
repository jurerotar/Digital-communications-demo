/**
 * @typedef Route
 * @param {string} path
 * @param {string} name
 * @param {string} label
 * @param {Object} component
 */

/**
 * @typedef {Object} Coordinates
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {Object} Text
 * @property {string} text
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {Object} Signal
 * @property {string} label
 * @property {string} key
 * @property {function} fn
 * @property {Frequency} frequencies
 * @property {number[]} horizontal_pool
 */

/**
 * @typedef {Object} Frequency
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
 * @property {boolean} frequencyOffsets
 */

/**
 * @typedef {Class} P5
 * @method setup
 * @function frameRate
 * @function createCanvas
 */