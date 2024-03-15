<script setup lang="ts">

defineProps<{ msg: string }>()

</script>

<template>
  <div class="w-full h-screen bg-gray-800 flex justify-center items-center text-white">
    <div class="flex flex-col items-center">
      <h1 class="text-6xl">UI/UX Designer</h1>
      <p class="text-3xl font-bold">{{ msg }}</p>


      <div class="bg-gray-700 border rounded-full px-2 py-1 text-center mt-5">
        Current
      </div>
      <p class="text-base">Student</p>
    </div>
    
  
  
  
  </div>

 
</template>

<style scoped>
</style>
