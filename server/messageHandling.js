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
import {getCurrentUnixTimestamp} from 'farlandslib';

import lodash from 'lodash';
const {get, takeRight} = lodash;

// In-memory chat storage
const chatStore = {};

const addMessageToChat = (chatId, message) => {
  const timestamp = getCurrentUnixTimestamp();
  chatStore[chatId] = [...get(chatStore, chatId, []), { message, timestamp }]
};

const getMessagesAfterTimestamp = (chatId, timestamp) => {
  if (chatStore[chatId]) {
    return chatStore[chatId].filter(msg => msg.timestamp > timestamp);
  }
  return []
};

const removeOldMessagesFromChat = (chatId) => {
  const oneMinuteInS = 60
  const oldestTimestampAllowed = getCurrentUnixTimestamp()-oneMinuteInS; //only allow the past one minute of messages
  chatStore[chatId] = getMessagesAfterTimestamp(chatId, oldestTimestampAllowed);
};

const removeExcessMessagesFromChat = (chatId) => {
  chatStore[chatId] = takeRight(chatStore[chatId], 1000); //allow a chat to contain no more than 1000 messages at a time
};

const getNextMessage = (chatId, timestamp) => {
  const messages = getMessagesAfterTimestamp(chatId, timestamp)
  if (messages.length > 0) {
    return messages[0];
  }
  return null;
};

export {
  addMessageToChat,
  getMessagesAfterTimestamp,
  removeOldMessagesFromChat,
  removeExcessMessagesFromChat,
  getNextMessage
}
