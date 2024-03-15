<script setup lang="ts">

const title = 'The portfolio';
const copyrightText = 'Copyright © 2024 Your Company';
</script>

<template>
    <div class="w-full bg-gray-800 text-white">
      <div class="text-center p-8 text-xl font-bold ">
        <h1>{{ title }}</h1>
      </div>
    <div class="text-center p-4 bg-gray-900">
        <p>{{ copyrightText }}</p>
      </div>
    </div>

  </template>

<style scoped>
</style>
