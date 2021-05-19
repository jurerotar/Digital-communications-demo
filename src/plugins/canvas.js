const canvas = {
    frameRate: 30,
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
     * @param {object} p5
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
     * @param {Object} p5
     * @param {Object|null} verticalPool
     */
    drawAxisOnSide(p5, verticalPool = null) {
        const {x: x, y: y} =  this.dimensions
        const scaleOffset = 20;
        p5.stroke('#ccc');
        p5.strokeWeight(2);

        // Horizontal line from start of canvas to the end
        p5.line(scaleOffset, y / 2, x, y / 2);
        // Vertical line from top to bottom
        p5.line(scaleOffset, 0, scaleOffset, y);

        // Restore defaults
        p5.strokeWeight(1);
        p5.stroke(0);
        // Move chart right to create space for scale
        p5.translate(scaleOffset, 0);
        p5.textSize(18);
        p5.fill(0);
        p5.textFont('Montserrat');
        p5.text(0, -scaleOffset + 2, y/2 + 6);
        if (verticalPool !== null) {
            switch (verticalPool.length) {
                case 1:
                    p5.text(verticalPool[0], -scaleOffset, 14);
                    break;
                case 2:
                    p5.text(verticalPool[0], -scaleOffset, 14);
                    p5.text(verticalPool[1], -scaleOffset, y - 3);
                    break;
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

        // Horizontal line from start of canvas to the end
        p5.line(0, y / 2, x, y / 2);
        // Vertical line from top to bottom
        p5.line(x/ 2, 0, x / 2, y);

        // Restore defaults
        p5.strokeWeight(1);
        p5.stroke(0);
        // Move chart right to create space for scale
        p5.textSize(18);
        p5.fill(0);
        p5.textFont('Montserrat');
        p5.text(0, x/2 + 10, y/2 + 20);
        p5.text(' 1', x / 2 + 10, 14);
        p5.text('-1', x / 2 + 10, y - 3);
    },
    spectrumAxis(p5, max = 0) {
        const {x: x, y: y} =  this.dimensions
        const scaleOffset = 40;
        p5.stroke('#ccc');
        p5.strokeWeight(2);

        // Horizontal line from start of canvas to the end
        p5.line(scaleOffset, y - 5, x, y - 5);
        // Vertical line from top to bottom
        p5.line(scaleOffset, 0, scaleOffset, y);


        // Restore defaults
        p5.strokeWeight(1);
        p5.stroke(0);

        p5.textSize(18);
        p5.fill(0);
        p5.textFont('Montserrat');
        p5.text(max, 2, 14);
        p5.text('0', 2, y - 3);
        p5.text('X[f]', 50, 14);
        p5.text('f', this.dimensions.x - 20, this.dimensions.y - 20);
    },
    /**
     * Draws both axis on canvas with defined offset, must be used before any translates
     * @param {object} p5
     * @param {Object} offset
     * @param {Object} dimensions
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
    }
};

export default canvas;