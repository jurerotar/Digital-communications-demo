<template>
  <AppParagraph>
    Frekvenčni spekter energijskih signalov izračunamo s pomočjo Fourierjeve transformacije:
    <KatexEquation>
      {{ 'X(f) = \\int_{-\\infty}^{\\infty}{x(t)e^{-j pi f t}dt}' }}
    </KatexEquation>
    Spekter signala pri frekvenci
    <KatexEquation inline>
      {{ 'f' }}
    </KatexEquation>
    je pravzaprav korelacija tega signala s kompleksnim harmoničnim signalom
    <KatexEquation inline>
      {{ 'e^{-j \\pi f t}' }}
    </KatexEquation>.
    Spekter
    <KatexEquation inline>
      {{ 'X(f)' }}
    </KatexEquation> nam torej pove, koliko sta si ta dva signala podobna.
    <br>
    Amplitudni spekter
    <KatexEquation inline>
      {{ 'A(f)' }}
    </KatexEquation>
    signala
    <KatexEquation inline>
      {{ 'X(f)' }}
    </KatexEquation>
    enak absolutni vrednosti njegovega kompleksnega spektra
    <KatexEquation inline>
      {{ 'X(f)' }}
    </KatexEquation>:
    <KatexEquation>
      {{ 'A_{x}(f) = |X(f)|' }}
    </KatexEquation>
    Čas
    <KatexEquation inline>
      {{ 't' }}
    </KatexEquation>
    množimo z realno konstanto
    <KatexEquation inline>
      {{ 'a' }}
    </KatexEquation>
    . Če je
    <KatexEquation inline>
      {{ 'a &lt; 1' }}
    </KatexEquation> se signal raztegne, če pa je
    <KatexEquation inline>
      {{ 'a > 1' }}
    </KatexEquation>
    , se signal skrči po časovni osi. Za spekter takega signala velja:
    <KatexEquation>
      {{ 'x(at) \\Leftrightarrow \\frac{1}{|a|}X(\\frac{f}{a})' }}
    </KatexEquation>
    Ker se v spektru frekvenca
    <KatexEquation inline>
      {{ 'f' }}
    </KatexEquation>
    deli s konstanto
    <KatexEquation inline>
      {{ 'a' }}
    </KatexEquation>
    , pomeni skrčenje v časovnem prostoru, razteg v frekvenčnem prostoru in obratno.
    Iz tega sledi, da imajo dolgi impulzi ozek spekter, kratki impulzi pa širok spekter.
  </AppParagraph>
</template>

<script
  setup
  lang="ts"
>
import AppParagraph from "@components/common/AppParagraph.vue";
import KatexEquation from "@components/common/KatexEquation.vue";
</script>