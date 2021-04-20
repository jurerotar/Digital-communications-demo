<template>
    <details :open="opened" class="mb-4">
        <summary
            class="select-none inline-flex whitespace-nowrap justify-start flex-row items-center
            outline-none cursor-pointer transition-colors duration-300 rounded-md bg-gray-200 py-2 px-4 dark:bg-dark-nav"
        >
            <div class="flex md:inline-flex whitespace-nowrap justify-start flex-row items-center">
                <font-awesome-icon class = "details-icon text-gray-700" :icon = "['fas', 'chevron-right']"></font-awesome-icon>
                <h3 class="dark:text-white ml-2 font-semibold">{{ summary }}</h3>
            </div>
        </summary>
        <div class="my-2 pl-4 ml-4 border-l border-gray-300 border-solid">
            <slot></slot>
        </div>
    </details>
</template>

<script>
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export default {
    name: "Collapsible",
    components: {
        FontAwesomeIcon
    },
    props: {
        opened: {
            type: Boolean,
            required: false,
            default: false,
        },
        summary: {
            type: String,
            required: false,
            default: 'Razlaga dogajanja'
        }
    }
}
</script>

<style>
details summary::marker {
    display: none;
}
details[open] > summary .details-icon {
    transform: rotate(90deg);
}
</style>