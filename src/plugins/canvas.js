const canvas = {
    setup(p5) {
        const [width, height] = [700, 300];
        p5.setup = function() {
            p5.createCanvas(width, height);
        };
    },
};

export default canvas;