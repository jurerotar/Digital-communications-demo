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
      <KatexEquation>
        {{ 'X(z)=\\sum_{n=-\\infty}^{\\infty}x(nT) z^{-n}' }}
      </KatexEquation>
      Ker digitalni filtri spadajo med linearne časovno nespremenljive (LTI) sisteme vemo,
      da frekvenčna transformacija impulznega odziva
      <KatexEquation inline>
        {{ 'h(t)' }}
      </KatexEquation>
      danega sistema ustreza ravno prenosni funkciji
      danega sistema.
      Predpostavimo sedaj, da je digitalni filter pravzaprav rekurziven časovno diskreten LTI sistem.
      Potem lahko zapišemo diferenčno enačbo
      <KatexEquation inline>
        {{ 'y(nT)' }}
      </KatexEquation>
      opazovanega sistema:
      <KatexEquation>
        {{ 'y(nT)=\\sum_{k=0}^{N}b_k x(nT - kT) - \\sum_{k=1}^{M}a_k y(nT - kT)' }}
      </KatexEquation>
      kjer nabor koeficientov
      <KatexEquation inline>
        {{ 'a_k' }}
      </KatexEquation>
      in
      <KatexEquation inline>
        {{ 'b_k' }}
      </KatexEquation>
      predstavlja lastnosti, katere neposredno vplivajo na lastnosti prenosne funkcije digitalnega filtra.
      Diferenčna enačba
      <KatexEquation inline>
        {{ 'y(nT)' }}
      </KatexEquation>
      , ki določa izhodni signal filtra v časovnem prostoru, je enaka impulznemu
      odzivu
      filtra
      <KatexEquation inline>
        {{ 'h(nT)' }}
      </KatexEquation>
      v primeru, ko filter vzbujamo z Kronecker-delta impulzom.
      Tako nam z-transformacija diferenčne enačbe
      <KatexEquation inline>
        {{ 'y(nT)' }}
      </KatexEquation>
      da prenosno funkcijo
      <KatexEquation inline>
        {{ 'H(z)' }}
      </KatexEquation>
      danega digitalnega filtra:
      <KatexEquation>
        {{ digitalFiltersTransferFunction }}
      </KatexEquation>
    </AppParagraph>

    <AppSectionHeading>
      Bločni diagram
    </AppSectionHeading>
    <AppParagraph>
      Splošni bločni diagram zajema tako rekurziven kot nerekurziven sistem. Razlika je v tem, da so
      <KatexEquation inline>
        {{ 'a_k' }}
      </KatexEquation>
      koeficienti
      pri slednjemu enaki nič (razen
      <KatexEquation inline>
        {{ 'a_0 = 1' }}
      </KatexEquation>
      ), kar pomeni, da je trenutni izhod
      <KatexEquation inline>
        {{ 'y(nT)' }}
      </KatexEquation>
      odvisen le od trenutnega in preteklih vzorcev
      vhodnega časovno diskretnega signala. Medtem ko je rekurziven sistem odvisen tudi od preteklih vzorcev na izhodu. Posledično je
      nerekurziven filter
      vedno stabilen in ima krajši čas ustaljevanja kot rekurziven, le-ta pa ni nujno stabilen.
    </AppParagraph>

    <div class="flex flex-col gap-2">
      <img
        class="w-1/2"
        src="/images/theory/digital-filters/IIR_block.jpeg"
        alt="IIR blok"
      >
      <AppParagraph>
        (Vir slike: L. Gačnik, Koncepti digitalnih filtrov za merjenje napetosti celic avtomobilskih baterij, diplomsko delo, FE – Fakulteta
        za elektrotehniko, Ljubljana, 2022)
      </AppParagraph>
    </div>

    <AppSectionHeading>
      Finite Impulse Response (FIR)
    </AppSectionHeading>
    <AppParagraph>
      Preprost filter, ki enakomerno povpreči
      <KatexEquation inline>
        {{ 'N+1' }}
      </KatexEquation>
      število preteklih vzorcev, je eden izmed morebitnih FIR
      filtrov.
      Drugače rečeno, gre za povprečenje, kjer so uteži posameznih vzorcev določene s pravokotno okensko funkcijo.
      Če vrednosti uteži določimo s katerokoli drugo okensko funkcijo, se temu primerno spremeni prenosna funkcija filtra.
      Z različnimi okenskimi funkcijami dosegamo želen prehod iz prepustnega v zaporni pas ter višino konic v zapornem pasu.
      Koeficiente
      <KatexEquation inline>
        {{ 'b_k' }}
      </KatexEquation>
      določamo na sledeč način, kjer
      <KatexEquation inline>
        {{ 'w_k' }}
      </KatexEquation>
      predstavlja vrednosti diskretne okenske funkcije:
      <KatexEquation>
        {{ 'b_k = \\frac{w_k}{\\sum_{k=0}^{N}w_k}' }}
      </KatexEquation>
      Predstavljena oblika FIR filtra izvaja funkcijo nizko-prepustnega filtra. V resnici pa je možno uporabiti FIR filter tudi kot
      visoko-prepustni, pasovno-prepustni, itd.
      Kot prej omenjeno nam frekvenčna transformacija impulznega odziva
      <KatexEquation inline>
        {{ 'h(nT)' }}
      </KatexEquation>
      določa prenosno funkcijo obravnavanega digitalnega filtra.
      Možno je spremeniti impulzni odziv (pravzaprav uteži FIR filtra in s tem
      <KatexEquation inline>
        {{ 'b_k' }}
      </KatexEquation>
      koeficiente) na takšen način, da iz nizko-prepustnega FIR sita dobimo visoko-prepustnega.
      Torej, če nam dana okenska funkcija določa impulzni odziv nizko-prepustnega FIR sita
      <KatexEquation inline>
        {{ 'h_{LP}(nT)' }}
      </KatexEquation>
      , potem nam lahko takšen impulzni odziv preoblikujemo s preprostim matematičnim trikom, da dobimo impulzni odziv visoko-prepustnega
      FIR sita
      <KatexEquation inline>
        {{ 'h_{HP}(nT)' }}
      </KatexEquation>
      :
      <KatexEquation>
        {{ 'h_{HP}(nT) = h_{LP}(nT) \\cdot (-1)^n' }}
      </KatexEquation>
      Medtem ko pasovno-prepustni in pasovno-zaporni filter dobimo s kaskado nizko-prepustnega in visoko-prepustnega filtra.
    </AppParagraph>

    <AppSectionHeading>
      Infinite Impulse Response (IIR)
    </AppSectionHeading>
    <AppParagraph>
      IIR filter je nekoliko drugačen, saj določamo
      <KatexEquation inline>
        {{ 'a_k' }}
      </KatexEquation>
      in
      <KatexEquation inline>
        {{ 'b_k' }}
      </KatexEquation>
      koeficiente direktno iz prenosnih funkcij analognih filtrov.
      Zato so prikazani le filtri 2. reda, saj se sistemska funkcija spreminja drastično s povečevanjem reda filtra. Medtem ko se pri FIR
      filtru s povečevanjem reda spreminja sistemska funkcija v linearnem vzorcu.
      Če želimo dosegati bolj strm prehod med prepustnim in zapornim pasom, vežemo več filtrov v kaskado, pri čemer se redi filtrov
      seštevajo.
      <br>
      V nadaljevanju je možen prikaz prenosne funkcije kateregakoli izmed osnovnih Biquad filtrov. Ker gre za analogna sita, ki jih IIR
      filter posnema, najprej določimo sistemsko funkcijo
      <KatexEquation inline>
        {{ 'H(s)' }}
      </KatexEquation>
      .
      Na osnovi vrednosti ničel in polov sistemske funkcije določimo koeficiente
      <KatexEquation inline>
        {{ 'a_k' }}
      </KatexEquation>
      in
      <KatexEquation inline>
        {{ 'b_k' }}
      </KatexEquation>
      Več o sistemskih funkcijah predstavljenih Biquad filtrov si lahko ogledate na
      <a
        href="https://wiki.analog.com/resources/tools-software/sigmastudio/toolbox/Filters/GeneralEq2ndorder"
        style="color:rgb(50 150 246);text-decoration: underline;"
        target="_blank"
      >
        tej povezavi
      </a>.
    </AppParagraph>
  </div>
</template>

<script
  setup
  lang="ts"
>
import AppParagraph from "@/js/components/common/AppParagraph.vue";
import AppSectionHeading from "@/js/components/common/AppSectionHeading.vue";
import KatexEquation from "@/js/components/common/KatexEquation.vue";

const digitalFiltersTransferFunction = 'H(z) = \\frac{Y(z)}{X(z)} = \\frac{\\sum_{k=0}^{M}a_k ' +
  '\\cdot z^{-k}}{1+\\sum_{k=1}^{N}b_k \\cdot z^{-k}} = \\frac{N(z)}{1+D(z)}';
</script>