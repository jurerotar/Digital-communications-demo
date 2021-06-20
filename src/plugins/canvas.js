import '../types';
import store from '../store/store';

const canvas = {
    frameRate: 30,
    canvasPadding: 50,
    /** @type {Coordinates} */
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
    darkModeBackgroundColor: '#1F2937',
    lightModeBackgroundColor: '#ffffff',
    darkModeScaleColor: '#ffffff',
    lightModeScaleColor: '#000000',
    /**
     * Creates canvas with fixed dimensions
     * @param {P5} p5
     * @param {object} options
     */
    setup(p5, options = {}) {
        const {x: x, y: y} = this.dimensions;
        const frameRate = Object.prototype.hasOwnProperty.call(options, 'frameRate') ? options.frameRate : this.frameRate;
        p5.setup = () => {
            p5.createCanvas(x, y);
            p5.frameRate(frameRate);
            p5.textFont('Montserrat');
        }
    },
    /**
     * Draws both axis on canvas with defined offset, must be used before any translates
     * @param {P5} p5
     * @param {Coordinates} offset
     * @param {Coordinates} dimensions
     */
    drawAxis(p5, offset, dimensions = this.dimensions) {
        this.temporaryState(p5, () => {
            p5.stroke(this.scale());
            p5.strokeWeight(2);
            // Horizontal line from start of canvas to the end
            p5.line(0, offset.y, dimensions.x, offset.y);
            // Vertical line from top to bottom
            p5.line(offset.x, 0, offset.x, dimensions.y);
        });
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
    /**
     *
     * @param {P5} p5
     * @param {function} callback
     */
    temporaryState(p5, callback) {
        p5.push();
        callback();
        p5.pop();
    },
    /**
     *
     * @param {P5} p5
     * @param {Vector} vectorStart
     * @param {Vector} vectorEnd
     * @param {string|number} color - hex or int[0, 255]
     * @param {number} size - pixels
     * @param {number} rotate - in radians
     */
    drawArrow(p5, vectorStart, vectorEnd, color, size = 7, rotate = 0) {
        this.temporaryState(p5, () => {
            p5.push();
            p5.stroke(color);
            p5.fill(color);
            p5.line(vectorStart.x, vectorStart.y, vectorEnd.x, vectorEnd.y);
            p5.rotate(rotate);
            p5.translate(vectorEnd.x, vectorEnd.y);
            p5.triangle(0, size / 2, 0, -size / 2, size, 0);
            p5.pop();
        });
    },
    /**
     *
     * @param {P5} p5
     * @param {Vector} vectorStart
     * @param {Vector} vectorEnd
     */
    drawArrow1(p5, vectorStart, vectorEnd) {
        this.temporaryState(p5, () => {
            const arrowSize = 7;
            p5.translate(vectorStart.x, vectorStart.y);
            p5.line(0, 0, vectorEnd.x, vectorEnd.y);
            p5.rotate(vectorEnd.heading());
            p5.translate(vectorEnd.mag() - arrowSize, 0);
            p5.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
        });
    },
    background(scheme = store.state.app.scheme) {
        return (scheme === 'dark') ? this.darkModeBackgroundColor : this.lightModeBackgroundColor;
    },
    scale(scheme = store.state.app.scheme) {
        return (scheme === 'dark') ? this.darkModeScaleColor : this.lightModeScaleColor;
    },
    widerLine(p5, x1, y1, x2, y2, weight = 2) {
        this.temporaryState(p5, () => {
            p5.strokeWeight(weight);
            p5.line(x1, y1, x2, y2);
        })
    }
};

export default canvas;
