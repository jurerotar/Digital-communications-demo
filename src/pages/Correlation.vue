<template>
    <div class="lg:ml-72">
        <main class="p-4 container lg:mx-auto transition-colors duration-300 dark:bg-gray-800">
            <h1 class="text-3xl font-medium mb-4 transition-colors duration-300 dark:text-white">Korelacijska Funkcija</h1>
            <collapsible>
                <theory-correlation></theory-correlation>
            </collapsible>
        </main>
    </div>
</template>

<script>
    import Collapsible from "@/components/global/Collapsible"
    import TheoryCorrelation from '../components/theory/TheoryCorrelation'

    export default {
        name: "Correlation",
        components: {Collapsible, TheoryCorrelation},

    }
</script>