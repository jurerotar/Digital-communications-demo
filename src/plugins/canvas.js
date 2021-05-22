/**
 * @typedef {Object} P5
 * @method frameRate
 * @method createCanvas
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
        y: 250,
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
    configureText(p5) {
        p5.textSize(18);
        p5.fill(0);
        p5.textFont('Montserrat');
    },
    /**
     * Draws both axis on canvas with defined offset, must be used before any translates
     * @param {Object} p5
     * @param {Object|null} verticalPool
     */
    drawAxisOnSide(p5, verticalPool = null) {
        const {y: y} =  this.dimensions
        const scaleOffset = 20;
        p5.stroke('#ccc');
        p5.strokeWeight(2);

        this.drawAxis(p5, {
            x: scaleOffset,
            y: y / 2
        });

        // Restore defaults
        p5.strokeWeight(1);
        p5.stroke(0);
        // Move chart right to create space for scale
        p5.translate(scaleOffset, 0);
        this.configureText(p5);
        // Always show 0 in the middle
        p5.text(0, -scaleOffset + 2, y/2 + 6);
        if (verticalPool !== null) {
            switch (verticalPool.length) {
                // If pool has only 1 number, show it on the top
                case 1:
                    p5.text(verticalPool[0], -scaleOffset, 14);
                    break;
                // If pool has 2 numbers, show it on top and bottom
                case 2:
                    p5.text(verticalPool[0], -scaleOffset, 14);
                    p5.text(verticalPool[1], -scaleOffset, y - 3);
                    break;
                // If pool has 4 numbers, distribute them equally
                case 4:
                    p5.text(verticalPool[0], -scaleOffset, 14);
                    p5.text(verticalPool[1], -scaleOffset, 75);
                    p5.text(verticalPool[2], -scaleOffset, 180);
                    p5.text(verticalPool[3], -scaleOffset, y - 3);
                    break;
            }
        }
    },
    drawAxisInMiddle(p5) {
        const {x: x, y: y} = this.dimensions
        p5.stroke('#ccc');
        p5.strokeWeight(2);

        this.drawAxis(p5, {
            x: x / 2,
            y: y / 2
        });

        // Restore defaults
        p5.strokeWeight(1);
        p5.stroke(0);

        this.configureText(p5);

        p5.text(0, x/2 + 10, y/2 + 20);
        p5.text(' 1', x / 2 + 10, 14);
        p5.text('-1', x / 2 + 10, y - 3);
    },
    spectrumAxis(p5, max = 0) {
        const {y: y} =  this.dimensions
        const scaleOffset = 40;
        p5.stroke('#ccc');
        p5.strokeWeight(2);

        this.drawAxis(p5, {
            x: scaleOffset,
            y: y - 5
        });

        // Restore defaults
        p5.strokeWeight(1);
        p5.stroke(0);

        this.configureText(p5);

        p5.text(max, 2, 14);
        p5.text('0', 2, y - 3);
        p5.text('X[f]', 50, 14);
        p5.text('f', this.dimensions.x - 20, this.dimensions.y - 20);
    },
    /**
     * Draws both axis on canvas with defined offset, must be used before any translates
     * @param {object} p5
     * @param {Size} offset
     * @param {Size} dimensions
     */
    drawAxis(p5, offset, dimensions = this.dimensions) {
        p5.stroke('#ccc');
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
    drawArrow(p5, vectorStart, vectorEnd, color, size = 7) {
        const arrowSize = size;
        p5.push();
        p5.stroke(color);
        p5.fill(color);
        p5.translate(vectorStart.x, vectorStart.y);
        p5.line(0, 0, vectorEnd.x, vectorEnd.y);
        p5.rotate(vectorEnd.heading());
        p5.translate(vectorEnd.mag() - arrowSize, 0);
        p5.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
        p5.pop();
    },
};

export default canvas;