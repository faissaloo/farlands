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
import timekeeper from 'timekeeper';
import {
  addMessageToChat,
  getMessagesAfterTimestamp,
  removeOldMessagesFromChat,
  removeExcessMessagesFromChat,
  getNextMessage
} from '../messageHandling'

describe('messageHandling', () => {
  it('returns null when there are no messages', () => {
    expect(getNextMessage('myChat', 0)).toEqual(null);
  });
  it('limits a chat to 1000 messages', () => {
    for (let i = 0; i < 1200; i++) {
      addMessageToChat('myChat', 'hello!')
    }
    removeExcessMessagesFromChat('myChat')
    expect(getMessagesAfterTimestamp('myChat', 0).length).toEqual(1000)
  });
  it('can get the next message', () => {
    for (let i = 0; i < 10; i++) {
      addMessageToChat('myChat2', `Message ${i}`)
    }
    expect(getNextMessage('myChat2', 0).message).toEqual(`Message 0`)
  });
  it('removes messages that are too old', () => {
    timekeeper.freeze(new Date(0));
    addMessageToChat('myChat3', `My message`)
    timekeeper.freeze(new Date(2*60*1000));
    removeOldMessagesFromChat('myChat3')
    expect(getMessagesAfterTimestamp('myChat3', 0).length).toEqual(0)
  });
})
