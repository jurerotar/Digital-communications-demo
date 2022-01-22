<template>
  <div class="flex flex-col gap-4">
    <app-section-heading>
      Korelacija
    </app-section-heading>
    <app-paragraph>
      Včasih želimo signale med seboj primerjati. Kot merilo podobnosti med
      dvema signaloma lahko uporabimo njuno korelacijo.
      Korelacija signalov <span class="font-semibold">x(t)</span>
      in <span class="font-semibold">y(t)</span>, ki sta
      periodična s periodo <span class="font-semibold">T</span>,
      je definirana kot srednja vrednost njunega produkta: <br>
      <span
        ref="correlationRef"
        class="katex-block"
      />
      Korelacijo signalov imenujemo tudi skalarni produkt signalov, ker je rezultat tega produkta
      skalar, to je število, in ne signal, kot pri običajnem produktu dveh signalov. Kadar je korelacija
      enaka 0, pravimo, da sta signala ortogonalna (si nista prav nič podobna), po analogiji z vektorji,
      kjer pravimo, da sta dva vektorja ortogonalna, kadar je njun skalarni produkt enak 0.
    </app-paragraph>
    <app-section-heading>
      Korelacijska funkcija
    </app-section-heading>
    <app-paragraph>
      Če naredimo korelacijo med prvim signalom <span class="font-semibold">x(t)</span> in za
      <span class="font-semibold">τ</span> časovno
      zamaknjenim drugim signalom <span class="font-semibold">y(t + τ)</span>,
      je korelacija odvisna od zamika <span class="font-semibold">τ</span>, oziroma je funkcija
      zamika <span class="font-semibold">τ</span>.
      Dobljeno funkcijo imenujemo korelacijska funkcija.<br>
      <span
        ref="correlationFunctionRef"
        class="katex-block"
      />
      Korelacijska funkcija ima največjo vrednost pri tistem zamiku <span class="font-semibold">τ</span>, pri katerem sta si signala med
      seboj najbolj podobna. Kadar je korelacijska funkcija dveh signalov enaka 0 pri vsakem zamiku
      <span class="font-semibold">τ</span>, pravimo, da sta signala med seboj nekorelirana.
    </app-paragraph>
  </div>
</template>

<script
  setup
  lang="ts"
>
import {ref, watchEffect} from "vue";
import {correlation, correlationFunction} from "@/js/helpers/equations";
import AppParagraph from "@/js/components/common/AppParagraph.vue";
import AppSectionHeading from "@/js/components/common/AppSectionHeading.vue";
const correlationRef = ref<HTMLSpanElement>();
const correlationFunctionRef = ref<HTMLSpanElement>();

watchEffect(() => {
  if (correlationRef.value) {
    window.katex.render(correlation, correlationRef.value!);
  }
  if (correlationFunctionRef.value) {
    window.katex.render(correlationFunction, correlationFunctionRef.value!);
  }
});
</script>