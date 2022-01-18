<template>
    <div>
        <p class="transition-colors duration-300 dark:text-white">
            <span class = "font-semibold">Korelacija:</span><br>
            Včasih želimo signale med seboj primerjati. Kot merilo podobnosti med
            dvema signaloma lahko uporabimo njuno korelacijo. Korelacija signalov <span class = "font-semibold">x(t)</span> in <span class = "font-semibold">y(t)</span>, ki sta
            periodična s periodo <span class = "font-semibold">T</span>, je definirana kot srednja vrednost njunega produkta: <br><br>
            <span class="text-xl">{{formula.correlation}}</span> <br><br>
            Korelacijo signalov imenujemo tudi skalarni produkt signalov, ker je rezultat tega produkta
            skalar, to je število, in ne signal, kot pri običajnem produktu dveh signalov. Kadar je korelacija
            enaka 0, pravimo, da sta signala ortogonalna (si nista prav nič podobna), po analogiji z vektorji,
            kjer pravimo, da sta dva vektorja ortogonalna, kadar je njun skalarni produkt enak 0. <br><br>
            <span class = "font-semibold">Korelacijska funkcija:</span><br>
            Če naredimo korelacijo med prvim signalom <span class = "font-semibold">x(t)</span> in za <span class = "font-semibold">τ</span> časovno
            zamaknjenim drugim signalom <span class = "font-semibold">y(t + τ)</span>, je korelacija odvisna od zamika <span class = "font-semibold">τ</span>, oziroma je funkcija
            zamika <span class = "font-semibold">τ</span>. Dobljeno funkcijo imenujemo korelacijska funkcija.<br><br>
            {{formula.correlationFunction}}<br><br>
            Korelacijska funkcija ima največjo vrednost pri tistem zamiku <span class = "font-semibold">τ</span>, pri katerem sta si signala med
            seboj najbolj podobna. Kadar je korelacijska funkcija dveh signalov enaka 0 pri vsakem zamiku
            <span class = "font-semibold">τ</span>, pravimo, da sta signala med seboj nekorelirana.
        </p>
    </div>
</template>

<script>

    export default {
        name: "TheoryCorrelation",
        data(){
            return{
                formula: {
                    correlation: '$R_{xy}=\\overline{x(t)y(t)}={1\\over T}\\int_Tx(t)y(t)dt$',
                    correlationFunction: '$R_{xy}(τ)=\\overline{x(t)y(t + τ)}={1\\over T}\\int_Tx(t)y(t + τ)dt$'
                }
            }
        },
        methods: {
             reRender() {
            if(window.MathJax) {
                console.log('rendering mathjax');
                 window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub], () => console.log('done'));
                }
            }
        },
        mounted() {
            this.reRender();
        },
        watch: {
            latex: function() {
                console.log('data changed')
                this.reRender();
            }
        }
    }
</script>