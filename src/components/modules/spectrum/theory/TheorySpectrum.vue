<template>
    <br>
    Frekvenčni spekter energijskih signalov računa s pomopčjo Fourier Transforma:
    <br><br>
    $$\mathrm{X}(\mathrm{f}) = \int_{-\infty}^{\infty} x(t)e^{(-j\pi ft)}\, dt$$
    <br><br>
    Spekter signala pri frekvenci \(\mathbf{f}\) je pravzaprav korelacija tega signala s kompleksnim harmoničnim signalom \(\mathrm{e^{(-j\pi ft)}}\). Spekter \({\mathrm{X}(\mathrm{f})}\) nam torej pove, koliko sta si ta dva signala podobna.
    <br>
    Amplitudni spekter \({\mathrm{A}_\mathrm{x}(\mathrm{f})}\) signala \({\mathrm{x}(\mathrm{t})}\) enak absolutni vrednosti njegovega kompleksnega spektra \({\mathrm{X}(\mathrm{f})}\):
    <br><br>
    $$\mathrm{A}_\mathrm{x}(\mathrm{f}) = \lvert\mathrm{X}(\mathrm{f})\rvert$$
    <br><br>Čas \({\mathrm{t}}\) množimo z realno konstanto \(\mathrm{a}\). Če je \({\mathrm{a}\lt 1}\) se signal raztegne, če pa je \({\mathrm{a}\gt 1}\), se signal skrči po časovni osi. Za spekter takega signala velja:
    <br><br>
    $$\mathrm{x}(\mathrm{at})\leftrightarrow \frac{1}{\lvert \mathrm{a}\rvert}\mathrm{X}(\frac{\mathrm{f}}{\mathrm{a}}) $$.
    <br><br>
    Ker se v spektru frekvenca \({\mathrm{f}}\) deli s konstanto \(\mathrm{a}\), pomeni skrčenje v časovnem prosturu razteg v frekvenčnem prostoru in obratno. Iz tega sledi, da imajo dolgi impulzi ozek spekter, kratki impulzi pa širok spekter.

</template>

<script>
export default {
    name: "TheorySpectrum"
}
</script>