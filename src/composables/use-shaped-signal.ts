import {PulseShape} from "@interfaces/spectrum";
import {MaybeRef, Ref, ref, toValue, watchEffect} from "vue";
import {unitBox} from "@helpers/math";

type PulseGenerators = Record<
  PulseShape,
  Record<'baseSignalGenerator' | 'spectrumSignalGenerator', (frequency: number, baseSignalValue: number) => number>
>;

type UseSpectrumValuesReturn = {
  shapedSignal: Ref<number[]>;
  shapedSpectrumSignal: Ref<number[]>;
};

// Returns an array with only $size values around the middle
const takeMiddleValues = (values: number[]): number[] => {
  const size = 600;
  return values.filter((_, index: number) => (index >= (values.length / 2 - size / 2) && index <= (values.length / 2 + size / 2)));
}

// We create 2 sets of signal values, to hide chart drawing inaccuracies
const pulseGenerators: PulseGenerators = {
  cos: {
    baseSignalGenerator: (frequency, baseSignalValue: number) => {
      return (-Math.cos(Math.PI * baseSignalValue * frequency * 0.01) - 1) * unitBox(baseSignalValue * frequency * 0.01 / 2, [-0.5, 0.5]);
    },
    spectrumSignalGenerator: (frequency, baseSignalValue: number) => {
      return (-Math.cos(Math.PI * baseSignalValue * frequency * 0.05) - 1) * unitBox(baseSignalValue * frequency * 0.05 / 2, [-0.5, 0.5]);
    }
  },
  square: {
    baseSignalGenerator: (frequency, baseSignalValue: number) => {
      return -unitBox(baseSignalValue * frequency * 0.01, [-0.5, 0.5]);
    },
    spectrumSignalGenerator: (frequency, baseSignalValue: number) => {
      return -unitBox(baseSignalValue * frequency * 0.05, [-0.5, 0.5]);
    }
  },
  gauss: {
    baseSignalGenerator: (frequency, baseSignalValue: number) => {
      return Math.E ** (-2 * (baseSignalValue * 0.0165 * frequency) ** 2) * -unitBox(baseSignalValue * frequency * 0.0005, [-0.5, 0.5]);
    },
    spectrumSignalGenerator: (frequency, baseSignalValue: number) => {
      return Math.E ** (-2 * (baseSignalValue * 0.028 * frequency) ** 2) * -unitBox(baseSignalValue * frequency * 0.0005, [-0.5, 0.5]);
    }
  },
  sinc: {
    baseSignalGenerator: (frequency, baseSignalValue: number) => {
      return baseSignalValue === 0 ? -1 : -Math.sin(baseSignalValue * frequency * 0.062) / (baseSignalValue * frequency * 0.062) * unitBox(baseSignalValue * frequency * 0.0033, [-0.5, 0.5]);
    },
    spectrumSignalGenerator: (frequency, baseSignalValue: number) => {
      return baseSignalValue === 0 ? -1 : -Math.sin(baseSignalValue * frequency * 0.152) / (baseSignalValue * frequency * 0.152) * unitBox(baseSignalValue * frequency * 0.008, [-0.5, 0.5]);
    }
  },
}

const calculateSignals = (
  pulseShape: PulseShape,
  frequency: number,
  signalSize: number = 2048
) => {
  const arrayOfHalfSignalSize = [...Array(signalSize / 2).keys()];
  const baseSignalValues: number[] = [...arrayOfHalfSignalSize.map(el => el * -1 - 1).reverse(), ...arrayOfHalfSignalSize];
  const {baseSignalGenerator, spectrumSignalGenerator} = pulseGenerators[pulseShape];
  const shapedSignal = takeMiddleValues(baseSignalValues.map((t: number) => baseSignalGenerator(frequency, t)));
  const shapedSpectrumSignal = baseSignalValues.map((t: number) => spectrumSignalGenerator(frequency, t));
  return {
    shapedSignal,
    shapedSpectrumSignal
  }
}

export const useShapedSignal = (
  pulseShape: MaybeRef<PulseShape>,
  frequency: MaybeRef<number>,
  signalSize: MaybeRef<number> = ref(2048)
): UseSpectrumValuesReturn => {
  const shapedSignal = ref<number[]>([]);
  const shapedSpectrumSignal = ref<number[]>([]);

  watchEffect(() => {
    const [shape, freq, size] = [toValue(pulseShape), toValue(frequency), toValue(signalSize)];
    const {
      shapedSignal: calculatedShapedSignal,
      shapedSpectrumSignal: calculatedShapedSpectrumSignal
    } = calculateSignals(shape, freq, size);
    shapedSignal.value = calculatedShapedSignal;
    shapedSpectrumSignal.value = calculatedShapedSpectrumSignal;
  });

  return {
    shapedSignal,
    shapedSpectrumSignal
  }
}