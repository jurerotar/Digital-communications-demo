<template>
    <div>
        <p class="transition-colors duration-300 dark:text-white">
            {{formula}}
        </p>
    </div>
</template>

<script>

    export default {
        name: "TheoryCorrelation",
        data(){
            return{
                formula: '$R_{xy}=\\overline{x(t)y(t)}={1\\over T}\\int_Tx(t)y(t)dt$'
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