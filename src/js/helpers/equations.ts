export const complexHarmonicSignal = 'e^{-j \\pi f t}';
export const fourierTransform = `X(f) = \\int_{-\\infty}^{\\infty}{x(t)${complexHarmonicSignal}dt}`;
export const amplitudeSpectrum = 'A_{x}(f) = |X(f)|';
export const signalToSpectrum = 'x(at) \\Leftrightarrow \\frac{1}{|a|}X(\\frac{f}{a})';
