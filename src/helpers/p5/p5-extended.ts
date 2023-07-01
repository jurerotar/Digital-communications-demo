import p5 from 'p5';
import {Mark, Scheme, Size} from "@interfaces/common";
import {shortenVector} from "@helpers/math";

type P5ExtendedOptions = {
  containerId: string;
  animationFrameRate?: number;
  canvasSize?: Size;
};

type DrawWithOptions = {
  stroke?: string;
  strokeWeight?: number;
  textSize?: number;
};

const DEFAULT_OPTIONS: P5ExtendedOptions = {
  containerId: 'canvas',
  animationFrameRate: 30,
  canvasSize: {
    width: 700,
    height: 300,
  }
}

export class p5Extended extends p5 {
  public canvasPadding: number = 50;
  public canvasSize: Size;
  public darkModeBackgroundColor: string = '#1F2937';
  public lightModeBackgroundColor: string = '#ffffff';
  public darkModeShapeColor: string = '#ffffff';
  public lightModeShapeColor: string = '#000000';
  public colors = [
    '#01FF70',
    '#0074D9',
    '#FF4136',
    '#FF851B',
    '#B10DC9',
    '#7FDBFF',
    '#2ECC40',
    '#001f3f',
    '#F012BE',
  ];

  constructor(sketch: (p: p5Extended) => void, options: P5ExtendedOptions = DEFAULT_OPTIONS) {
    const mergedOptions: P5ExtendedOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
    }

    const sketchWithSetup = (p: p5Extended) => {
      p.setup = () => {
        p.createCanvas(mergedOptions.canvasSize!.width, mergedOptions.canvasSize!.height);
        p.frameRate(mergedOptions.animationFrameRate!);
        p.textFont('Montserrat');
        p.disableFriendlyErrors = true;
      };
      sketch(p);
    }

    super(sketchWithSetup, mergedOptions.containerId as unknown as HTMLElement);
    this.canvasSize = mergedOptions.canvasSize!;
  }

  /**
   * Creates a temporary drawing context, executes callback, returns to previous context
   */
  public temporaryState = (callback: () => void) => {
    this.push();
    callback();
    this.pop();
  }

  /**
   * Draws the shapes in provided callback with dashed lines
   */
  public drawDashed = (callback: () => void) => {
    this.temporaryState(() => {
      this.drawingContext.setLineDash([5, 15]);
      callback();
    });
  }

  /**
   * Draws the shapes in provided callback with provided options
   */
  public drawWith = (options: DrawWithOptions, callback: () => void) => {
    const {stroke, strokeWeight, textSize} = options;
    this.temporaryState(() => {
      // Object.keys(options).forEach((option: DrawWithOptionsProperty) => {
      //   if (options[option]) {
      //     (this as p5Extended)[option] = options[option];
      //   }
      // })
      if (stroke) {
        this.stroke(stroke);
      }
      if (strokeWeight) {
        this.strokeWeight(strokeWeight);
      }
      if (textSize) {
        this.textSize(textSize);
      }
      callback();
    })
  }

  /**
   * Draws a line with arrow at the end
   */
  public arrowLine = (startVector: p5.Vector, endVector: p5.Vector) => {
    const ARROW_SIZE = 7;
    const {x: startX, y: startY} = startVector;

    // We need to shorten the line by percentage represented by arrow size, because arrow is added at the end
    const lineLength = endVector.dist(startVector);
    const percentageRepresentedByArrow = ARROW_SIZE / lineLength;

    const shortenedEndVector = shortenVector(endVector, percentageRepresentedByArrow);
    const {x: shortenedEndX, y: shortenedEndY} = shortenedEndVector;

    this.temporaryState(() => {
      this.line(startX, startY, shortenedEndX, shortenedEndY);
      this.translate(shortenedEndX, shortenedEndY);
      this.rotate(shortenedEndVector.sub(startVector).heading());
      this.triangle(0, ARROW_SIZE / 2, 0, -ARROW_SIZE / 2, ARROW_SIZE, 0);
    });
  }

  /**
   * Loops through the array of marks and fills them
   */
  public drawMarks = (marks: Mark[], shapeColor: string) => {
    this.drawWith({textSize: 14, strokeWeight: 0.5}, () => {
      this.fill(shapeColor);
      marks.forEach((mark: Mark) => this.text(mark.text, mark.x, mark.y));
    })
  }

  /**
   * Returns expected shape color based on current app color scheme
   */
  public getShapeColor = (scheme: Scheme) => {
    return (scheme === 'dark') ? this.darkModeShapeColor : this.lightModeShapeColor;
  }

  /**
   * Returns expected canvas background color based on current app color scheme
   */
  public getBackgroundColor = (scheme: Scheme) => {
    return (scheme === 'dark') ? this.darkModeBackgroundColor : this.lightModeBackgroundColor;
  }
}