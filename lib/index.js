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
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';
import SHA256 from 'crypto-js/sha256.js';

const generateSHA256Hash = (input) => SHA256(input).toString();
const generateRandomHash = () => generateSHA256Hash(uuidv4());

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRandomString = (minLength, maxLength) => {
  const randomLength = getRandomInteger(minLength, maxLength);

  return Array.from({ length: randomLength }, () => 
    String.fromCharCode(Math.floor(Math.random() * (0x10FFFF + 1))) // Random Unicode character
  ).join('');
};

const parseChatKey = (chatKey) => chatKey.split("#");

const encryptMessage = (userId, message, chatKey) => {
  const [chatId, chatSecret] = parseChatKey(chatKey);
  const encryptedMessage = CryptoJS.AES.encrypt(JSON.stringify({message, userId}), chatSecret).toString()
  
  return {
    chatId,
    message: JSON.stringify({userId, message: encryptedMessage})
  }
}

const decryptMessage = (newMessage, chatKey) => {
  const parsedMessageData = JSON.parse(newMessage.message)
  const timestamp = newMessage.timestamp
  
  const chatSecret = parseChatKey(chatKey)[1]
  const decryptedMessage = JSON.parse(CryptoJS.AES.decrypt(parsedMessageData.message, chatSecret).toString(CryptoJS.enc.Utf8));
  return {timestamp, message: decryptedMessage.message, userId: decryptedMessage.userId}
}

const getCurrentUnixTimestamp = () => Math.floor(Date.now() / 1000);

const maxMessageLength = 10000
const generateRandomEncryptedMessage = () => encryptMessage(uuidv4(), getRandomString(1, maxMessageLength), generateRandomChatKey())

const generateRandomChatKey = () => `${generateRandomHash()}#${generateRandomHash()}`

const nullChatKey = "0000000000000000000000000000000000000000000000000000000000000000#0000000000000000000000000000000000000000000000000000000000000000";
const isValidChatKey = (chatKey) => (new RegExp('^[0-9a-f]{64}#[0-9a-f]{64}$', 'm')).test(chatKey)

export {
  generateSHA256Hash,
  generateRandomHash,
  getRandomInteger,
  getRandomString,
  generateRandomChatKey,
  generateRandomEncryptedMessage,
  encryptMessage,
  decryptMessage,
  parseChatKey,
  getCurrentUnixTimestamp,
  isValidChatKey,
  nullChatKey
}
