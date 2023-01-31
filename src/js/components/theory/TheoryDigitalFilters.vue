<template>
  <div class="flex flex-col gap-4">
    <AppParagraph>
      Digitalen filter je sistem, katerega lastnosti določajo osnovne matematične operacije in funkcije.
      V praksi srečujemo dve osnovni implementaciji digitalnega filtra: filter s končnim odzivom (FIR) in filter z neskončnim
      odzivom (IIR). Da bi razumeli delovanje in lastnosti teh filtrov, je potrebno razumeti z-transform.
    </AppParagraph>

    <AppSectionHeading>
      Z-transform
    </AppSectionHeading>
    <AppParagraph>
      Z-transform je analiza, ki nam omogoča določiti frekvenčni spekter časovno diskretnih signalov.
      Dvostranski spekter časovno diskretnega signala določa sledeča neskončna vrsta:
      <KatexEquation>
        {{ zTransform }}
      </KatexEquation>
      Ker digitalni filtri spadajo med linearne časovno invariabilne (LTI) sisteme vemo,
      da frekvenčna transformacija impulznega odziva <span class="font-semibold">h(t)</span> danega sistema ustreza ravno prenosni funkciji
      danega sistema.
      Predpostavimo sedaj, da je digitalni filter pravzaprav rekurziven časovno diskreten LTI sistem.
      Potem lahko zapišemo diferenčno enačbo <span class="font-semibold">y(nT)</span> opazovanega sistema:
      <KatexEquation>
        {{ differenceEq }}
      </KatexEquation>
      kjer nabor koeficientov <span class="font-semibold">a<sub>k</sub></span> in <span class="font-semibold">b<sub>k</sub></span>
      predstavlja lastnosti, katere neposredno vplivajo na lastnosti prenosne funkcije digitalnega filtra.
      Diferenčna enačba <span class="font-semibold">y(nT)</span>, ki določa izhodni signal filtra v časovnem prostoru, je enaka impulznemu
      odzivu
      filtra <span class="font-semibold">h(nT)</span> v primeru, ko filter vzbujamo z Kronecker-delta impulzom.
      Tako nam z-transformacija diferenčne enačbe <span class="font-semibold">y(nT)</span>
      da prenosno funkcijo <span class="font-semibold">H(z)</span>
      danega digitalnega filtra:
      <KatexEquation>
        {{ digitalFiltersTransferFunction }}
      </KatexEquation>
    </AppParagraph>

    <AppSectionHeading>
      Bločni diagram
    </AppSectionHeading>
    <AppParagraph>
      Splošni bločni diagram zajema tako rekurziven (IIR) kot nerekurziven (FIR) sistem. Razlika je v tem, da so
      <span class="font-semibold">a<sub>k</sub></span> koeficienti
      pri slednjemu enaki nič (razen <span class="font-semibold">a<sub>0</sub> = 1</span>), kar pomeni, da je trenutni izhod
      <span class="font-semibold">y(nT)</span> odvisen le od trenutnega in preteklih vzorcev
      vhodnega časovno diskretnega signala. Medtem ko je IIR odvisen tudi od preteklih vzorcev na izhodu. Posledično je FIR filter
      vedno stabilen in ima krajši čas ustaljevanja kot IIR, le-ta pa ni nujno stabilen.

      <img
        class="my-2"
        src="/images/theory/digital-filters/IIR_block.jpg"
        alt="IIR blok"
      >
    </AppParagraph>

    <AppSectionHeading>
      Finite Impulse Response (FIR)
    </AppSectionHeading>
    <AppParagraph>
      Preprost FIR filter je filter, ki enakomerno povpreči <span class="font-semibold">N</span> število preteklih vzorcev.
      Drugače rečeno, gre za povprečenje, kjer so uteži posameznih vzorcev določene z pravokotno okensko funkcijo.
      Če vrednosti uteži določimo s katerokoli drugo okensko funkcijo, se temu primerno spremeni prenosna funkcija filtra.
      Z različnimi okenskimi funkcijami dosegamo želen prehod iz prepustnega v zaporni pas ter višino konic v zapornem pasu.
      Koeficiente <span class="font-semibold">b<sub>k</sub></span> določamo na sledeč način, kjer
      <span class="font-semibold">w<sub>k</sub></span>
      predstavlja vrednosti diskretne okenske funkcije:
      <KatexEquation>
        {{ windowWeights }}
      </KatexEquation>
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
    </AppParagraph>
  </div>
</template>

<script
  setup
  lang="ts"
>
import {zTransform, differenceEq, digitalFiltersTransferFunction, windowWeights} from "@/js/helpers/equations";
import AppParagraph from "@/js/components/common/AppParagraph.vue";
import AppSectionHeading from "@/js/components/common/AppSectionHeading.vue";
import KatexEquation from "@/js/components/common/KatexEquation.vue";
</script>