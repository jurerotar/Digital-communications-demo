<template>
  <div class="flex flex-col gap-4">
    <AppParagraph>
      Digitalen filter je sistem, katerega lastnosti določajo osnovne matematične operacije in funkcije.
      V praksi srečujemo dve osnovni implementaciji digitalnega filtra: filter s končnim odzivom (FIR) in filter z neskončnim
      odzivom (IIR). Pri dobremu razumevanju delovanja in lastnosti teh filtrov si pomagamo z z-transformacijo.
    </AppParagraph>

    <AppSectionHeading>
      Z-transform
    </AppSectionHeading>
    <AppParagraph>
      Z-transform je analiza, ki nam omogoča določiti frekvenčni spekter časovno diskretnih signalov.
      Dvostranski spekter časovno diskretnega signala določa sledeča neskončna vrsta:
      <span
        ref="zTransformRef"
        class="katex-block"
      />
      Ker digitalni filtri spadajo med linearne časovno nespremenljive (LTI) sisteme vemo,
      da frekvenčna transformacija impulznega odziva <span class="font-semibold">h(t)</span> danega sistema ustreza ravno prenosni funkciji
      danega sistema.
      Predpostavimo sedaj, da je digitalni filter pravzaprav rekurziven časovno diskreten LTI sistem.
      Potem lahko zapišemo diferenčno enačbo <span class="font-semibold">y(nT)</span> opazovanega sistema:
      <span
        ref="differenceEqRef"
        class="katex-block"
      />
      kjer nabor koeficientov <span class="font-semibold">a<sub>k</sub></span> in <span class="font-semibold">b<sub>k</sub></span>
      predstavlja lastnosti, katere neposredno vplivajo na lastnosti prenosne funkcije digitalnega filtra.
      Diferenčna enačba <span class="font-semibold">y(nT)</span>, ki določa izhodni signal filtra v časovnem prostoru, je enaka impulznemu
      odzivu
      filtra <span class="font-semibold">h(nT)</span> v primeru, ko filter vzbujamo z Kronecker-delta impulzom.
      Tako nam z-transformacija diferenčne enačbe <span class="font-semibold">y(nT)</span>
      da prenosno funkcijo <span class="font-semibold">H(z)</span>
      danega digitalnega filtra:
      <span
        ref="transferFunctRef"
        class="katex-block"
      />
    </AppParagraph>

    <AppSectionHeading>
      Bločni diagram
    </AppSectionHeading>
    <AppParagraph>
      Splošni bločni diagram zajema tako rekurziven kot nerekurziven sistem. Razlika je v tem, da so
      <span class="font-semibold">a<sub>k</sub></span> koeficienti
      pri slednjemu enaki nič (razen <span class="font-semibold">a<sub>0</sub> = 1</span>), kar pomeni, da je trenutni izhod
      <span class="font-semibold">y(nT)</span> odvisen le od trenutnega in preteklih vzorcev
      vhodnega časovno diskretnega signala. Medtem ko je rekurziven sistem odvisen tudi od preteklih vzorcev na izhodu. Posledično je nerekurziven filter
      vedno stabilen in ima krajši čas ustaljevanja kot rekurziven, le-ta pa ni nujno stabilen.

      <div style="width: 75%">
        <img
          style="margin-bottom:1cm;margin-top:1cm;padding-left:0.1cm;"
          src="/images/theory/digital-filters/IIR_block.jpg"
          alt="IIR blok"
        />
      </div>
      <div style="margin-top:-0.5cm">
      (Vir slike: L. Gačnik, Koncepti digitalnih filtrov za merjenje napetosti celic avtomobilskih baterij, diplomsko delo, FE – Fakulteta za elektrotehniko, Ljubljana, 2022)
      </div>
    </AppParagraph>

    <AppSectionHeading>
      Finite Impulse Response (FIR)
    </AppSectionHeading>
    <AppParagraph>
      Preprost filter, ki enakomerno povpreči <span class="font-semibold">N+1</span> število preteklih vzorcev, je eden izmed morebitnih FIR filtrov.
      Drugače rečeno, gre za povprečenje, kjer so uteži posameznih vzorcev določene s pravokotno okensko funkcijo.
      Če vrednosti uteži določimo s katerokoli drugo okensko funkcijo, se temu primerno spremeni prenosna funkcija filtra.
      Z različnimi okenskimi funkcijami dosegamo želen prehod iz prepustnega v zaporni pas ter višino konic v zapornem pasu.
      Koeficiente <span class="font-semibold">b<sub>k</sub></span> določamo na sledeč način, kjer
      <span class="font-semibold">w<sub>k</sub></span>
      predstavlja vrednosti diskretne okenske funkcije:
      <span
        ref="windowWeightsRef"
        class="katex-block"
      />
      Predstavljena oblika FIR filtra izvaja funkcijo nizko-prepustnega filtra. V resnici pa je možno uporabiti FIR filter tudi kot visoko-prepustni, pasovno-prepustni, itd.
      Kot prej omenjeno nam frekvenčna transformacija impulznega odziva <span class="font-semibold">h(nT)</span> določa prenosno funkcijo obravnavanega digitalnega filtra.
      Možno je spremeniti impulzni odziv (pravzaprav uteži FIR filtra in s tem <span class="font-semibold">b<sub>k</sub></span> koeficiente) na takšen način, da iz nizko-prepustnega FIR sita dobimo visoko-prepustnega.
      Torej, če nam dana okenska funkcija določa impulzni odziv nizko-prepustnega FIR sita <span class="font-semibold">h<sub>LP</sub>(nT)</span>,
      potem nam lahko takšen impulzni odziv preoblikujemo s preprostim matematičnim trikom, da dobimo impulzni odziv visoko-prepustnega FIR sita <span class="font-semibold">h<sub>HP</sub>(nT)</span>:
      <span
        ref="hpImpulseRespRef"
        class="katex-block"
      />
      Medtem ko pasovno-prepustni in pasovno-zaporni filter dobimo s kaskado nizko-prepustnega in visoko-prepustnega filtra.
    </AppParagraph>

    <AppSectionHeading>
      Infinite Impulse Response (IIR)
    </AppSectionHeading>
    <AppParagraph>
      IIR filter je nekoliko drugačen, saj določamo <span class="font-semibold">a<sub>k</sub></span> in
      <span class="font-semibold">b<sub>k</sub></span> koeficiente direktno iz prenosnih funkcij analognih filtrov.
      Zato so prikazani le filtri 2. reda, saj se sistemska funkcija spreminja drastično s povečevanjem reda filtra. Medtem ko se pri FIR
      filtru s povečevanjem reda spreminja sistemska funkcija v linearnem vzorcu.
      Če želimo dosegati bolj strm prehod med prepustnim in zapornim pasom, vežemo več filtrov v kaskado, pri čemer se redi filtrov
      seštevajo.
      <br>
      V nadaljevanju je možen prikaz prenosne funkcije kateregakoli izmed osnovnih Biquad filtrov. Ker gre za analogna sita, ki jih IIR filter posnema, najprej določimo sistemsko funkcijo <span class="font-semibold">H(s)</span>.
      Na osnovi vrednosti ničel in polov sistemske funkcije določimo koeficiente <span class="font-semibold">a<sub>k</sub></span> in <span class="font-semibold">b<sub>k</sub></span>.
      Več o sistemskih funkcijah predstavljenih Biquad filtrov si lahko ogledate na <a href="https://wiki.analog.com/resources/tools-software/sigmastudio/toolbox/Filters/GeneralEq2ndorder" style="color:rgb(50 150 246);text-decoration: underline;" target="_blank">tej povezavi.</a>
    </AppParagraph>
  </div>
