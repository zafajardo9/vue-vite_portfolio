<template>
    <div id="app" class="flex flex-col py-2">
        <div class="flex flex-col mt-20">
            <h1 class="text-2xl text-center">Portfolio Management</h1>
            <div class="">
                <h2>Add Portfolio Item</h2>
                <form @submit.prevent="addPortfolioItem" enctype="multipart/form-data"
                    class="bg-gray-800 text-black px-10 py-10 w-full flex flex-col sm:flex-row items-center">
                    <label class="pr-2 text-white">Title</label>
                    <input class="mx-2" type="text" v-model="newPortfolio.title" required />
                    <label class="pr-2 text-white">Description</label>
                    <input class="mx-2" type="text" v-model="newPortfolio.description" />
                    <label class="pr-2 text-white">Image</label>
                    <input class="mx-2 text-white" type="file" name="imageUrl" ref="imageUrlInput"
                        accept="image/jpeg, image/png" @change="handleImageChange" />

                    <button type="submit" class="bg-green-500 text-white px-10 py-2">Add</button>
                </form>
            </div>
        </div>

        <hr />
        <div class="w-full p-10 h-[60vh] overflow-auto bg-neutral-100">
            <h2 class="font-bold">Portfolio Items</h2>
            <table class="border-collapse w-full">
                <thead>
                    <tr>
                        <th class="border border-gray-300 px-4 py-2">Title</th>
                        <th class="border border-gray-300 px-4 py-2">Description</th>
                        <th class="border border-gray-300 px-4 py-2">Image</th>
                        <th class="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item) in portfolioItems" :key="item._id">
                        <td class="border border-gray-300 px-4 py-2">{{ item.title }}</td>
                        <td class="border border-gray-300 px-4 py-2">{{ item.description }}</td>
                        <td class="border border-gray-300 px-4 py-2">
                            <!-- Ensure the image URL is wrapped in quotes -->
                            <img :src="item.imageUrl" alt="" style="max-width: 100px; max-height: 100px;">
                        </td>
                        <td class="border border-gray-300 px-4 py-2 text-center space-x-3">
                            <button @click="" disabled class="bg-gray-600 text-white px-4 py-2">Edit</button>
                            <button @click="deletePortfolioItem(item._id)"
                                class="bg-red-600 text-white px-4 py-2">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref } from 'vue';
import axios from 'axios';

const apiUrl = 'http://localhost:7000';

interface PortfolioItem {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
}

export default defineComponent({
    setup() {
        const newPortfolio: Ref<{
            title: string;
            description: string;
            imageUrl: File | null;
        }> = ref({
            title: '',
            description: '',
            imageUrl: null
        });

        const portfolioItems = ref<PortfolioItem[]>([]);

        const fetchPortfolioItems = async () => {
            try {
                const response = await axios.get<PortfolioItem[]>(`${apiUrl}/portfolio`);
                portfolioItems.value = response.data;
            } catch (error) {
                console.error('Error fetching portfolio items:', error);
            }
        };

        const addPortfolioItem = async () => {
            try {
                const formData = new FormData();
                formData.append('title', newPortfolio.value.title);
                formData.append('description', newPortfolio.value.description);
                formData.append('imageUrl', newPortfolio.value.imageUrl as Blob); // Cast to Blob


                const response = await axios.post<PortfolioItem>(`${apiUrl}/portfolio`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                portfolioItems.value.push(response.data);
                newPortfolio.value.title = '';
                newPortfolio.value.description = '';
                // Don't need to reset imageUrl as it's a ref
            } catch (error) {
                console.error('Error adding portfolio item:', error);
            }
        };

        const deletePortfolioItem = async (id: string) => {
            try {
                await axios.delete(`${apiUrl}/portfolio/${id}`);
                portfolioItems.value = portfolioItems.value.filter(item => item._id !== id);
            } catch (error) {
                console.error('Error deleting portfolio item:', error);
            }
        };



        const handleImageChange = (event: Event) => {
            const target = event.target as HTMLInputElement;
            if (target.files && target.files.length) {
                newPortfolio.value.imageUrl = target.files[0];
            }
        };

        onMounted(fetchPortfolioItems);

        return {
            newPortfolio,
            portfolioItems,
            addPortfolioItem,
            deletePortfolioItem,
            handleImageChange
        };
    }
});
</script>

<style scoped></style>