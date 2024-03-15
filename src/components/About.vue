<script setup lang="ts">

defineProps<{ firstP: string, secondP: string }>()

</script>

<template>

    <div class="w-full bg-neutral-100">
        <div class=" text-6xl p-8 font-bold text-neutral-900" id="about">
            <h1>About Me</h1>

        </div>


        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-10">
            <div class="text-lg">
                <p class="mb-4">{{ firstP }}</p>
                <p>{{ secondP }}</p>
            </div>
            <div class="grid grid-cols-2 gap-4 md:gap-8">
                <img src="../assets/2.jpg" alt="Image 1" class="rounded-lg shadow-md" loading="lazy">
                <img src="../assets/3.jpg" alt="Image 2" class="rounded-lg shadow-md">
                <img src="../assets/4.jpg" alt="Image 3" class="rounded-lg shadow-md">
                <img src="../assets/5.jpg" alt="Image 4" class="rounded-lg shadow-md">
            </div>
        </div>
    </div>
</template>

<style scoped></style>
