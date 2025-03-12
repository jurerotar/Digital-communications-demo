<template>
  <div class="flex flex-col gap-4">
    <AppSectionHeading>Korelacija</AppSectionHeading>
    <AppParagraph>
      Včasih želimo signale med seboj primerjati. Kot merilo podobnosti med dvema signaloma lahko uporabimo njuno korelacijo. Korelacija
      signalov
      <KatexEquation inline>
        {{ 'x(t)' }}
      </KatexEquation>
      in
      <KatexEquation inline>
        {{ 'y(t + τ)' }}
      </KatexEquation>
      , ki sta periodična s periodo
      <KatexEquation inline>
        {{ 'T' }}
      </KatexEquation>
      , je definirana kot srednja vrednost njunega produkta:
      <br />
      <KatexEquation>
        {{ 'R_{xy}=\\overline{x(t)y(t)}={1\\over T}\\int_Tx(t)y(t)dt' }}
      </KatexEquation>
      Korelacijo signalov imenujemo tudi skalarni produkt signalov, ker je rezultat tega produkta skalar, to je število, in ne signal, kot
      pri običajnem produktu dveh signalov. Kadar je korelacija enaka 0, pravimo, da sta signala ortogonalna (si nista prav nič podobna), po
      analogiji z vektorji, kjer pravimo, da sta dva vektorja ortogonalna, kadar je njun skalarni produkt enak 0.
    </AppParagraph>
    <AppSectionHeading>Korelacijska funkcija</AppSectionHeading>
    <AppParagraph>
      Če naredimo korelacijo med prvim signalom
      <KatexEquation inline>
        {{ 'x(t)' }}
      </KatexEquation>
      in za
      <KatexEquation inline>
        {{ 'τ' }}
      </KatexEquation>
      časovno zamaknjenim drugim signalom
      <KatexEquation inline>
        {{ 'y(t + τ)' }}
      </KatexEquation>
      , je korelacija odvisna od zamika
      <KatexEquation inline>
        {{ 'τ' }}
      </KatexEquation>
      , oziroma je funkcija zamika
      <KatexEquation inline>
        {{ 'τ' }}
      </KatexEquation>
      . Dobljeno funkcijo imenujemo korelacijska funkcija.
      <br />
      <KatexEquation>
        {{ 'R_{xy}(τ)=\\overline{x(t)y(t + τ)}={1\\over T}\\int_Tx(t)y(t + τ)dt' }}
      </KatexEquation>
      Korelacijska funkcija ima največjo vrednost pri tistem zamiku
      <KatexEquation inline>
        {{ 'τ' }}
      </KatexEquation>
      , pri katerem sta si signala med seboj najbolj podobna. Kadar je korelacijska funkcija dveh signalov enaka 0 pri vsakem zamiku
      <KatexEquation inline>
        {{ 'τ' }}
      </KatexEquation>
      , pravimo, da sta signala med seboj nekorelirana.
    </AppParagraph>
  </div>
</template>

<script setup lang="ts">
import AppParagraph from '@components/common/AppParagraph.vue';
import AppSectionHeading from '@components/common/AppSectionHeading.vue';
import KatexEquation from '@components/common/KatexEquation.vue';
</script>
