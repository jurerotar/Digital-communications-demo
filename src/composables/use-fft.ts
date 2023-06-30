import {MaybeRef, ref, toValue, watchEffect} from "vue";
import FFT from "fft.js";

export const useFft = (signalRef: MaybeRef<number[]>) => {
  const transformedSignal = ref<number[]>([]);

  watchEffect(() => {
    const signal = toValue<number[]>(signalRef);
    console.log(signalRef);
    const signalSize = signal.length;
    const fft: FFT = new FFT(signalSize);
    const out: number[] = fft.createComplexArray();
    fft.realTransform(out, signal);
    transformedSignal.value = out.filter((_, index: number) => index % 2 === 0).map((el: number) => Math.abs(el));
  });

  return {
    transformedSignal
  }
}