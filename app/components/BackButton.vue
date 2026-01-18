<template>
    <button @click="handleBack" class="p-1 flex justify-center items-center hover:bg-gray-100 cursor-pointer">
        <Icon name="mdi:arrow-left" class="w-6 h-6 text-black" />
    </button>
</template>

<script setup lang="ts">
const props = defineProps<{
    to?: string
}>()

const router = useRouter()

function handleBack() {
    if (props.to) {
        router.push(props.to)
    } else {
        router.back()
    }
}
</script>