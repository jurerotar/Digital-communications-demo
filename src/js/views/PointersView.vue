<template>
  <AppMainContainer>
    <AppMainHeading>
      Kazalci
    </AppMainHeading>
    <AppCollapsible>
      <theory-pointer />
    </AppCollapsible>
    <CanvasContainer>
      <div :id="canvasId" />
    </CanvasContainer>
  </AppMainContainer>
</template>

<script>
import AppMainContainer from "@/js/components/common/AppMainContainer.vue";
import P5 from 'p5';
import CanvasContainer from "@/js/components/common/AppCanvasContainer.vue";
import TheoryPointer from "@/js/components/theory/TheoryPointer.vue";
import {linearSpace} from "@/js/helpers/functions";
import AppMainHeading from "@/js/components/common/AppMainHeading.vue";
import AppCollapsible from "@/js/components/common/AppCollapsible.vue";

export default {
  name: "PointersView",
  components: {AppMainContainer, AppCollapsible, AppMainHeading, TheoryPointer, CanvasContainer},
  data() {
    return {
      p5: null,
      canvasId: 'canvas-pointers',
      context: null,
      /**
       * @type {Coordinates}
       */
      offset: {
        x: 150,
        y: 150
      },
      /**
       * @type {Coordinates}
       */
      dimensions: {
        x: 800,
        y: 800
      },
      /**
       * @type {Text[]}
       */
      texts: [
        {
          text: 'Im',
          x: 115,
          y: 15,
        },
        {
          text: 'Re',
          x: 315,
          y: 140,
        },
        {
          text: 'j',
          x: 160,
          y: 15,
        },
        {
          text: '1',
          x: 295,
          y: 170,
        },
        {
          text: '- j',
          x: 155,
          y: 300,
        },
        {
          text: '-1',
          x: 5,
          y: 170,
        },
        {
          text: '360\xB0',
          x: 660,
          y: 170,
        },
        {
          text: '0\xB0',
          x: 430,
          y: 170,
        },
        {
          text: '0\xB0',
          x: 155,
          y: 480,
        },
        {
          text: '360\xB0',
          x: 155,
          y: 650,
        },
        {
          text: 'Φ',
          x: 720,
          y: 170,
        },
        {
          text: 'Φ',
          x: 155,
          y: 700,
        },

      ]
    }
  },
  mounted() {
    // Returns array of sine and cosine wave points
    const sineValues = linearSpace(0, 2 * Math.PI, 200).map(el => Math.sin(el));
    const cosineValues = linearSpace(0, 2 * Math.PI, 200).map(el => Math.cos(el));
    let time = 0;
    let cosHorizontal = 0;
    let sinHorizontal = 0;
    // Initiate new P5 instance and create canvas
    this.p5 = new P5((p5) => {
      p5.setup = () => {
        p5.createCanvas(this.dimensions.x, this.dimensions.y);
        p5.frameRate(30);
      }

      p5.draw = () => {
        const color = this.$c.scale();
        const canvasPadding = this.$c.canvasPadding;
        const radius = 100 * (4 / Math.PI);
        // Add context to allow custom canvas transformations
        this.context = document.querySelector(`#${this.canvasId} canvas`).getContext('2d');
        p5.background(this.$c.background());

        p5.fill(0);
        p5.strokeWeight(1);

        this.$c.temporaryState(p5, () => {
          p5.stroke(color);
          p5.fill(color);
          p5.triangle(150, -1, 145, 11, 155, 11);
          p5.triangle(801, 150, 790, 145, 790, 155);
          p5.triangle(150, 800, 145, 790, 155, 790);
          p5.triangle(330, 150, 320, 145, 320, 155);
        });

        this.$c.temporaryState(p5, () => {
          p5.stroke(color);
          p5.strokeWeight(0.5);
          p5.textSize(14);
          p5.fill(color)
          this.texts.forEach(el => p5.text(el.text, el.x, el.y));
          this.$c.drawAxis(p5, this.offset, this.dimensions);
        });


        this.$c.temporaryState(p5, () => {
          p5.stroke(color);
          p5.strokeWeight(5);
          p5.stroke(this.$c.background());
          p5.line(this.offset.x * 2 + 31, this.offset.y, this.offset.x * 2 + 70, this.offset.y);
          p5.line(this.offset.x, this.offset.y * 2 + 31, this.offset.x, this.offset.y * 2 + 70);
        })

        this.$c.drawDashed(this.context, () => {
          p5.stroke(color);
          p5.line(277, 0, 277, this.dimensions.y);
          p5.line(0, 277, this.dimensions.x, 277);
          p5.line(23, 0, 23, this.dimensions.y);
          p5.line(0, 23, this.dimensions.x, 23);
        });

        // Moves the middle of the circle
        p5.translate(150, 150);
        p5.strokeWeight(3);

        // Calculates the coordinates x and y(points on the circle)
        const x = radius * Math.cos(Math.PI * time);
        const y = -radius * Math.sin(Math.PI * time);

        p5.stroke(this.$c.colors[1]);
        p5.noFill();

        // Initializes the circle at the starting point
        p5.ellipse(0, 0, radius * 2);

        // Draws a pointer
        this.$c.drawArrow1(p5, p5.createVector(0, 0), p5.createVector(x, y));

        p5.stroke(this.$c.colors[0]);

        // Draws a sine wave with elements and indexes from linearSpace function and moves it
        p5.translate(200, 0);
        p5.beginShape();
        sineValues.forEach((el, index) => p5.vertex(index + 2 * canvasPadding, -el * radius));
        p5.endShape();

        // Calculates vertical components
        const sinVertical = -Math.sin(Math.PI * time) * radius;

        // Moves horizontal component until it hits 200
        sinHorizontal++;
        // Defines the length of sine wave(one period is the same as cardinality in linearSpace function)
        sinHorizontal %= 200;

        p5.ellipse(sinHorizontal + canvasPadding * 2, sinVertical, 15, 15);

        this.$c.drawDashed(this.context, () => {
          // Connect current x,y coordinates to sine graph
          p5.line(x - 200, y, sinHorizontal + canvasPadding * 2, sinVertical);
        });

        p5.stroke(this.$c.colors[2]);
        // Draws a cosine wave with elements and index form lineSpace function and moves it
        p5.translate(-200, 200);
        p5.beginShape();
        cosineValues.forEach((el, index) => p5.vertex(el * radius, index + 2 * canvasPadding));
        p5.endShape();

        // Calculates vertical components
        const cosVertical = Math.cos(Math.PI * time) * (radius);
        // Moves horizontal component till it hits 200
        cosHorizontal++;
        // Defines the length of cosine wave(one period is the same as cardinality in lineSpace function
        cosHorizontal %= 200;

        p5.ellipse(cosVertical, cosHorizontal + 2 * canvasPadding, 15, 15);

        this.$c.drawDashed(this.context, () => {
          // Connect current x,y coordinates to cosine graph
          p5.line(x, y - 200, cosVertical, cosHorizontal + canvasPadding * 2);
        });

        time += 0.01;
      };
      p5.removeCanvas = () => p5.remove();
    }, this.canvasId);
  },
  unmounted() {
    this.p5.removeCanvas();
  }
}
</script>
