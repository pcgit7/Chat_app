import  axiosInstance  from ".";
import { baseUrl } from ".";
export const LoginUser = async (user) => {
  try {
    const response = await axiosInstance.post(`${baseUrl}/api/users/login`, user);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const RegisterUser = async (user) => {
  try {
    const response = await axiosInstance.post(`${baseUrl}/api/users/register`, user);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetCurrentUser = async () => {
  try {
    const response = await axiosInstance.get(`${baseUrl}/api/users/get-current-user`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllUsers = async () => {
  try {
    const response = await axiosInstance.get(`${baseUrl}/api/users/get-all-users`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UpdateProfilePicture = async (image) => {
  try {
    const response = await axiosInstance.post(`${baseUrl}/api/users/update-profile-picture`, {
      image,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};