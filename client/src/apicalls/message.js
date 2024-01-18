import axiosInstance from "."
import {baseUrl} from ".";

export const sendMessage = async (message) => {

    try {
        const response = await axiosInstance.post(`${baseUrl}/api/message/send-message`,message);
        return response.data;
    } catch (error) {
        throw error;
    }
    
};

export const getAllMessage = async (chatId) => {
    try {
        const response = await axiosInstance.get(`${baseUrl}/api/message/get-all-messages/${chatId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};