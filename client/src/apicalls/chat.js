import axiosInstance from './index';
import { baseUrl } from './index';

export const GetAllChats = async () => {

    try {
        const reponse = await axiosInstance.get(`${baseUrl}/api/chats/get-all-chats`);
        return reponse.data;
    } catch (error) {
        return error;
    }
};

export const createNewChat = async (members) => {
    try {
        const reponse = await axiosInstance.post(`${baseUrl}/api/chats/create-new-chat` , {members});
        return reponse.data;
    } catch (error) {
        return error;
    }
};

export const ClearChatMessages = async (chatId) => {
    try {
      const response = await axiosInstance.post(`${baseUrl}/apichats/clear-unread-messages`, {
        chat: chatId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };