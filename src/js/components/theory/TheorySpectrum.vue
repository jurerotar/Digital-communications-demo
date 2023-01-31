<template>
  <AppParagraph>
    Frekvenčni spekter energijskih signalov izračunamo s pomočjo Fourierjeve transformacije:
    <span
      ref="fourierTransformRef"
      class="katex-block"
    />
    Spekter signala pri frekvenci <span class="font-semibold">f</span> je pravzaprav korelacija tega signala s kompleksnim harmoničnim
    signalom
    <span
      ref="complexHarmonicSignalRef"
      class="katex-inline"
    />.
    Spekter <span class="font-semibold">X(f)</span> nam torej pove, koliko sta si ta dva signala podobna.
    <br>
    Amplitudni spekter <span class="font-semibold">A(f)</span> signala <span class="font-semibold">X(f)</span> enak absolutni vrednosti
    njegovega kompleksnega spektra <span class="font-semibold">X(f)</span>:
    <span
      ref="amplitudeSpectrumRef"
      class="katex-block"
    />
    Čas <span class="font-semibold">t</span> množimo z realno konstanto <span class="font-semibold">a</span>. Če je
    <span class="font-semibold">a &lt; 1 </span> se signal raztegne, če pa je <span class="font-semibold">a>1</span>, se signal skrči po
    časovni osi. Za spekter takega signala velja:
    <span
      ref="signalToSpectrumRef"
      class="katex-block"
    />
    Ker se v spektru frekvenca <span class="font-semibold">f</span> deli s konstanto <span class="font-semibold">a</span>, pomeni skrčenje v
    časovnem prostoru, razteg v frekvenčnem prostoru in obratno. Iz tega sledi, da imajo dolgi impulzi ozek spekter, kratki impulzi pa širok
    spekter.
  </AppParagraph>
</template>

<script
  setup
  lang="ts"
>
import {ref, watchEffect} from "vue";
import {fourierTransform, amplitudeSpectrum, signalToSpectrum, complexHarmonicSignal} from "@/js/helpers/equations";
import AppParagraph from "@/js/components/common/AppParagraph.vue";

const complexHarmonicSignalRef = ref<HTMLSpanElement>();
const fourierTransformRef = ref<HTMLSpanElement>();
const amplitudeSpectrumRef = ref<HTMLSpanElement>();
const signalToSpectrumRef = ref<HTMLSpanElement>();

watchEffect(() => {
  if (complexHarmonicSignalRef.value) {
    window.katex.render(complexHarmonicSignal, complexHarmonicSignalRef.value!);
  }
  if (fourierTransformRef.value) {
    window.katex.render(fourierTransform, fourierTransformRef.value!);
  }
  if (amplitudeSpectrumRef.value) {
    window.katex.render(amplitudeSpectrum, amplitudeSpectrumRef.value!);
  }
  if (signalToSpectrumRef.value) {
    window.katex.render(signalToSpectrum, signalToSpectrumRef.value!);
  }
});
</script>