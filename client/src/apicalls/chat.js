import axiosInstance from './index';

export const GetAllChats = async () => {

    try {
        const reponse = await axiosInstance.get('/api/chats/get-all-chats');
        return reponse.data;
    } catch (error) {
        return error;
    }
};

export const createNewChat = async (members) => {
    try {
        const reponse = await axiosInstance.post('/api/chats/create-new-chat' , {members});
        return reponse.data;
    } catch (error) {
        return error;
    }
};

export const ClearChatMessages = async (chatId) => {
    try {
      const response = await axiosInstance.post("/api/chats/clear-unread-messages", {
        chat: chatId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };