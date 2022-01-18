export const complexHarmonicSignal = 'e^{-j \\pi f t}';
export const fourierTransform = `X(f) = \\int_{-\\infty}^{\\infty}{x(t)${complexHarmonicSignal}dt}`;
export const amplitudeSpectrum = 'A_{x}(f) = |X(f)|';
export const signalToSpectrum = 'x(at) \\Leftrightarrow \\frac{1}{|a|}X(\\frac{f}{a})';
export const correlation = 'R_{xy}=\\overline{x(t)y(t)}={1\\over T}\\int_Tx(t)y(t)dt';
export const correlationFunction = 'R_{xy}(τ)=\\overline{x(t)y(t + τ)}={1\\over T}\\int_Tx(t)y(t + τ)dt';
