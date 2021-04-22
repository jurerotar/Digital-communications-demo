const canvas = {
    dimensions: {
        width: 700,
        height: 300,
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
        const {width: width, height: height} = this.dimensions;
        p5.setup = () => p5.createCanvas(width, height);
    },
    /**
     * Draws both axis on canvas with defined offset, must be used before any translates
     * @param {object} p5
     * @param {number} offsetX
     * @param {number} offsetY
     */
    drawAxis(p5, offsetX = 0, offsetY = 0) {
        p5.stroke('#ccc');
        p5.strokeWeight(2);
        // Horizontal line from start of canvas to the end
        p5.line(0, offsetY, this.dimensions.width, offsetY);
        // Vertical line from top to bottom
        p5.line(offsetX, 0, offsetX, this.dimensions.height);
        // Restore defaults
        p5.strokeWeight(1);
        p5.stroke(0);
    }
};

export default canvas;