<template>
  <div class="flex flex-col gap-4">
    <AppParagraph>
      Izvorni signal se pri prenosu skozi prenosni kanal popači - raztegne se po časovni osi. V primeru ilustriranem na tej strani je
      ekvivalentni prenosni kanal modeliran kot idealni nizko pasovni filter z mejno frekvenco
      <KatexEquation inline>
        {{ 'f_m' }}
      </KatexEquation>
      , ki je enaka vzorčevalni frekvenci:
      <KatexEquation inline>
        {{ 'f_m=f_s' }}
      </KatexEquation>
      Sestavljen je iz sita za preoblikovanje enotskih impulzov, oddajnega sita, sistemske funkcije kanala ter sprejemnega sita.
      <br />
      Ekvivalentna sistemska funkcija kanala je tako:
      <KatexEquation>
        {{ 'h(t)=sinc(2πf_mm(t-t_0))' }}
      </KatexEquation>
      in na prvem grafu opazimo, da se razteza čez več period vzorčenja
      <KatexEquation inline>
        {{ 't_s' }}
      </KatexEquation>
      . Vnaša tudi zakasnitev
      <KatexEquation inline>
        {{ 't_s' }}
      </KatexEquation>
      , ki je določena kot čas, ob katerem ima
      <KatexEquation inline>
        {{ 'h(t)' }}
      </KatexEquation>
      največjo vrednost.
      <br />
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
      </KatexEquation>
      .
      <KatexEquation>
        {{ 'y_{odd}(t)=\\sum_{n=-\\infty}^{\\infty}y[n]δ(t-nT_s)' }}
      </KatexEquation>
      Tako je tudi prejeti signal vsota impulzov korigiranih s prenosno funkcijo
      <KatexEquation inline>
        {{ 'h(t)' }}
      </KatexEquation>
      , kar zapišemo z operacijo konvolucije
      <KatexEquation>
        {{ 'y_{spr}=y_{odd}(t)*h(t)' }}
      </KatexEquation>
      Ker se
      <KatexEquation inline>
        {{ 'h(t)' }}
      </KatexEquation>
      razteza čez več period, to pomeni, da se tudi posamezni simbol razteza v čas, ko vzorčimo naslednji simbol. Vrednost se prišteje
      naslednjemu vzorcu in spremeni njegovo vrednost. Nastane intersimbolna interferenca.
    </AppParagraph>
    <AppSectionHeading>Nyquistov kriterij v časovnem prostoru</AppSectionHeading>
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
      </KatexEquation>
      ,
      <KatexEquation inline>
        {{ 'n \\neq 0' }}
      </KatexEquation>
      Če
      <KatexEquation inline>
        {{ 'h(t)' }}
      </KatexEquation>
      izpolnjuje to zahtevo, pravimo, da izpoljuje
      <span class="font-semibold">Nyquistov kriterij za prenos brez intersimbolne interference v časovnem prostoru</span>
      .
      <KatexEquation>
        {{ 'h(nT_s)=\\begin{cases}A & n=0 \\newline 0 & n \\neq 0\\end{cases}' }}
      </KatexEquation>
    </AppParagraph>
    <AppSectionHeading>Nyquistov kriterij v frekvenčnem prostoru</AppSectionHeading>
    <AppParagraph>
      Zanima nas še, kako mora izgledati prenosna funkcija ekvivalentnega prenosnega kanala
      <KatexEquation inline>
        {{ 'H(f)' }}
      </KatexEquation>
      . Zgoraj zapisan izraz za
      <KatexEquation inline>
        {{ 'h(t)' }}
      </KatexEquation>
      ne določa vrednosti
      <KatexEquation inline>
        {{ 'h(t)' }}
      </KatexEquation>
      za
      <KatexEquation inline>
        {{ 't \\neq nT_s' }}
      </KatexEquation>
      , zato ga zapišemo drugače:
      <KatexEquation>
        {{ 'h(t)*v_δ(t)=Aδ(t)' }}
      </KatexEquation>
      , kjer je
      <KatexEquation inline>
        {{ 'v_δ(t)' }}
      </KatexEquation>
      vzorčevalna funkcija (niz enotskih impulzov) s frekvenco
      <KatexEquation inline>
        {{ 'f_v=f_s' }}
      </KatexEquation>
      , katere Fourier transform poznamo. Izraz preuredimo in dobimo izraz za prekrito prenosno funkcijo:
      <KatexEquation>
        {{ '\\sum_{k=-\\infty}^{\\infty} H(f+kf_s)=AT_s' }}
      </KatexEquation>
      Če je pogoj izpolnjen, pravimo, da velja Nyquistov kriterij za prenos brez ISI v frekvenčnem prostoru:
      <span class="font-semibold">
        Če je prekrita prenosna funkcija ekvivalentnega prenosnega kanala konstantna, potem pri digitalnem prenosu ne bo prišlo do
        intersimbolne interference.
      </span>
    </AppParagraph>
    <AppSectionHeading>Očesni diagram</AppSectionHeading>
    <AppParagraph>
      Na očesnem diagramu vidimo 2 periodi prejetega signala pri čemer za proženje uporabimo frekvenco vzorčenja. Na spodnjem zaslonu
      osciloskopa je proženje nastavljeno na vzorčno frekvenco izvornega signala, zato se ob spreminjanju zakasnitve na kanalu
      <KatexEquation inline>
        {{ 't_0' }}
      </KatexEquation>
      spremeni pozicija mesta, kjer odčitavamo signal (ilustrirano z zeleno črto).
    </AppParagraph>
  </div>
</template>

<script setup lang="ts">
import AppParagraph from '@components/common/AppParagraph.vue';
import AppSectionHeading from '@components/common/AppSectionHeading.vue';
import KatexEquation from '@components/common/KatexEquation.vue';
</script>
