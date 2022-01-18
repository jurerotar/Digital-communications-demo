export const complexHarmonicSignal = 'e^{-j \\pi f t}';
export const fourierTransform = `X(f) = \\int_{-\\infty}^{\\infty}{x(t)${complexHarmonicSignal}dt}`;
export const amplitudeSpectrum = 'A_{x}(f) = |X(f)|';
export const signalToSpectrum = 'x(at) \\Leftrightarrow \\frac{1}{|a|}X(\\frac{f}{a})';
// ISI:
export const transferFunction = 'h(t)=sinc(2πf_mm(t-t0))';
export const inputSignal = 'y_{odd}(t)=\\sum_{n=-\\infty}^{\\infty}y[n]δ(t-nT_s)';
export const yhConv = 'y_{spr}=y_{odd}(t)*h(t)';
export const h1Nyquist = 'h(nT_s)=\\begin{cases}A & n=0 \\newline 0 & n \\neq 0\\end{cases}';
export const h2Nyquist = 'h(t)*v_δ(t)=Aδ(t)';
export const h3Nyquist = '\\sum_{k=-\\infty}^{\\infty} H(f+kf_s)=AT_s';




