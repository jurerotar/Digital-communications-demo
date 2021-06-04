/**
 * @typedef {Class} P5
 * @method setup
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
    canvasPadding: 50,
    /** @type Size */
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
            p5.textFont('Montserrat');
        }
    },
    /**
     * Draws both axis on canvas with defined offset, must be used before any translates
     * @param {P5} p5
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
    temporaryState(p5, callback) {
        p5.push();
        callback();
        p5.pop();
    },
    /**
     *
     * @param p5
     * @param vectorStart
     * @param vectorEnd
     * @param color
     */
    drawArrow(p5, vectorStart, vectorEnd, color = 0) {
        this.temporaryState(p5, () => {
            const arrowSize = 7;
            p5.strokeWeight(2);
            p5.stroke(color);
            p5.fill(color);
            p5.line(vectorStart.x, vectorStart.y, vectorEnd.x, vectorEnd.y);
            p5.rotate(Math.atan2(vectorStart.y - vectorStart.y, vectorEnd.x - vectorEnd.x) + 10);
            p5.triangle(vectorEnd.x - arrowSize / 2, vectorEnd.y, vectorEnd.x + arrowSize / 2, vectorEnd.y, vectorEnd.x, vectorEnd.y + arrowSize);
        })
    },
};

export default canvas;