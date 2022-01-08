<template>
  <p class="transition-colors duration-300 dark:text-white">
    <br>
    Frekvenčni spekter energijskih signalov računamo s pomočjo Fourier Transforma:
    <br><br>
    <img
      src="/assets/images/spekter_1.png"
      class="filter dark:invert"
      alt="Spekter enačba"
    >
    <br><br>
    Spekter signala pri frekvenci <span class="font-semibold">f</span> je pravzaprav korelacija tega signala s kompleksnim harmoničnim signalom e^(-j*Pi*f*t).
    Spekter <span class="font-semibold">X(f)</span> nam torej pove, koliko sta si ta dva signala podobna.
    <br>
    Amplitudni spekter <span class="font-semibold">A(f)</span> signala <span class="font-semibold">X(f)</span> enak absolutni vrednosti njegovega kompleksnega spektra <span class="font-semibold">X(f)</span>:
    <br><br>
    <img
      src="/assets/images/spekter_2.png"
      class="filter dark:invert"
      alt="Spekter enačba"
    >
    <br><br>Čas <span class="font-semibold">t</span> množimo z realno konstanto <span class="font-semibold">a</span>. Če je <span class="font-semibold">a &lt; 1 </span> se signal raztegne, če pa je <span class="font-semibold">a>1</span>, se signal skrči po časovni osi. Za spekter takega signala velja:
    <br><br>
    <img
      src="/assets/images/spekter_3.png"
      class="filter dark:invert"
      alt="Spekter enačba"
    >
    <br><br>
    Ker se v spektru frekvenca <span class="font-semibold">f</span> deli s konstanto <span class="font-semibold">a</span>, pomeni skrčenje v časovnem prostoru, razteg v frekvenčnem prostoru in obratno. Iz tega sledi, da imajo dolgi impulzi ozek spekter, kratki impulzi pa širok spekter.
  </p>
</template>

<script>
export default {
    name: "TheorySpectrum"
}
</script>