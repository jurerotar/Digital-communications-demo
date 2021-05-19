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
     * @param {number[]} offset
     * @param {number[]} dimensions
     * @param {number[]|null} horizontalPool
     * @param {number[]|null} verticalPool
     */
    drawAxisWithScale(p5, offset, horizontalPool = null, verticalPool = null, dimensions = [this.dimensions.width, this.dimensions.height]) {
        const scaleOffset = 20;
        p5.stroke('#ccc');
        p5.strokeWeight(2);
        // Horizontal line from start of canvas to the end
        p5.line(scaleOffset, offset[1], dimensions[0], offset[1]);
        // Vertical line from top to bottom
        p5.line(offset[0] + scaleOffset, 0, offset[0] + scaleOffset, dimensions[1]);
        // Restore defaults
        p5.strokeWeight(1);
        p5.stroke(0);
        // Move chart right to create space for scale
        p5.translate(scaleOffset, 0);
        p5.textSize(18);
        p5.fill(0);
        p5.textFont('Montserrat');
        p5.text(0, offset[0] - scaleOffset, offset[1] + 6);
        console.log(horizontalPool, verticalPool);
        if(verticalPool !== null) {
            switch(verticalPool.length) {
                case 1:
                    p5.text(verticalPool[0], offset[0] - scaleOffset, 14);
                    break;
                case 2:
                    p5.text(verticalPool[0], offset[0] - scaleOffset, 14);
                    p5.text(verticalPool[1], offset[0] - scaleOffset, dimensions[1]);
                    break;

            }
            // const intervalLength = dimensions[1] / (verticalPool.length - 1);
            // verticalPool.forEach((el, index) => {
            //     p5.text(el, 20, intervalLength * index + 20);
            // });
        }
        // if(horizontalPool !== null && horizontalPool.length > 0) {
        //     const intervalLength = dimensions[0] / horizontalPool.length;
        //     horizontalPool.forEach((el, index) => {
        //         p5.text(el, intervalLength * index + 20, 20);
        //     });
        // }
        // p5.translate(0, -offset[1]);
        // if(verticalPool !== null && verticalPool.length > 0) {
        //     const intervalLength = dimensions[0] / verticalPool.length;
        //     verticalPool.forEach((el, index) => {
        //         p5.text(el, 20, intervalLength * index + 20);
        //     });
        // }
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