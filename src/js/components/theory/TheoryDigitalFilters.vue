<template>
  <div class="flex flex-col gap-4">
    <app-paragraph>
      Digitalen filter je sistem, katerega lastnosti določajo osnovne matematične operacije in funkcije.
      V praksi srečujemo dve osnovni implementaciji digitalnega filtra: filter s končnim odzivom (FIR) in filter z neskončnim
      odzivom (IIR). Da bi razumeli delovanje in lastnosti teh filtrov, je potrebno razumeti z-transform.
    </app-paragraph>

    <app-section-heading>
      Z-transform
    </app-section-heading>
    <app-paragraph>
      Z-transform je analiza, ki nam omogoča določiti frekvenčni spekter časovno diskretnih signalov.
      Dvostranski spekter časovno diskretnega signala določa sledeča neskončna vrsta:
      <span
        ref="zTransformRef"
        class="katex-block"
      />
      Ker digitalni filtri spadajo med linearne časovno invariabilne (LTI) sisteme vemo,
      da frekvenčna transformacija impulznega odziva <span class="font-semibold">h(t)</span> danega sistema ustreza ravno prenosni funkciji danega sistema.
      Predpostavimo sedaj, da je digitalni filter pravzaprav rekurziven časovno diskreten LTI sistem.
      Potem lahko zapišemo diferenčno enačbo <span class="font-semibold">y(nT)</span> opazovanega sistema:
      <span
        ref="differenceEqRef"
        class="katex-block"
      />
      kjer nabor koeficientov <span class="font-semibold">a<sub>k</sub></span> in <span class="font-semibold">b<sub>k</sub></span> 
      predstavlja lastnosti, katere neposredno vplivajo na lastnosti prenosne funkcije digitalnega filtra.
      Diferenčna enačba <span class="font-semibold">y(nT)</span>, ki določa izhodni signal filtra v časovnem prostoru, je enaka impulznemu odzivu
      filtra <span class="font-semibold">h(nT)</span> v primeru, ko filter vzbujamo z Kronecker-delta impulzom.
      Tako nam z-transformacija diferenčne enačbe <span class="font-semibold">y(nT)</span> da prenosno funkcijo <span class="font-semibold">H(z)</span> danega digitalnega filtra:
      <span
        ref="transferFunctRef"
        class="katex-block"
      />
    </app-paragraph>

    <app-section-heading>
      Bločni diagram
    </app-section-heading>
    <app-paragraph>
      Splošni bločni diagram zajema tako rekurziven (IIR) kot nerekurziven (FIR) sistem. Razlika je v tem, da so <span class="font-semibold">a<sub>k</sub></span> koeficienti
      pri slednjemu enaki nič (razen <span class="font-semibold">a<sub>0</sub> = 1</span>), kar pomeni, da je trenutni izhod <span class="font-semibold">y(nT)</span> odvisen le od trenutnega in preteklih vzorcev
      vhodnega časovno diskretnega signala. Medtem ko je IIR odvisen tudi od preteklih vzorcev na izhodu. Posledično je FIR filter
      vedno stabilen in ima krajši čas ustaljevanja kot IIR, le-ta pa ni nujno stabilen.
      
      <div style="width: 75%">
        <img style="margin-bottom:1cm;margin-top:1cm;padding-left:0.1cm;" src="src\js\components\images\IIR_block.jpg"/>
      </div>
    </app-paragraph>

    <app-section-heading>
      Finite Impulse Response (FIR)
    </app-section-heading>
    <app-paragraph>
      Preprost FIR filter je filter, ki enakomerno povpreči <span class="font-semibold">N</span> število preteklih vzorcev.
      Drugače rečeno, gre za povprečenje, kjer so uteži posameznih vzorcev določene z pravokotno okensko funkcijo.
      Če vrednosti uteži določimo s katerokoli drugo okensko funkcijo, se temu primerno spremeni prenosna funkcija filtra.
      Z različnimi okenskimi funkcijami dosegamo želen prehod iz prepustnega v zaporni pas ter višino konic v zapornem pasu.
      Koeficiente <span class="font-semibold">b<sub>k</sub></span> določamo na sledeč način, kjer <span class="font-semibold">w<sub>k</sub></span> predstavlja vrednosti diskretne okenske funkcije:
      <span
        ref="windowWeightsRef"
        class="katex-block"
      />
    </app-paragraph>

    <app-section-heading>
      Infinite Impulse Response (IIR)
    </app-section-heading>
    <app-paragraph>
      IIR filter je nekoliko drugačen, saj določamo <span class="font-semibold">a<sub>k</sub></span> in <span class="font-semibold">b<sub>k</sub></span> koeficiente direktno iz prenosnih funkcij analognih filtrov.
      Zato so prikazani le filtri 2. reda, saj se sistemska funkcija spreminja drastično s povečevanjem reda filtra. Medtem ko se pri FIR
      filtru s povečevanjem reda spreminja sistemska funkcija v linearnem vzorcu.
      Če želimo dosegati bolj strm prehod med prepustnim in zapornim pasom, vežemo več filtrov v kaskado, pri čemer se redi filtrov seštevajo.
    </app-paragraph>
  </div>
</template>

<script
  setup
  lang="ts"
>
import {ref, watchEffect} from "vue";
import {zTransform, differenceEq, transferFunct, windowWeights} from "@/js/helpers/equations";
import AppParagraph from "@/js/components/common/AppParagraph.vue";
import AppSectionHeading from "@/js/components/common/AppSectionHeading.vue";

const zTransformRef = ref<HTMLSpanElement>();
const differenceEqRef = ref<HTMLSpanElement>();
const transferFunctRef = ref<HTMLSpanElement>();
const windowWeightsRef = ref<HTMLSpanElement>();

watchEffect(() => {
  if (zTransformRef.value) {
    window.katex.render(zTransform, zTransformRef.value!);
  }
  if (differenceEqRef.value) {
    window.katex.render(differenceEq, differenceEqRef.value!);
  }
  if (transferFunctRef.value) {
    window.katex.render(transferFunct, transferFunctRef.value!);
  }
  if (windowWeightsRef.value) {
    window.katex.render(windowWeights, windowWeightsRef.value!);
  }
});
</script>