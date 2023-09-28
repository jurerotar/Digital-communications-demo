export interface Coordinates {
  x: number;
  y: number;
}

export type Color = string;

export interface Size {
  width: number;
  height: number;
}

export type Mark = {
  text: string;
} & Coordinates;

export type Scheme = 'dark' | 'light';

/**
 * @deprecated
 */
export interface CanvasOptions {
  frameRate?: number;
}

/**
 * @deprecated
 * @typedef {Class} P5
 * @method setup
 * @function frameRate
 * @function createCanvas
 */
