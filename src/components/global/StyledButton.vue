<template>
    <button class = "text-white font-bold py-2 px-4 rounded outline-none duration-300 transition-colors h-12" :class = "colors">
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: "StyledButton",
    computed: {
        colors() {
            switch(this.color) {
                case 'green':
                    return 'bg-green-500 hover:bg-green-600'
                case 'red':
                    return 'bg-red-500 hover:bg-red-600';
                default:
                    return 'bg-blue-500 hover:bg-blue-600';
            }
        }
    },
    props: {
        color: {
            type: String,
            required: false,
            default: 'blue'
        }
    }
}
</script>