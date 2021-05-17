<template>
   <br>Animacija prikazuje, kako se kazalci seštevajo ob prehodu po danem signalu, brez enosmerne komponente \(\mathbf{a_o}\)
    oz povprečno vrednost tega signala, ki jo dobimo pri \(\mathbf{X[0]}\). Da se te izognemo smo za izračun vzeli signal, ki gre med \(\mathbf{-1}\) in \(\mathbf{1}\).
    Pri večanju števil harmonskih komponent, se približujemo pravokotnem periodičnem signalu.
    <br>
    Ob primerjavi višjih komponent opazimo, da imamo majhen presežek, ne glede na število komponent je ta zmeraj enako visok.
    Temu pravimo Gibbsov efekt. Efektu se ne moremo izogniti, saj je pri idealnem pravokotnem signalu preskok neskončno hiter in bi potrebovali neskončno veliko frekvenco, da bi tega ujeli.
</template>

<script>
export default {
    name: "TheoryHarmonics"
}
</script>