w<template>
    <h2 class="font-semibold text-xl">{{ title }}</h2>
    <p class = "my-1" v-if = "notes !== ''"><span class = "font-semibold">Opis: </span>{{ notes }}</p>
    <canvas-container>
        <div :id="canvas_id"></div>
    </canvas-container>
</template>

<script>
import P5 from 'p5';
import CanvasContainer from "@/components/global/CanvasContainer";
import '@/types.js';

export default {
    name: "PositiveOnlySignal",
    components: {CanvasContainer},
    data() {
        return {
            p5: null,
            /** @type {Coordinates} */
            offset: {
                x: 0,
                y: 125,
            }
        }
    },
    mounted() {
        // Initiate new P5 instance and create canvas
        this.p5 = new P5((p5) => {
            this.$c.setup(p5);
            p5.draw = () => {
                p5.stroke(0);
                p5.background(255);
                const [canvasDimensions, canvasPadding] = [this.$c.dimensions, this.$c.canvasPadding];

                p5.strokeWeight(2);

                // Top-bottom line
                p5.line(canvasPadding, canvasPadding, canvasPadding, canvasDimensions.y - canvasPadding);

                p5.strokeWeight(1);
                // y-axis labels are passed through vertical_pool array, but they are missing zero, so we need to push it in
                const yAxisLabels = [...this.vertical_pool];
                yAxisLabels.splice(2, 0, 0);
                // Draw left-right lines on y-axis and label each fifth
                for(let i = 0; i <= 20; i++) {
                    // Make each fifth line labeled and wider
                    if(i % 5 === 0) {
                        p5.text(`${yAxisLabels[Math.trunc(i / 5)]}`.substring(0, 4), canvasPadding - 40, canvasPadding + i * 10 + 3);
                        p5.strokeWeight(2);
                        p5.line(canvasPadding - 5, canvasPadding + i * 10, canvasPadding + 5, canvasPadding + i * 10);
                        p5.strokeWeight(1);
                        continue;
                    }
                    p5.line(canvasPadding - 5, canvasPadding + i * 10, canvasPadding + 5, canvasPadding + i * 10);
                }
                // Y axis label
                p5.text(this.isModulatedText, canvasPadding - 5, canvasPadding / 2);
                // X axis label
                p5.text('t', canvasDimensions.x - 30, canvasDimensions.y / 2 + 3);
                p5.strokeWeight(2);
                this.$c.drawArrow(p5, p5.createVector(canvasPadding, canvasDimensions.y / 2), p5.createVector(canvasDimensions.x - canvasPadding, canvasDimensions.y / 2), 'black', 7, 0);

                p5.fill(1);
                p5.triangle(50, 42, 46, 50, 54, 50);

                p5.noFill();
                p5.stroke(this.$c.colors[1]);
                p5.strokeWeight(2);

                // Draw the shape
                p5.beginShape();
                if(this.isBinary) {
                    let previousY = 1;
                    this.normalizedData.forEach((y, x) => {
                        p5.vertex((previousY !== y) ? x - 1 + canvasPadding : x + canvasPadding, y * (this.offset.y - canvasPadding / 2) + this.offset.y + canvasPadding / 2);
                        previousY = y;
                    });
                }
                else {
                    this.normalizedData.forEach((y, x) => {
                        p5.vertex(x + canvasPadding, y * (this.offset.y - canvasPadding / 2) + this.offset.y + canvasPadding / 2);
                    });
                }
                p5.endShape();
            }
            p5.removeCanvas = () => p5.remove();
        }, this.canvas_id);
    },
    unmounted() {
        // Remove canvas, otherwise P5 object stays in memory
        this.p5.removeCanvas();
    },
    computed: {
        normalizedData() {
            const max = Math.max(...this.data.map(el => Math.abs(el)));
            const data = [...this.data];
            data.length = 600;
            return data.map(el => el / max);
        },
        isModulatedText() {
            return (this.is_modulated) ? 'y(t)' : 'x(t)';
        },
        isBinary() {
            return ['unipolar', 'bipolar'].includes(this.type);
        },
        notes() {
            switch(this.type) {
                case 'carrier':
                    return 'Nosilec je visokofrekvenčni signal, s katerim moduliramo podatkovni signal.';
                case 'sine':
                    return 'Sinusni podatkovni signal.';
                case 'unipolar':
                    return 'Unipolarni signal je sestavljen iz vrednosti 1 in 0.';
                case 'bipolar':
                    return 'Bipolarni signal je sestavljen iz vrednosti 1 in -1.';
                case 'am-lc':
                    return 'Pri AM-DSB-LC modulaciji se modulacijskemu signalu dodaja enosmerna komponenta, kar zagotovi konstantno polariteto signala pred množenjem z nosilcem. Modulacijski indeks m = 0.66.';
                case 'am-sc':
                    return 'AM-DSB-SC je dvobočno amplitudno modulirani signal brez nosilca v spektru.';
                case 'fm':
                    return 'Frekvenčna modulacija je postopek spreminjanja frekvence nosilnega signala v ritmu modulacijskega signala-informacije. Frekvenčna deviacija: Δf = +-10.';
                case 'bask':
                    return 'BASK modulacijo pridobimo z množenjem unipolarnega binarnega podatkovnega signala in harmoničnega nosilca.';
                case 'bpsk':
                    return 'BPSK modulacijo pridobimo z množenjem bipolarnega binarnega podatkovnega signala in harmoničnega nosilca.';
                case 'fsk':
                    return 'BFSK je postopek, pri katerem so binarni podatki posredovani preko spremembe frekvence nosilnega signala.';
                case 'pam4':
                    return 'PAM4 je večstopenjski modulacijski signalni format, ki se uporablja za prenos signala.';
                default:
                    return '';
            }
        }
    },
    props: {
        data: {
            type: Array,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        canvas_id: {
            type: String,
            required: true
        },
        is_modulated: {
            type: Boolean,
            required: false,
            default: false
        },
        vertical_pool: {
            type: Array,
            required: false,
            default: null
        },
        type: {
            type: String,
            required: false,
            default: ''
        }
    }
}
</script>