</template>

<script
  setup
  lang="ts"
>
import {ref, watchEffect} from "vue";
import {zTransform, differenceEq, digitalFiltersTransferFunction, windowWeights, hpImpulseResp} from "@/js/helpers/equations";
import AppParagraph from "@/js/components/common/AppParagraph.vue";
import AppSectionHeading from "@/js/components/common/AppSectionHeading.vue";

const zTransformRef = ref<HTMLSpanElement>();
const differenceEqRef = ref<HTMLSpanElement>();
const transferFunctionRef = ref<HTMLSpanElement>();
const windowWeightsRef = ref<HTMLSpanElement>();
const hpImpulseRespRef = ref<HTMLSpanElement>();

watchEffect(() => {
  if (zTransformRef.value) {
    window.katex.render(zTransform, zTransformRef.value!);
  }
  if (differenceEqRef.value) {
    window.katex.render(differenceEq, differenceEqRef.value!);
  }
  if (transferFunctionRef.value) {
    window.katex.render(digitalFiltersTransferFunction, transferFunctionRef.value!);
  }
  if (windowWeightsRef.value) {
    window.katex.render(windowWeights, windowWeightsRef.value!);
  }
  if (hpImpulseRespRef.value) {
    window.katex.render(hpImpulseResp, hpImpulseRespRef.value!);
  }
});
</script>