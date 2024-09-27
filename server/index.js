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
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';

import {
  addMessageToChat,
  getMessagesAfterTimestamp,
  removeOldMessagesFromChat,
  removeExcessMessagesFromChat,
  getNextMessage
} from './messageHandling.js';

const app = new Koa();
const router = new Router();

const onMessageEvent = (chatId) => {
  removeOldMessagesFromChat(chatId);
  removeExcessMessagesFromChat(chatId);
}

router.post('/postMessage', async (context) => {
    const { chatId, message } = context.request.body;

    if (!chatId || !message) {
        context.status = 400;
        context.body = { error: 'chatId and message are required' };
        return;
    }

    addMessageToChat(chatId, message);
    onMessageEvent(chatId);

    context.body = { success: true };
});
router.get('/getMessage', async (context) => {
    const { chatId, timestamp } = context.query;

    if (!chatId || !timestamp) {
        context.status = 400;
        context.body = { error: 'chatId and timestamp are required' };
        return;
    }

    const parsedTimestamp = parseInt(timestamp, 10);

    context.body = getNextMessage(chatId, parsedTimestamp);
    onMessageEvent(chatId);
});

app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

const port = 3000;
app.listen(port, () => {
    console.log(`Messaging server activated on http://localhost:${port}`);
});
