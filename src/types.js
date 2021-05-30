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
 * @property {boolean} is_binary
 * @property {Frequency} frequencies
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
 * @property {boolean} hasCarrier
 * @property {boolean} hasSineModulation
 * @property {boolean} hasBipolar
 * @property {boolean} hasUnipolar
 * @property {boolean} hasPam4
 */