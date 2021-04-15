const functions = {
    randomNumber: () => {
        return window.crypto.getRandomValues(new Uint32Array(1))[0];
    },
    dft: () => {

    }
}

export default functions;