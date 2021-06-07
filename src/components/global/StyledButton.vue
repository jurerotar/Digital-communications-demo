<template>
    <button class = "text-white w-fit-content font-bold py-2 px-4 mb-2 mr-2 rounded focus:outline-none outline-none duration-300 transition-colors h-12 whitespace-nowrap">
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: "StyledButton",
}
</script>