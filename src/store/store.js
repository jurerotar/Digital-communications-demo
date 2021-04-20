import {createStore} from 'vuex';
import functions from "@/plugins/functions";

/**
 * Application settings
 */
const app = {
    namespaced: true,
    state() {
        return {
            /**
             * Tailwind CSS breakpoints
             */
            breakpoints: {
                sm: 640,
                md: 768,
                lg: 1024,
                xl: 1280
            },
            /**
             * Window inner width
             */
            width: 0,
            /**
             * Window inner Height
             */
            height: 0,
            /**
             * Returns app.mobileSidebarExtended value from the store indicating whether sidebar is extended on mobile
             * @returns {boolean}
             */
            mobileSidebarExtended: false,
        }
    },
    mutations: {
        /**
         *
         * @param {object} state
         * @param {number} width
         */
        setWidth: (state, width) => {
            state.width = width;
        },
        /**
         *
         * @param {object} state
         * @param {number} height
         */
        setHeight: (state, height) => {
            state.height = height;
        },
        /**
         * @param {object} state
         * @param {boolean} position
         */
        toggleMobileSidebar: (state, position) => {
            state.mobileSidebarExtended = position;
        }
    },
    getters: {
        /**
         * Returns boolean indicating whether window width is wider than selected breakpoint
         * @param {object} state
         * @returns {boolean}
         */
        isWideScreen(state) {
            return state.width >= state.breakpoints.lg;
        }
    }
}

/**
 * Spectrum settings
 */
const spectrum = {
    namespaced: true,
    state() {
        return {
            selected: 'sin'
        }
    },
    mutations: {
        /**
         * Sets the selected spectrum in state.selected
         * @param {object} state
         * @param {string} key - possible values: sin, cos, sawtooth, square
         */
        changeSelected(state, key) {
            state.selected = key;
        }
    },
}

/**
 * Fourier series settings
 */
const fourierSeries = {
    namespaced: true,
    state() {
        return {
            /**
             * Each object in this array corresponds to a canvas on the page
             */
            canvases: [
                {
                    id: 1,
                    components: 1,
                    frequency: 0.3,
                    amplitude: 0.7
                }
            ]
        }
    },
    mutations: {
        /**
         * Pushes a new object to state.canvases array to generate a canvas with a random id
         * @param {object} state
         */
        createCanvas(state) {
            state.canvases.push({
                id: functions.randomNumber(),
                components: 1,
                frequency: 0.05,
                amplitude: 80
            });
        },
        /**
         * Removes canvas object from state.canvases by id
         * @param {object} state
         * @param {number} id
         */
        removeCanvas(state, id) {
            state.canvases = state.canvases.filter(el => el.id !== id);
        },
        /**
         * Updates canvas property object by id for given property
         * @param {object} state
         * @param {number} id
         * @param {string} propertyName
         * @param {number} value
         */
        updateProperty(state, id, propertyName, value) {
            state.canvases.find(el => el.id === id)[propertyName] = value;
        },
    },
    getters: {
        /**
         Fouriereva vrsta z
         * @param {object} state
         * @returns {function(number): {components: number, id: number}}
         */
        canvasById: (state) => (id) => {
            return state.canvases.find(el => el.id === id);
        }
    },
    actions: {}
}

const store = createStore({
    modules: {
        app,
        fourierSeries,
        spectrum
    }
});

export default store;