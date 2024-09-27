<template>
  <div class="content-center w-full">
    <div class="flex flex-col content-center items-center justify-center min-h-screen p-4 bg-gray-100">
      <a href="/" class="mb-8">
        <h1 class="text-4xl font-bold text-purple-600 hover:text-purple-700 transition-colors">Farlands Chat</h1>
      </a>
      <p class="text-center text-gray-700 mb-6">
        Farlands Chat is a secure messaging service
      </p>
      <ul class="list-disc list-inside text-left mb-6">
        <li class="mb-2">Message contents and user handles are encrypted by the chat key, as a result <strong>anyone who you give the chat key to will have access to that chat</strong>.</li>
        <li class="mb-2">Messages are polled at random, and decoy messages are regularly sent to mitigate time-sync attacks. <strong>Minor delay in seeing messages is an intentional security feature</strong>.</li>
        <li class="mb-2">All messages are transient, the server never writes messages to the disk and it destroys messages after sixty seconds. <strong>When all participants leave, chat history will be gone</strong>.</li>
        <li class="mb-2">To keep attack surface small and avoid the potential for XSS, there is <strong>no text formatting in messages</strong>.</li>
        <li>User handles are a convenience feature and should not be used as authentication. <strong>People can copy each other's handles</strong>.</li>
      </ul>

      <div class="flex items-left content-left mb-4">
        <input
          v-model="chatKey"
          @keyup.enter="goToChat"
          @keydown="clearChatKeyError"
          placeholder="Enter Chat Key"
          class="p-2 border border-gray-300 rounded-md shadow-sm mr-2 max-w-sm"
        />
        <span 
          v-if="chatKeyError" 
          class="flex items-center p-2 text-red-700 bg-red-100 border border-red-400 rounded"
        >
          {{ chatKeyError }}
        </span>
      </div>
      
      <button @click="goToChat" class="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors mb-2">
        Enter Room
      </button><br/>
      <h2 class="text-2xl font-semibold mb-4">Or...</h2>
      <button @click="goToPublic" class="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors mb-2">
        Enter The Public Room
      </button>
      <button @click="newChat" class="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors">
        New Room
      </button>
    </div>
  </div>
</template>

<script>
/*Copyright (C) 2024 Faissal Bensefia

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.*/
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { generateRandomChatKey, nullChatKey, isValidChatKey } from 'farlandslib';

export default {
  setup() {
    const chatKey = ref('');
    const chatKeyError = ref('');
    const router = useRouter();

    const clearChatKeyError = () => {
      chatKeyError.value = '';
    };

    const goToChat = () => {
      if (isValidChatKey(chatKey.value)) {
        router.push(`/chat/${chatKey.value}`);
      } else {
        chatKeyError.value = 'Not a valid chat key';
      }
    };

    const goToPublic = () => {
      router.push(`/chat/${nullChatKey}`);
    };

    const newChat = () => {
      router.push(`/chat/${generateRandomChatKey()}`);
    };

    return {
      chatKey,
      chatKeyError,
      clearChatKeyError,
      goToChat,
      goToPublic,
      newChat
    };
  }
};
</script>

<style scoped>
</style>
