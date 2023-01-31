<template>
  <div class="flex flex-col gap-4">
    <AppParagraph>
      Izvorni signal se pri prenosu skozi prenosni kanal popači - raztegne se po časovni osi.
      V primeru ilustriranem na tej strani je ekvivalentni prenosni kanal modeliran kot idealni nizko pasovni filter z mejno frekvenco
      <KatexEquation inline>
        {{ 'f_m' }}
      </KatexEquation>
      , ki je enaka vzorčevalni frekvenci:
      <KatexEquation inline>
        {{ 'f_m=f_s' }}
      </KatexEquation>
      Sestavljen je iz sita za preoblikovanje enotskih impulzov, oddajnega sita, sistemske funkcije kanala ter sprejemnega sita.
      <br>
      Ekvivalentna sistemska funkcija kanala je tako:
      <KatexEquation>
        {{ 'h(t)=sinc(2πf_mm(t-t_0))' }}
      </KatexEquation>
      in na prvem grafu opazimo, da se razteza čez več period vzorčenja
      <KatexEquation inline>
        {{ 't_s' }}
      </KatexEquation>. Vnaša tudi zakasnitev
      <KatexEquation inline>
        {{ 't_s' }}
      </KatexEquation>
      , ki je določena kot čas, ob katerem ima
      <KatexEquation inline>
        {{ 'h(t)' }}
      </KatexEquation>
      največjo vrednost.<br>
      Izvorni signal je vsota časovno zamaknjenih impulzov
      <KatexEquation inline>
        {{ 'g(t)' }}
      </KatexEquation>
      , uteženimi s simboli
      <KatexEquation inline>
        {{ 'y[n]' }}
      </KatexEquation>
      ob časih
      <KatexEquation inline>
        {{ 't=nT_s' }}
      </KatexEquation>.
      <KatexEquation>
        {{ inputSignal }}
      </KatexEquation>
      Tako je tudi prejeti signal vsota impulzov korigiranih s prenosno funkcijo
      <KatexEquation inline>
        {{ 'h(t)' }}
      </KatexEquation>
      , kar zapišemo z operacijo konvolucije
      <KatexEquation>
        {{ yhConv }}
      </KatexEquation>
      Ker se
      <KatexEquation inline>
        {{ 'h(t)' }}
      </KatexEquation>
      razteza čez več period, to pomeni, da se tudi posamezni simbol razteza v čas, ko vzorčimo naslednji simbol.
      Vrednost se prišteje naslednjemu vzorcu in spremeni njegovo vrednost. Nastane intersimbolna interferenca.
    </AppParagraph>
    <AppSectionHeading>
      Nyquistov kriterij v časovnem prostoru
    </AppSectionHeading>
    <AppParagraph>
      Kljub temu, da
      <KatexEquation inline>
        {{ 'h(t)' }}
      </KatexEquation>
      povzroči, da se simbol razširi čez več period vzorčenja, to ni problem, če je vrednost
      <KatexEquation inline>
        {{ 'h(t)' }}
      </KatexEquation>
      enaka
      <KatexEquation inline>
        {{ '0' }}
      </KatexEquation>
      za vse
      <KatexEquation inline>
        {{ 't=nT_s' }}
      </KatexEquation>,
      <KatexEquation inline>
        {{ 'n \\neq 0' }}
      </KatexEquation>
      Če <span class="font-semibold">h(t)</span> izpolnjuje to zahtevo, pravimo, da izpoljuje
      <span class="font-semibold">Nyquistov kriterij za prenos brez intersimbolne interference v časovnem prostoru</span>.
      <KatexEquation>
        {{ h1Nyquist }}
      </KatexEquation>
    </AppParagraph>
    <AppSectionHeading>
      Nyquistov kriterij v frekvenčnem prostoru
    </AppSectionHeading>
    <AppParagraph>
      Zanima nas še, kako mora izgledati prenosna funkcija ekvivalentnega prenosnega kanala <span class="font-semibold">H(f)</span>.
      Zgoraj zapisan izraz za <span class="font-semibold">h(t)</span> ne določa vrednosti
      <span class="font-semibold">h(t)</span> za <span class="font-semibold">t</span> <span class="font-semibold">&#8800;</span>
      <KatexEquation inline>
        {{ 'nT_s' }}
      </KatexEquation>
      , zato ga zapišemo drugače:
      <KatexEquation>
        {{ h2Nyquist }}
      </KatexEquation>,
      kjer je
      <KatexEquation inline>
        {{ 'v_δ(t)' }}
      </KatexEquation>
      vzorčevalna funkcija (niz enotskih impulzov) s frekvenco
      <KatexEquation inline>
        {{ 'f_v=f_s' }}
      </KatexEquation>
      , katere Fourier transform poznamo. Izraz preuredimo in dobimo izraz za prekrito prenosno funkcijo:
      <KatexEquation>
        {{ h3Nyquist }}
      </KatexEquation>
      Če je pogoj izpolnjen, pravimo, da velja Nyquistov kriterij za prenos brez ISI v frekvenčnem prostoru:
      <span class="font-semibold">
        Če je prekrita prenosna funkcija ekvivalentnega prenosnega kanala konstantna, potem pri digitalnem prenosu ne bo
        prišlo do intersimbolne interference.
      </span>
    </AppParagraph>
    <AppSectionHeading>
      Očesni diagram
    </AppSectionHeading>
    <AppParagraph>
      Na očesnem diagramu vidimo 2 periodi prejetega signala pri čemer za proženje uporabimo frekvenco vzorčenja.
      Na spodnjem zaslonu osciloskopa je proženje nastavljeno na vzorčno frekvenco izvornega signala,
      zato se ob spreminjanju zakasnitve na kanalu
      <KatexEquation inline>
        {{ 't_0' }}
      </KatexEquation>
      spremeni pozicija mesta, kjer odčitavamo signal (ilustrirano z zeleno črto).
    </AppParagraph>
  </div>
</template>

<script
  setup
  lang="ts"
>
import {interSymbolInterferenceTransferFunction, inputSignal, yhConv, h1Nyquist, h2Nyquist, h3Nyquist} from "@/js/helpers/equations";
import AppParagraph from "@/js/components/common/AppParagraph.vue";
import AppSectionHeading from "@/js/components/common/AppSectionHeading.vue";
import KatexEquation from "@/js/components/common/KatexEquation.vue";
</script>