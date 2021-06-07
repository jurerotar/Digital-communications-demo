<template>
    <br>Modulacija je postopek pri katerem z vhodnim modulacijskim signalom spreminjamo parametre pomožnega harmoničnega signala, ki ga imenujemo nosilec.
    Moduliramo lahko amplitudo, fazo ali frekvenco.
    <ul class = "ml-4">
        <li class="list-disc my-2"><span class = "font-semibold">Amplitudna modulacija</span> je način prenašanja informacij na daljavo s spreminjanjem jakosti oz. amplitude nosilca signala s konstantno frekvenco. Ločimo več vrst amplitudno moduliranih signalov, ki se razlikujejo v spektru in v postopkih modulacije: dvobočno amplitudno modulirani signal s poudarjenim nosilcem v spektru (AM-DSB-LC), dvobočno amplitudno modulirani signal brez nosilca v spektru (AM-DSB-SC). Pri AM-DSB-LC modulacijskemu signalu se dodaja enosmerna komponenta, kar zagotovi konstantno polariteto signala pred množenjem z nosilcem</li>
        <li class="list-disc my-2"><span class = "font-semibold">Frekvenčna modulacija </span>je postopek spreminjanja frekvence nosilnega signala v ritmu modulacijskega signala-informacije.</li>
        <li class="list-disc my-2"><span class = "font-semibold">BASK</span> modulacijo pridobimo z množenjem <span class = "font-semibold">unipolarnega binarnega podatkovnega signala in harmoničnega nosilca.</span></li>
        <li class="list-disc my-2"><span class = "font-semibold"> BPSK</span> modulacijo pridobimo z množenjem<span class = "font-semibold"> bipolarnega binarnega podatkovnega signala in harmoničnega nosilca.</span></li>
        <li class="list-disc my-2"><span class = "font-semibold"> BFSK</span> je postopek, pri katerem so binarni podatki posredovani preko<span class = "font-semibold"> spremembe frekvence nosilnega signala.</span></li>
        <li class="list-disc my-2"><span class = "font-semibold">PAM4</span> je večstopenjski modulacijski signalni format, ki se uporablja za prenos signala.</li>
    </ul>
    Razlika med BASK in BPSK izhaja samo iz vhodnega signala: unipolarni signal ima informacijo zapisano v<span class = "font-semibold"> amplitudi (0,A)</span> , bipolarni signal pa v <span class = "font-semibold">fazi (+A, -A).</span>
</template>

<script>
export default {
    name: "TheoryModulations"
}
</script>