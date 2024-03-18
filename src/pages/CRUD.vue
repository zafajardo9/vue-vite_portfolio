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
                            <button @click="openModal(item._id)" class="bg-gray-600 text-white px-4 py-2">Edit</button>
                            <button @click="deletePortfolioItem(item._id)"
                                class="bg-red-600 text-white px-4 py-2">Delete</button>
                        </td>




                        <div v-if="isModalOpen"
                            class="modal fixed z-10 top-0 left-0 w-full h-full flex items-center justify-center">
                            <div class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>

                            <div
                                class="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
                                <!-- Close button -->
                                <div
                                    class="modal-close absolute top-0 right-0 cursor-pointer size-10 rounded-full flex justify-center bg-red-800 items-center mt-4 mr-4 text-white text-xl z-50">
                                    <span @click="closeModal" class="fill-current">&times;</span>
                                </div>

                                <!-- Modal content -->
                                <div class="modal-content py-4 text-left px-6">
                                    <h2 class="text-2xl font-bold mb-4">Edit Item {{ item._id }}</h2>
                                    <form @submit.prevent="updatePortfolioItem(item._id)" enctype="multipart/form-data">

                                        <!-- Input fields -->
                                        <div class="mb-4">
                                            <label class="block text-gray-700 text-sm font-bold mb-2">Title:</label>
                                            <input v-model="newPortfolio.title"
                                                class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                type="text" required>
                                        </div>
                                        <div class="mb-4">
                                            <label
                                                class="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                                            <input v-model="newPortfolio.description"
                                                class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                type="text">
                                        </div>

                                        <div class="mb-4">
                                            <label class="block text-gray-700 text-sm font-bold mb-2">File:</label>
                                            <input class="mx-2 text-white" type="file" name="imageUrl"
                                                ref="imageUrlInput" accept="image/jpeg, image/png"
                                                @change="handleImageChange" />
                                        </div>

                                        <div class="flex justify-end">
                                            <button type="submit"
                                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Save</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

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



        const openModal = (itemId: string, itemData?: PortfolioItem) => {
            isModalOpen.value = true;
            console.log(itemId, itemData);
        };

        const closeModal = () => {
            isModalOpen.value = false;
        };



        const portfolioItems = ref<PortfolioItem[]>([]);
        const isModalOpen = ref(false);

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
                formData.append('imageUrl', newPortfolio.value.imageUrl as Blob);


                const response = await axios.post<PortfolioItem>(`${apiUrl}/portfolio`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                portfolioItems.value.push(response.data);
                newPortfolio.value.title = '';
                newPortfolio.value.description = '';
                newPortfolio.value.imageUrl = null;
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

        //di naman need
        const startEdit = async (id: string) => {
            try {
                const response = await axios.get<PortfolioItem>(`${apiUrl}/portfolio/${id}`);
                const itemToEdit = response.data;

                // Open the modal with the item's data and ID
                openModal(id, itemToEdit);
            } catch (error) {
                console.error('Error fetching item to edit:', error);
            }
        };

        const updatePortfolioItem = async (id: string) => {
            try {
                const formData = new FormData();
                formData.append('title', newPortfolio.value.title);
                formData.append('description', newPortfolio.value.description);
                formData.append('imageUrl', newPortfolio.value.imageUrl as Blob);

                const response = await axios.put<PortfolioItem>(`${apiUrl}/portfolio/${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                // di naman
                const index = portfolioItems.value.findIndex(item => item._id === id);
                if (index !== -1) {
                    // Replace the item at the found index with the updated item
                    portfolioItems.value.splice(index, 1, response.data);
                }

                //pang clear
                newPortfolio.value.title = '';
                newPortfolio.value.description = '';
                newPortfolio.value.imageUrl = null;
                closeModal();
            } catch (error) {
                console.error('Error updating portfolio item:', error);
            }
        };


        // Handle image change function
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
            handleImageChange,

            startEdit,
            updatePortfolioItem,
            openModal,
            closeModal,
            isModalOpen,
        };
    }
});




</script>

<style scoped></style>