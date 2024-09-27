<template>
  <div class="flex flex-col items-center h-screen p-4 bg-gray-100">
    <a href="/" class="mb-8">
      <h1 class="text-4xl font-bold text-purple-600 hover:text-purple-700 transition-colors">Farlands Chat</h1>
    </a>
    <div class="mb-4">
      <span class="group p-2 cursor-pointer text-gray-400" @click="copyChatKey">
        <span class="block text-gray-500 transition-opacity group-hover:hidden">Click here to copy chat key, hover to view chat key</span>
        <span class="hidden opacity-0 group-hover:opacity-100 group-hover:block transition-opacity text-purple-500">{{ chatKey }}</span>
      </span>
    </div>

    <div class="mb-4 w-full">
      <input
        class="p-2 border border-gray-300 rounded-md shadow-sm mb-2 w-1/4 inline"
        placeholder="User handle"
        v-model="userHandle"
      />
      <input
        class="p-2 border border-gray-300 rounded-md shadow-sm w-3/4 inline"
        placeholder="Type your message..."
        v-model="newMessage"
        @keyup.enter="sendMessage"
      />
    </div>
    
    <div class="w-full h-screen text-left p-4 bg-white border border-gray-300 rounded-md shadow-sm mb-4 overflow-y-auto">
      <div v-for="message in messages" :key="message.timestamp" class="message mb-2">
        <span class="unix-timestamp font-mono text-gray-500">{{ message.timestamp }}</span>
        <span class="user-id font-semibold text-purple-600 ml-2">{{ message.userId }}</span>
        <span class="ml-2">{{ message.message }}</span>
      </div>
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
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import { useRoute } from 'vue-router';
import { 
  getRandomInteger, 
  generateRandomEncryptedMessage, 
  encryptMessage, 
  parseChatKey, 
  decryptMessage,
  getCurrentUnixTimestamp
} from 'farlandslib';

export default {
  setup() {
    const route = useRoute(); // For accessing the route object
    const chatKey = route.fullPath.match(/\/chat\/(.*)/)[1];
    
    const defaultUserId = uuidv4();
    const newMessage = ref('');
    const userHandle = ref('');
    const messages = ref([]);
    const lastTimestamp = ref(0);
    const pollingInterval = ref(null);
    const decoyInterval = ref(null);
    const pollrate = 10000;
    const decoyrate = 10000;

    const copyChatKey = () => {
      navigator.clipboard.writeText(chatKey);
    };

    const pollMessages = async () => {
      try {
        const response = await axios.get('http://localhost:3000/getMessage', {
          params: {
            chatId: parseChatKey(chatKey)[0],
            timestamp: lastTimestamp.value
          }
        });
        
        const newMessageData = response.data;
        try {
          const message = decryptMessage(newMessageData, chatKey);
          messages.value = [message, ...messages.value];
        } catch (error) {
          // This message was either a decoy (impossibly rare) or an interloper using the same channel
        }
        if (newMessageData.timestamp) {
          lastTimestamp.value = newMessageData.timestamp;
        }
        
      } catch (error) {
        console.error('Error polling messages:', error);
      }
    };

    const sendDecoy = async () => {
      try {
        await axios.post('http://localhost:3000/postMessage', generateRandomEncryptedMessage());
        console.log("Decoy sent successfully!");
      } catch (error) {
        console.error('Error sending decoy:', error);
      }
    };

    const startPolling = () => {
      pollingInterval.value = setInterval(pollMessages, getRandomInteger(0, pollrate));
    };

    const startDecoys = () => {
      decoyInterval.value = setInterval(sendDecoy, getRandomInteger(0, decoyrate));
    };

    const sendMessage = async () => {
      if (newMessage.value.trim()) {
        try {
          await axios.post('http://localhost:3000/postMessage', encryptMessage(userHandle.value.trim() ? userHandle.value.trim() : defaultUserId, newMessage.value, chatKey));
          newMessage.value = '';
          console.log("Message sent successfully!");
        } catch (error) {
          console.error('Error sending message:', error);
        }
      }
    };

    onMounted(() => {
      startPolling();
      startDecoys();
    });

    onBeforeUnmount(() => {
      clearInterval(pollingInterval.value);
      clearInterval(decoyInterval.value);
    });

    return {
      chatKey,
      newMessage,
      userHandle,
      messages,
      copyChatKey,
      sendMessage
    };
  }
};
</script>

<style scoped>

</style>
