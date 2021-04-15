<template>
    <h1>{{ title }}</h1>
</template>

<script>
export default {
    name: "MainTitle",
    props: {
        title: {
            type: String,
            required: true
        }
    }
}
</script>

<style scoped>

</style>