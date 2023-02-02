export type FilterType = 'FIR' | 'IIR';

export type WindowFunc = "lanczos" | "rectangular" | "triangular" | "bartlett" |
                        "bartlettHann" | "welch" | "hann" |
                        "hamming" | "blackman" | "nuttall" |
                        "blackmanHarris" | "blackmanNuttall" | "exactBlackman" |
                        "flatTop" | "cosine" | "gaussian" | "tukey";

export type IIR_type = "lowpass" | "highpass" | "bandpass" | "notch" | 
                      "one-pole-lp" | "one-pole-hp" | "peak" | 
                      "low-shelf" | "high-shelf";


export type FiltFunc = {
  label: string;
  key: WindowFunc;
}

export type FiltType = {
  label: string;
  key: FilterType;
}

export type IIR_Types = {
  label: string;
  key: IIR_type;
}

export type FIRFilter =
  | "lanczos"
  | "rectangular"
  | "triangular"
  | "bartlett"
  | "bartlettHann"
  | "welch"
  | "hann"
  | "hamming"
  | "blackman"
  | "nuttall"
  | "blackmanHarris"
  | "blackmanNuttall"
  | "exactBlackman"
  | "flatTop"
  | "cosine"
  | "gaussian"
  | "tukey";

export type IIRFilter =
  | "lowpass"
  | "highpass"
  | "bandpass"
  | "notch"
  | "one-pole-lp"
  | "one-pole-hp"
  | "peak"
  | "low-shelf" | "high-shelf";