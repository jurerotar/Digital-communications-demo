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
         * @param state
         * @param width {number}
         */
        setWidth: (state, width) => {
            state.width = width;
        },
        /**
         *
         * @param state
         * @param height {number}
         */
        setHeight: (state, height) => {
            state.height = height;
        },
        /**
         * @param state
         * @param position {number}
         */
        toggleMobileSidebar: (state, position) => {
            state.mobileSidebarExtended = position;
        }
    },
    getters: {
        /**
         * Returns boolean indicating whether window width is wider than selected breakpoint
         * @returns {boolean}
         */
        isWideScreen(state) {
            return state.width >= state.breakpoints.lg;
        }
    }
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
                }
            ]
        }
    },
    mutations: {
        /**
         * Pushes a new object to state.canvases array to generate a canvas with a random id
         * @param state
         */
        createCanvas(state) {
            state.canvases.push({
                id: functions.randomNumber(),
                components: 1,
            });
        },
        /**
         * Removes canvas object from state.canvases by id
         * @param state
         * @param id {number}
         */
        removeCanvas(state, id) {
            state.canvases = state.canvases.filter(el => el.id !== id);
        },
        /**
         * Updates amount of signal components in a signal by canvas id
         * @param state {Object}
         * @param id {number}
         * @param amount {number}
         */
        updateAmountOfComponents(state, id, amount) {
            state.canvases.find(el => el.id === id).components = amount;
        }
    },
    getters: {
        /**
         Fouriereva vrsta z
         * @param state {Object}
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
        fourierSeries
    }
});

export default store;