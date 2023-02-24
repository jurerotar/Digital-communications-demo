// Inter-symbol interference :
export const interSymbolInterferenceTransferFunction = 'h(t)=sinc(2πf_mm(t-t0))';
export const inputSignal = 'y_{odd}(t)=\\sum_{n=-\\infty}^{\\infty}y[n]δ(t-nT_s)';
export const yhConv = 'y_{spr}=y_{odd}(t)*h(t)';
export const h1Nyquist = 'h(nT_s)=\\begin{cases}A & n=0 \\newline 0 & n \\neq 0\\end{cases}';
export const h2Nyquist = 'h(t)*v_δ(t)=Aδ(t)';
export const h3Nyquist = '\\sum_{k=-\\infty}^{\\infty} H(f+kf_s)=AT_s';

// Digital filters
export const zTransform = 'X(z)=\\sum_{n=-\\infty}^{\\infty}x(nT)\\cdot z^{-n}';
export const differenceEq = 'y(nT)=\\sum_{k=0}^{N}b_k \\cdot x(nT - kT) - \\sum_{k=1}^{M}a_k \\cdot y(nT - kT)';
export const digitalFiltersTransferFunction = 'H(z) = \\frac{Y(z)}{X(z)} = \\frac{\\sum_{k=0}^{M}a_k ' +
  '\\cdot z^{-k}}{1+\\sum_{k=1}^{N}b_k \\cdot z^{-k}} = \\frac{N(z)}{1+D(z)}';
export const windowWeights = 'b_k = \\frac{w_k}{\\sum_{k=0}^{N}w_k}';
export const lpImpulseResp = 'h_{LP}(nT) = b_k';
export const hpImpulseResp = 'h_{HP}(nT) = h_{LP}(nT) \\cdot (-1)^n';


