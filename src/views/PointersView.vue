<template>
  <AppMainContainer>
    <AppMainHeading>
      Kazalci
    </AppMainHeading>
    <AppCollapsible>
      <theory-pointer/>
    </AppCollapsible>
    <CanvasContainer>
      <div :id="canvasContainerId"/>
    </CanvasContainer>
  </AppMainContainer>
</template>

<script setup lang="ts">
import AppMainContainer from "@components/common/AppMainContainer.vue";
import CanvasContainer from "@components/common/AppCanvasContainer.vue";
import TheoryPointer from "@components/theory/TheoryPointer.vue";
import AppMainHeading from "@components/common/AppMainHeading.vue";
import AppCollapsible from "@components/common/AppCollapsible.vue";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {p5Extended} from "@helpers/p5-extended";
import {State} from "@stores/store";
import {Scheme} from "@interfaces/common";
import {useStore} from "vuex";
import {useCircularFunctionsValues} from "@composables/use-circular-functions-values";

const canvasContainerId = 'canvas-pointers';

const p5ExtendedRef = ref<p5Extended | null>(null);

const store = useStore<State>();
const scheme = computed<Scheme>(() => store.state.appState.scheme);

const marks = [
  {text: 'Im', x: 115, y: 15,},
  {text: 'Re', x: 315, y: 140,},
  {text: 'j', x: 160, y: 15,},
  {text: '1', x: 295, y: 170,},
  {text: '- j', x: 155, y: 300,},
  {text: '-1', x: 5, y: 170,},
  {text: '360\xB0', x: 750, y: 130,},
  {text: '0\xB0', x: 380, y: 170,},
  {text: '0\xB0', x: 160, y: 415,},
  {text: '360\xB0', x: 160, y: 770,},
  {text: 'Φ', x: 790, y: 170,},
  {text: 'Φ', x: 160, y: 800,},
];

const { sineValues, cosineValues } = useCircularFunctionsValues();

onMounted(() => {
  // Will loop between 0-360
  let degree = 0;

  p5ExtendedRef.value = new p5Extended((p5) => {
    const radius = 100 * (4 / Math.PI);
    const centerOffset = 150;

    p5.draw = () => {
      const shapeColor = p5.getShapeColor(scheme.value);
      const backgroundColor = p5.getBackgroundColor(scheme.value);
      const canvasPadding = p5.canvasPadding;
      // Calculates the coordinates x and y(points on the circle)
      const x = radius * cosineValues[degree];
      const y = -radius * sineValues[degree];

      p5.background(backgroundColor);
      p5.stroke(shapeColor);
      p5.noFill();

      // Marks
      p5.drawWith({textSize: 14, strokeWeight: 0.5}, () => {
        p5.fill(shapeColor)
        marks.forEach(el => p5.text(el.text, el.x, el.y));
      });

      // Axis
      p5.drawWith({strokeWeight: 2}, () => {
        p5.line(0, centerOffset, p5.dimensions.x, centerOffset);
        p5.line(centerOffset, 0, centerOffset, p5.dimensions.y);
      });

      // Hide part of the axis
      p5.drawWith({strokeWeight: 5, stroke: backgroundColor}, () => {
        p5.line(centerOffset * 2 + 31, centerOffset, centerOffset * 2 + 70, centerOffset);
        p5.line(centerOffset, centerOffset * 2 + 31, centerOffset, centerOffset * 2 + 70);
      });

      // Axis arrows
      p5.temporaryState(() => {
        p5.fill(shapeColor);
        p5.triangle(150, -1, 145, 11, 155, 11);
        p5.triangle(801, 150, 790, 145, 790, 155);
        p5.triangle(150, 800, 145, 790, 155, 790);
        p5.triangle(330, 150, 320, 145, 320, 155);
      });

      p5.drawDashed(() => {
        p5.line(277, 0, 277, p5.dimensions.y);
        p5.line(0, 277, p5.dimensions.x, 277);
        p5.line(23, 0, 23, p5.dimensions.y);
        p5.line(0, 23, p5.dimensions.x, 23);
      });

      p5.drawWith({strokeWeight: 3}, () => {
        // Circle
        p5.drawWith({stroke: p5.colors[1]}, () => {
          p5.translate(centerOffset, centerOffset);
          // Draw a pointer from middle to radius. The 0.95 multiplier is to make sure arrow fits
          p5.arrowLine(p5.createVector(0, 0), p5.createVector(x * 0.95, y * 0.95));
          p5.ellipse(0, 0, radius * 2);
        });

        // Draws a sine wave with elements and indexes from linearSpace function and moves it
        p5.drawWith({stroke: p5.colors[0]}, () => {
          p5.translate(centerOffset + 150, centerOffset);
          p5.beginShape();
          sineValues.forEach((el, index) => p5.vertex(index + 2 * canvasPadding, -el * radius));
          p5.endShape();
          p5.ellipse(degree + canvasPadding * 2, y, 15, 15);
          p5.drawDashed(() => {
            // Connect current x,y coordinates to sine graph
            p5.line(x - 150, y, degree + canvasPadding * 2, y);
          });
        });

        // Draws a cosine wave with elements and index form lineSpace function and moves it
        p5.drawWith({stroke: p5.colors[2]}, () => {
          p5.translate(centerOffset, centerOffset + 150);
          p5.beginShape();
          cosineValues.forEach((el, index) => p5.vertex(el * radius, index + 2 * canvasPadding));
          p5.endShape();
          p5.ellipse(x, degree + 2 * canvasPadding, 15, 15);
          // Connect current x,y coordinates to cosine graph
          p5.drawDashed(() => {
            p5.line(x, y - 150, x, degree + canvasPadding * 2);
          });
        });
      });

      degree++;
      if(degree === sineValues.length - 1) {
        degree = 0;
      }
    }
  }, {
    containerId: canvasContainerId,
    canvasDimensions: {
      x: 800,
      y: 800,
    },
    animationFrameRate: 60
  })
});

onBeforeUnmount(() => {
  p5ExtendedRef.value!.remove();
})
</script>
