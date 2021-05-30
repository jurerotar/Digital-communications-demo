/**
 * @typedef {Object} P5
 * @function frameRate
 * @function createCanvas
 */

/**
 * @typedef {Object} Size
 * @property {number} x
 * @property {number} y
 */

const canvas = {
    frameRate: 30,
    /**
     * @type Size
     */
    dimensions: {
        x: 700,
        y: 300,
    },
    colors: [
        '#01FF70',
        '#0074D9',
        '#FF4136',
        '#FF851B',
        '#B10DC9',
        '#7FDBFF',
        '#2ECC40',
        '#001f3f',
        '#F012BE',
    ],
    /**
     * Creates canvas with fixed dimensions
     * @param {P5} p5
     */
    setup(p5) {
        const {x: x, y: y} = this.dimensions;
        const frameRate = this.frameRate;
        p5.setup = () => {
            p5.createCanvas(x, y);
            p5.frameRate(frameRate);
        }
    },
    /**
     * Draws both axis on canvas with defined offset, must be used before any translates
     * @param {object} p5
     * @param {Size} offset
     * @param {Size} dimensions
     */
    drawAxis(p5, offset, dimensions = this.dimensions) {
        p5.stroke(0);
        p5.strokeWeight(2);
        // Horizontal line from start of canvas to the end
        p5.line(0, offset.y, dimensions.x, offset.y);
        // Vertical line from top to bottom
        p5.line(offset.x, 0, offset.x, dimensions.y);
        // Restore defaults
        p5.strokeWeight(1);
        p5.stroke(0);
    },

    /**
     * Draws the lines in provided callback with dashed lines
     * @param {CanvasRenderingContext2D} context
     * @param {function} callback
     */
    drawDashed(context, callback) {
        context.setLineDash([5, 15]);
        callback();
        context.setLineDash([]);
    },
    drawArrow(p5, vectorStart, vectorEnd, color, size = 7, rotate = vectorEnd.heading()) {
        const arrowSize = size;
        p5.push();
        p5.stroke(color);
        p5.fill(color);
        //p5.translate(vectorStart.x, vectorStart.y);
        p5.line(vectorStart.x, vectorStart.y, vectorEnd.x, vectorEnd.y);
        p5.rotate(rotate);
        p5.translate(vectorEnd.mag() - arrowSize, 0);
        p5.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
        p5.pop();
    },

    /**
     * Returns array of linearly spaced points between startValue and stopValue
     * @param {number} startValue
     * @param {number} stopValue
     * @param {number} cardinality
     * @returns {number[]}
     */
    linearSpace(startValue, stopValue, cardinality) {
        const arr = [];
        const step = (stopValue - startValue) / (cardinality - 1);
        for (let i = 0; i < cardinality; i++) {
            arr.push(startValue + (step * i));
        }
        return arr;
    },

    max(array) {
        let max = array[0];
        for (let i = 1; i < array.length; i++) {
            if (array[i] > max) {
                max = array[i];
            }
        }
        return max;
    }
};

export default canvas;