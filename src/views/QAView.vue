<script setup lang="ts">
import ChatContainer from '../components/chat-room/Container.vue';
</script>

<template>
  <main>
    <div class="jagged-bg"></div>
    <ChatContainer />
  </main>
</template>

<style>
@import '../styles/variables.css';
@import '../styles/css/jagged-bg.css';

main {
  width: 100%;
  height: 100%;
}
</style>
