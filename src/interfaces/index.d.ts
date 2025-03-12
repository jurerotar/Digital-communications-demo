declare module 'window-function' {
  export function bartlett(signalValue: number, filterOrder: number): number;
  export function bartlettHann(signalValue: number, filterOrder: number): number;
  export function blackman(signalValue: number, filterOrder: number): number;
  export function blackmanHarris(signalValue: number, filterOrder: number): number;
  export function blackmanNuttall(signalValue: number, filterOrder: number): number;
  export function cosine(signalValue: number, filterOrder: number): number;
  export function exactBlackman(signalValue: number, filterOrder: number): number;
  export function flatTop(signalValue: number, filterOrder: number): number;
  export function hamming(signalValue: number, filterOrder: number): number;
  export function hann(signalValue: number, filterOrder: number): number;
  export function lanczos(signalValue: number, filterOrder: number): number;
  export function nuttall(signalValue: number, filterOrder: number): number;
  export function rectangular(signalValue: number, filterOrder: number): number;
  export function triangular(signalValue: number, filterOrder: number): number;
  export function welch(signalValue: number, filterOrder: number): number;
  export function bartlett(signalValue: number, filterOrder: number): number;
}
