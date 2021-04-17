<template>
    <div id = "canvas-spectrum"></div>
</template>

<script>
import P5 from 'p5';

export default {
    name: "Spectrum",
    mounted() {
        /**
         * Initiate new P5 instance and create canvas
         */
        new P5((p5) => {
            this.$c.setup(p5);
            p5.draw = () => {

            }
        }, `canvas-spectrum`);
    },
}
</script>