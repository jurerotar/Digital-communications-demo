export type FIRFilter =
  | 'lanczos'
  | 'rectangular'
  | 'triangular'
  | 'bartlett'
  | 'bartlettHann'
  | 'welch'
  | 'hann'
  | 'hamming'
  | 'blackman'
  | 'nuttall'
  | 'blackmanHarris'
  | 'blackmanNuttall'
  | 'exactBlackman'
  | 'flatTop'
  | 'cosine'
  | 'gaussian'
  | 'tukey';

export type IIRFilter = 'lowpass' | 'highpass' | 'bandpass' | 'notch' | 'one-pole-lp' | 'one-pole-hp' | 'peak' | 'low-shelf' | 'high-shelf';
