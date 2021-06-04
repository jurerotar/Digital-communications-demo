const functions = {
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
};

export default functions;