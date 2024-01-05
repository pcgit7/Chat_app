import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HideLoader, ShowLoader } from "../../../redux/loaderSlice";
import { getAllMessage, sendMessage } from "../../../apicalls/message";
import toast from "react-hot-toast";

const ChatArea = () => {
  const { selectedChat, user } = useSelector((state) => state.userReducer);
  const receipentUser = selectedChat.members.find((mem) => mem._id != user._id);
  const [newMessage , setNewMessage] = useState('');
  const [messages , setMessages] = useState([]);

  const dispatch = useDispatch();

  const getMessages = async () => {
    try {
      console.log(selectedChat._id);
      dispatch(ShowLoader());
      const response = await getAllMessage(selectedChat._id);
      dispatch(HideLoader());
      if(response.success){
        setMessages(response.data);
      }
    } catch (error) {
      dispatch(HideLoader());
      console.log(error);
    }
  }
  const sendNewMessage = async () => {
    try {
      const message = {
        chat : selectedChat._id,
        sender : user._id,
        text  : newMessage
      };

      dispatch(ShowLoader());
      const response = await sendMessage(message);
      dispatch(HideLoader());

      if(response.success){
        toast.success(response.message);
        setNewMessage('');
      }
      else {
        dispatch(HideLoader());
        toast.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoader()); 
      toast.error(error.message);
    }
  };

  useEffect( () => {
    if(selectedChat)
    getMessages();
  },[selectedChat])

  return (
    <div className="flex flex-col justify-between h-[85vh] w-full bg-white rounded-2xl border p-4">
      <div>
        <div className="flex gap-5 items-center mb-2">
          {receipentUser.profilePic && (
            <img
              src={receipentUser.profilePic}
              alt="profile pic"
              className="w-10 h-10 rounded-full"
            />
          )}
          {!receipentUser.profilePic && (
            <div className="bg-gray-500  rounded-full h-10 w-10 flex items-center justify-center">
              <h1 className="uppercase text-xl font-semibold text-white">
                {receipentUser.name[0]}
              </h1>
            </div>
          )}
          <h1 className="uppercase">{receipentUser.name}</h1>
        </div>
        <hr />
      </div>
      <div>Chat messages</div>
      <div>
        <input
          type="text"
          placeholder="Type a message"
          className="w-[90%] border-0 h-full rounded-xl focus:border-none"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
          }}
        />
        <button
          className="bg-primary text-white py-1 px-5 rounded h-max"
          onClick={() => sendNewMessage("")}
        >
          <i className="ri-send-plane-2-line text-white"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
