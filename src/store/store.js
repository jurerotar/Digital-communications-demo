import {createStore} from 'vuex';

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
};

const harmonics = {
    namespaced: true,
    state() {
        return {
            components: 1,
        }
    },
    mutations: {
        /**
         * Sets the components value
         * @param {object} state
         * @param {number} value
         */
        updateAmountOfComponents(state, value) {
            state.components = value;
        },
    }
}


const store = createStore({
    modules: {
        app,
        spectrum,
        harmonics,
    }
});

export default store;