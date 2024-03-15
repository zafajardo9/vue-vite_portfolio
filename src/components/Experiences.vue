<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const apiUrl = 'http://localhost:7000';

interface PortfolioItem {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
}


const portfolioItems = ref<PortfolioItem[]>([]);

const fetchPortfolioItems = async () => {
    try {
        const response = await axios.get<PortfolioItem[]>(`${apiUrl}/portfolio`);
        portfolioItems.value = response.data;
    } catch (error) {
        console.error('Error fetching portfolio items:', error);
    }
};


onMounted(fetchPortfolioItems);
</script>

<template>
    <div class="w-full h-full bg-neutral-100" id="experiences">
        <div class="text-6xl p-8 font-bold text-neutral-900">
            <h1>Projects</h1>
        </div>



        <div class="flex flex-wrap justify-center">
            <div v-for="(item) in portfolioItems" :key="item._id"
                class="max-w-sm rounded overflow-hidden shadow-lg m-4 bg-white">
                <div class="w-[300px] h-[200px] rounded overflow-hidden m-4"
                    :style="{ backgroundImage: `url('${item.imageUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' }">
                </div>
                <div class="px-6 py-4">
                    <div class="font-bold text-xl mb-2">{{ item.title }}</div>
                    <p class="text-gray-700 text-base">{{ item.description }}</p>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped></style>
