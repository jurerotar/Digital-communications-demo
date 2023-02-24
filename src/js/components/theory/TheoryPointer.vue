<template>
  <AppParagraph>
    V spodnji animaciji prikazujemo enotsko krožnico z središčem v izhodišču koordinatnega sistema in polmerom 1.
    Koordinatni sistem sestavljata <span class="font-semibold">imaginarna</span> (vertikalna) in <span class="font-semibold">realna</span>
    (horizontalna) os.
    <br><br>
    Sinus in kosinus sta matematični funkciji, ki opisujeta gladko ponavljajočo oscilacijo po krožnici.
    V spodnjem primeru se ti ponavljata na intervalu
    <KatexEquation inline>
      {{ '2π' }}
    </KatexEquation>
    , za kar po krožnici potrebujemo narediti 360 stopinj ali
    <KatexEquation inline>
      {{ '2π' }}
    </KatexEquation>
    radianov.
    <br><br>
    V animaciji prikazujemo eno periodo sinusnega signala, eno periodo kosinusnega signala in kazalec, ki predstavlja vsoto kvadratov teh
    dveh signalov.
    <br>
  </AppParagraph>
</template>
<script
  setup
  lang="ts"
>
import AppParagraph from "@/js/components/common/AppParagraph.vue";
import KatexEquation from "@/js/components/common/KatexEquation.vue";
</script>