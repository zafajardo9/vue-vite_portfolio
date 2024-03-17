<script setup lang="ts">

// document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//     anchor.addEventListener('click', function (e) {
//         e.preventDefault();

//         const targetDiv = document.querySelector(this.getAttribute('href'));
//         if (targetDiv) {
//             targetDiv.scrollIntoView({ behavior: 'smooth' });
//         }
//     });
// });


</script>

<template>
    <nav class="w-full bg-gray-800 p-4 top-0 left-0 fixed">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
            <div class="flex items-center">
                <a @click="$router.push('/')" class="cursor-pointer">
                    <h1 class="text-white text-lg font-semibold">Portfolio</h1>
                </a>

            </div>
            <div class="hidden md:block">
                <div class="flex items-center space-x-4"> <!-- Added items-center -->
                    <ul class="flex space-x-4 ">
                        <li><a href="#" class="text-white hover:text-gray-300">Home</a>
                        </li>
                        <li><a href="#experiences" class="text-white hover:text-gray-300">Projects</a></li>
                        <li><a href="#about" class="text-white hover:text-gray-300">About</a></li>
                        <li><a href="#contact" class="text-white hover:text-gray-300">Contact</a></li>
                        <!-- <li><a @click="$router.push('/')" class="text-white hover:text-gray-300">Contact</a></li> -->
                    </ul>
                    <button @click="$router.push('/crud')"
                        class="text-white bg-gray-700 hover:bg-gray-600 px-3 py-2 transition ease-in duration-300 border rounded-full">Login</button>

                </div>
            </div>
            <div class="md:hidden">
                <!-- Mobile menu button -->
                <button class="text-white focus:outline-none">
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </div>
        </div>
        <!-- Mobile menu -->
        <div class="md:hidden mt-2">
            <ul class="flex flex-col space-y-2">
                <li><a href="#" class="text-white hover:text-gray-300">Home</a></li>
                <li><a href="#" class="text-white hover:text-gray-300">Portfolio</a></li>
                <li><a href="#" class="text-white hover:text-gray-300">About</a></li>
                <li><a href="#" class="text-white hover:text-gray-300">Contact</a></li>
                <li><button disabled>Login</button></li>
            </ul>
        </div>
    </nav>
</template>

<style scoped></style>
