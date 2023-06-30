export interface Coordinates {
  x: number;
  y: number;
}

export type Color = string;

export interface CanvasOptions {
  frameRate?: number;
}

export type Scheme = 'dark' | 'light';

/**
 * @typedef {Class} P5
 * @method setup
 * @function frameRate
 * @function createCanvas
 */
