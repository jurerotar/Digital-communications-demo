<template>
  <AppParagraph>
    Animacija prikazuje vsoto ob prehodu po danem signalu, brez enosmerne komponente
    <KatexEquation inline>
      {{ 'a_0' }}
    </KatexEquation>
    oz. povprečne vrednosti tega signala, ki jo dobimo pri
    <KatexEquation inline>
      {{ 'X(0)' }}
    </KatexEquation>
    . Da se le-te izognemo smo za izračun vzeli signal, ki gre med -1 in 1. Pri večanju števil harmonskih komponent, se približujemo
    pravokotnemu periodičnemu signalu.
    <br />
    <br />
    Opazimo, da se moder in zelen kazalec pri vsaki komponenti vrtita v nasprotno smer, njuna vsota pa je
    <span class="font-semibold">vedno realna in je enaka kosinusu kota</span>
    .
    <br />
    <br />
    Ob dodajanju višjih komponent opazimo, da imamo majhen presežek, ki pa je, ne glede na število komponent, vedno enako visok. Pojav
    imenujemo
    <span class="font-semibold">Gibbsov efekt</span>
    . Gibbsovemu efektu se ne moremo izogniti, saj je pri idealnem pravokotnem signalu preskok neskončno hiter in bi potrebovali neskončno
    veliko frekvenco, da bi ga ujeli.
  </AppParagraph>
</template>
<script setup lang="ts">
import AppParagraph from '@components/common/AppParagraph.vue';
import KatexEquation from '@components/common/KatexEquation.vue';
</script>
