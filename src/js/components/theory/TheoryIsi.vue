<template>
  <p class="transition-colors duration-300 dark:text-white">
    <br>
    Izvorni signal se pri prenosu skozi prenosni kanal popači - raztegne se po časovni osi.
    V primeru ilustriranem na tej strani je ekvivalentni prenosni kanal modeliran kot idealni nizko pasovni filter z mejno frekvenco 
    <span class="font-semibold">f<sub>m</sub></span>, 
    ki je enaka vzorčevalni frekvenci: 
    <span class="font-semibold">f<sub>m</sub> = f<sub>s</sub></span>
    Sestavljen je iz sita za preoblikovanje enotskih impulzov, oddajnega sita, sistemske funkcije kanala ter sprejemnega sita.
    <br>Ekvivalentna sistemska funkcija kanala je tako 
    <br><br><span
      ref="transferFunctionRef"
      class="katex-inline"
    />
    <br><br>
    in na prvem grafu opazimo, da se razteza čez več period vzorčenja 
    <span class="font-semibold">t<sub>s</sub></span>. 
    Vnaša tudi zakasnitev <span class="font-semibold">t<sub>s</sub></span>, 
    ki je določena kot čas, ob katerem ima <span class="font-semibold">h(t)</span> največjo vrednost.
    <br><br>
    Izvorni signal je vsota časovno zamaknjenih impulzov <span class="font-semibold">g(t)</span>, uteženimi s simboli 
    <span class="font-semibold">y[n]</span> ob času <span class="font-semibold">t-n*T<sub>s</sub></span> 
    <br><br><span
      ref="inputSignalRef"
      class="katex-inline"
    /><br><br>
    Tako je tudi prejeti signal vsota impulzov korigiranih s prenosno funkcijo <span class="font-semibold">h(t)</span>, 
    kar zapišemo z operacijo konvolucije
    <br><br><span
      ref="yhConvRef"
      class="katex-inline"
    /><br><br>
    Ker se <span class="font-semibold">h(t)</span> 
    razteza čez več period, to pomeni, da se tudi posamezni simbol razteza v čas, ko vzorčimo naslednji simbol. 
    Vrednost se prišteje naslednjemu vzorcu in spremeni njegovo vrednost. Nastane intersimbolna interferenca. 
    <br><br>
  </p>
  <h1 class="text-2xl font-medium mb-4 transition-colors duration-300 dark:text-white">
    Nyquistov kriterij v časovnem prostoru
  </h1>
  <p class="transition-colors duration-300 dark:text-white">
    Kljub, da <span class="font-semibold">h(t)</span> 
    povzroči, da se simbol razširi čez več period vzorčenja, to ni problem, če je vrednost 
    <span class="font-semibold">h(t)</span> enaka 
    <span class="font-semibold">0</span> 
    za vse 
    <span class="font-semibold">t=nT<sub>s</sub>, n <span class="font-semibold">&#8800;</span>0</span>.
    Če 
    <span class="font-semibold">h(t)</span> 
    izpolnjuje to zahtevo, pravimo, da izpoljuje 
    <i>Nyquistov kriterij za prenos brez intersimbolne interference v časovnem prostoru.</i>
    <br><br>
    <span
      ref="h1NyquistRef"
      class="katex-inline"
    /><br><br>
  </p>
  <h1 class="text-2xl font-medium mb-4 transition-colors duration-300 dark:text-white">
    Nyquistov kriterij v frekvenčnem prostoru
  </h1>
  <p class="transition-colors duration-300 dark:text-white">
    Zanima nas še, kako mora izgledati prenosna funkcija ekvivalentnega prenosnega kanala 
    <span class="font-semibold">H(f)</span>. 
    Zgoraj zapisan izraz za <span class="font-semibold">h(t)</span> ne določa vrednosti 
    <span class="font-semibold">h(t)</span> za <span class="font-semibold">t</span> 
    <span class="font-semibold">&#8800;</span> <span class="font-semibold">nT<sub>s</sub></span>
    , zato ga zapišemo drugače:
    <br><br><span
      ref="h2NyquistRef"
      class="katex-inline"
    /><br><br>
    kjer je <span class="font-semibold">v<sub>δ</sub>(t)</span> 
    vzorčevalna funkcija (niz enotskih impulzov) s frekvenco 
    <span class="font-semibold">f<sub>v</sub> = f<sub>s</sub></span>, 
    katere Fourier transform poznamo. Izraz preuredimo in dobimo izraz za prekrito prenosno funkcijo:
    <br><br><span
      ref="h3NyquistRef"
      class="katex-inline"
    /><br><br>
    Če je pogoj izpolnjen, pravimo, da velja Nyquistov kriterij za prenos brez ISI v frekvenčnem prostoru: 
    <br><i>Če je prekrita prenosna funkcija ekvivalentnega prenosnega kanala konstantna, 
      potem pri digitalnem prenosu ne bo prišlo do intersimbolne interference. </i>
    <br><br>
  </p>
  <h1 class="text-2xl font-medium mb-4 transition-colors duration-300 dark:text-white">
    Očesni diagram
  </h1>
  <p class="transition-colors duration-300 dark:text-white">
    Na očesnem diagramu vidimo 2 periodi prejetega signala 
    pri čemer za proženje uporabimo frekvenco vzorčenja. 
    Na spodnjem zaslonu osciloskopa je proženje nastavljeno na vzorčno frekvenco izvornega signala, 
    zato se ob spreminjanju zakasnitve na kanalu 
    <span class="font-semibold">t<sub>0</sub></span> 
    spremeni pozicija mesta, kjer odčitavamo signal (ilustrirano z zeleno črto).
    <br>
    <br><br>
  </p>
</template>

<script
 setup
 lang="ts"
>
import {ref, watchEffect} from "vue";
import {transferFunction,inputSignal,yhConv,h1Nyquist,h2Nyquist,h3Nyquist} from "@/js/helpers/equations";

const transferFunctionRef = ref<HTMLSpanElement>();
const inputSignalRef = ref<HTMLSpanElement>();
const yhConvRef = ref<HTMLSpanElement>();
const h1NyquistRef = ref<HTMLSpanElement>();
const h2NyquistRef = ref<HTMLSpanElement>();
const h3NyquistRef = ref<HTMLSpanElement>();

watchEffect(()=> {
    if(transferFunctionRef.value){
        window.katex.render(transferFunction, transferFunctionRef.value!);
    }
    if(inputSignalRef.value){
        window.katex.render(inputSignal, inputSignalRef.value!);
    }
    if(yhConvRef.value){
        window.katex.render(yhConv, yhConvRef.value!);
    }
    if(h1NyquistRef.value){
        window.katex.render(h1Nyquist, h1NyquistRef.value!);
    }
    if(h2NyquistRef.value){
        window.katex.render(h2Nyquist, h2NyquistRef.value!);
    }
    if(h3NyquistRef.value){
        window.katex.render(h3Nyquist, h3NyquistRef.value!);
    }
});
</script>