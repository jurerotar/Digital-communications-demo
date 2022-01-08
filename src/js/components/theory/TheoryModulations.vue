<template>
  <p class="transition-colors duration-300 dark:text-white">
    <br>Modulacija je postopek, pri katerem z vhodnim modulacijskim signalom spreminjamo parametre pomožnega harmoničnega signala, ki ga imenujemo nosilec.
    Moduliramo lahko amplitudo, fazo ali frekvenco.
  </p>
  <ul class="ml-4 transition-colors duration-300 dark:text-white">
    <li class="list-disc my-2">
      <span class="font-semibold">Amplitudna modulacija</span> je način prenašanja informacij na daljavo s spreminjanjem jakosti oz. amplitude nosilca signala s konstantno frekvenco. Ločimo več vrst amplitudno moduliranih signalov, ki se razlikujejo v spektru in v postopkih modulacije: dvobočno amplitudno modulirani signal s poudarjenim nosilcem v spektru (AM-DSB-LC) in dvobočno amplitudno modulirani signal brez nosilca v spektru (AM-DSB-SC). Pri AM-DSB-LC modulacijskemu signalu se dodaja enosmerna komponenta, kar zagotovi konstantno polariteto signala pred množenjem z nosilcem.
    </li>
    <li class="list-disc my-2">
      <span class="font-semibold">Frekvenčna modulacija </span>je postopek spreminjanja frekvence nosilnega signala v ritmu modulacijskega signala-informacije.
    </li>
    <!--<li class="list-disc my-2"><span class = "font-semibold"> PAM4</span> je večstopenjski modulacijski signalni format, ki se uporablja za prenos signala.</li>-->
    <li class="list-disc my-2">
      <span class="font-semibold"> 2ASK</span> modulacijo pridobimo z množenjem <span class="font-semibold">unipolarnega binarnega podatkovnega signala in harmoničnega nosilca.</span>
    </li>
    <li class="list-disc my-2">
      <span class="font-semibold"> 4ASK</span> modulacijo pridobimo z množenjem <span class="font-semibold"> digitalnega niza {-3,-1,1,3} in harmoničnega nosilca.</span>
    </li>
    <li class="list-disc my-2">
      <span class="font-semibold"> 2PSK</span> modulacijo pridobimo z množenjem<span class="font-semibold"> bipolarnega binarnega podatkovnega signala in harmoničnega nosilca.</span>
    </li>
    <li class="list-disc my-2">
      <span class="font-semibold"> 4PSK</span> modulacijo pridobimo z množenjem<span class="font-semibold"> digitalnega niza {-3,-1,1,3} in harmoničnega nosilca.</span>
    </li>
    <li class="list-disc my-2">
      <span class="font-semibold"> 2FSK</span> je postopek, pri katerem so binarni podatki posredovani preko<span class="font-semibold"> spremembe frekvence nosilnega signala. Pri 2FSK uporabljamo 2 različni frekvenci.</span>
    </li>
    <li class="list-disc my-2">
      <span class="font-semibold"> 4FSK</span> je postopek, pri katerem so binarni podatki posredovani preko<span class="font-semibold"> spremembe frekvence nosilnega signala. Pri 4FSK uporabljamo 4 različne frekvence.</span>
    </li>
  </ul>
</template>

<script>
export default {
    name: "TheoryModulations"
}
</script>