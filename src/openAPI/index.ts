import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

// console.info(process.env);

// import { randomUUID } from 'crypto';
// import {
//   Assistant,
//   Chat,
//   IChatCompletionMessage,
//   memoryRepository,
// } from '@whitebeardit/easy-openai';
// const { ChatRepository, MessageRepository } = memoryRepository;

// const main = async () => {
//   const chats = new ChatRepository();
//   const messages = new MessageRepository();

//   const whitebeard = new Assistant(chats, messages);
//   console.info(whitebeard.context);

//   // Create a new Chat and add it on the assistant
//   const ownerId = 'almera_0123';
//   const chatId = randomUUID();
//   const newChat = new Chat({
//     _id: chatId,
//     ownerId,
//     title: 'DEFAULT',
//   });
//   const chatCreated = await whitebeard.addChat({ chat: newChat });

//   //Create messages and add into the chat created
//   const message: IChatCompletionMessage = {
//     content: 'How much is 10 + 1 ?',
//     ownerId: String(chatCreated?.ownerId),
//     role: 'user',
//     chatId: String(chatCreated?.id),
//   };
//   await whitebeard.addMessage(message);

//   // Send the chat (with all messages) to the ChatGPT
//   const resp = await whitebeard.sendChat(String(chatCreated?.id));
//   console.info(resp);

//   // All dialog will be stored in the chat
//   const chatMessages = await whitebeard.getMessages({ chatId, ownerId });
//   console.info({ chatMessages });
// };

// main();
