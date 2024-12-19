<script setup lang="ts">
import ChatHeader from './Header.vue';
import ChatMessageList from './MessageList.vue';
import ChatInput from './Input.vue';
import ChatSidebar from './Sidebar.vue';
import { useChat } from '../../composables/chat-room/useChat';

const {
  conversations,
  currentConversation,
  addMessage,
  createNewConversation,
  selectConversation,
  handleFileUpload,
  updateConversationTitle
} = useChat();
</script>

<template>
  <div class="chat-container">
    <ChatSidebar :conversations="conversations" :currentConversation="currentConversation" @select="selectConversation"
      @new="createNewConversation" />
    <div class="chat-main">
      <ChatHeader :title="currentConversation.title" @update:title="updateConversationTitle" />
      <ChatMessageList :messages="currentConversation.messages" />
      <ChatInput @send="addMessage" @upload="handleFileUpload" />
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  position: relative;
  height: 100vh;
  width: 100%;
}

.chat-main {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 800px;
  margin: 0 auto;
  background-color: transparent;
  z-index: 1;
}
</style>
