<template>
    <button @click="handleBack" class="p-1 flex justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded">
        <Icon name="mdi:arrow-left" class="w-6 h-6 text-black dark:text-white" />
    </button>
</template>

<script setup lang="ts">
const props = defineProps<{
    to?: string
}>()

const router = useRouter()
const navigationHistory = useState<string[]>('navigation-history', () => [])

function handleBack() {
    if (props.to) {
        navigateTo(props.to)
    } else if (navigationHistory.value.length > 1) {
        navigationHistory.value.pop()
        router.back()
    } else {
        // No internal history, force go to home
        window.location.href = '/'
    }
}
</script>