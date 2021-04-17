<template>
    <section>
        <h1 class="text-3xl font-medium mb-4">Spekter</h1>
        <div class = "flex flex-col md:flex-row">
            <button class = "text-white w-fit-content font-bold py-2 px-4 mb-2 md:mr-2 rounded outline-none duration-300 transition-colors h-12"
                    :class = "[selected === transformation.key ? 'bg-blue-300' : 'bg-gray-300']"
                    @click = "changeSelected(transformation.key)"
                    v-for = "transformation in transformations" :key = "transformation.id">
                {{transformation.label}}
            </button>
        </div>
    </section>
</template>

<script>
export default {
    name: "Spectrum",
    data() {
        return {
            transformations: [
                {
                    id: 1,
                    label: 'Sinusni',
                    key: 'sin'
                },
                {
                    id: 2,
                    label: 'Kosinusni',
                    key: 'cos'
                },
                {
                    id: 3,
                    label: 'Kvadratni',
                    key: 'square'
                },
                {
                    id: 4,
                    label: 'Žagasti',
                    key: 'sawtooth'
                },
            ]
        }
    },
    computed: {
        selected() {
            return this.$store.state.spectrum.selected;
        }
    },
    methods: {
        /**
         * Sets spectrum type in the store
         * @param key {string} - possible values: sin, cos, sawtooth, square
         */
        changeSelected(key) {
            this.$store.commit('spectrum/changeSelected', key);
        }
    }
}
</script>
