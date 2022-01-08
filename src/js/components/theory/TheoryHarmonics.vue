<template>
  <p class="transition-colors duration-300 dark:text-white">
    Animacija prikazuje vsoto ob prehodu po danem signalu, brez enosmerne komponente <span class="font-semibold">a0</span>
    oz. povprečne vrednosti tega signala, ki jo dobimo pri <span class="font-semibold">X(0)</span>.
    Da se le-te izognemo smo za izračun vzeli signal, ki gre med <span class="font-semibold">-1</span> in <span class="font-semibold">+1</span>.
    Pri večanju števil harmonskih komponent, se približujemo pravokotnemu periodičnemu signalu.
    <br>
    <br>Opazimo, da se moder in zelen kazalec pri vsaki komponenti vrtita v nasprotno smer, njuna vsota pa je <span class="font-semibold">vedno realna in je enaka kosinusu kota</span>.
    <br>
    <br>
    Ob dodajanju višjih komponent opazimo, da imamo majhen presežek, ki pa je, ne glede na število komponent, vedno enako visok.
    Pojav imenujemo <span class="font-semibold">Gibbsov efekt</span>. Gibbsovemu efektu se ne moremo izogniti, saj je pri idealnem pravokotnem signalu preskok neskončno hiter in bi potrebovali neskončno veliko frekvenco, da bi ga ujeli.
  </p>
</template>

<script>
export default {
    name: "TheoryHarmonics"
}
</script>