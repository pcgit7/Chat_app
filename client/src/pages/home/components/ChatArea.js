import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HideLoader, ShowLoader } from "../../../redux/loaderSlice";
import { getAllMessage, sendMessage } from "../../../apicalls/message";
import toast from "react-hot-toast";
import moment from "moment";
import { ClearChatMessages } from "../../../apicalls/chat";
import { SetAllChats } from "../../../redux/userSlice";
import store from "../../../redux/store";

const ChatArea = ({ socket }) => {
  const { selectedChat, user, allChats } = useSelector(
    (state) => state.userReducer
  );
  const receipentUser = selectedChat.members.find((mem) => mem._id !== user._id);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const dispatch = useDispatch();

  const getMessages = async () => {
    try {
      dispatch(ShowLoader());
      const response = await getAllMessage(selectedChat._id);
      dispatch(HideLoader());
      if (response.success) {
        setMessages(response.data);
      }
    } catch (error) {
      dispatch(HideLoader());
      console.log(error);
    }
  };
  const sendNewMessage = async () => {
    try {
      const message = {
        chat: selectedChat._id,
        sender: user._id,
        text: newMessage,
      };

      socket.emit("send-message", {
        ...message,
        members: selectedChat.members.map((mem) => mem._id),
        createdAt: moment().format("DD-MM-YYYY hh:mm:ss"),
        read: false,
      });

      //dispatch(ShowLoader());
      const response = await sendMessage(message);
      //dispatch(HideLoader());

      if (response.success) {
        toast.success(response.message);
        setNewMessage("");
      } else {
        dispatch(HideLoader());
        toast.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoader());
      toast.error(error.message);
    }
  };

  const clearUnreadMessages = async () => {
    try {

      socket.emit("clear-unread-messages",{
        chat : selectedChat._id,
        members : selectedChat.members.map( (mem) => mem._id) 
      });

      const response = await ClearChatMessages(selectedChat._id);

      if (response.success) {
        const updatedChats = allChats.map((chat) => {
          if (chat._id === selectedChat._id) {
            return response.data;
          }
          return chat;
        });
        dispatch(SetAllChats(updatedChats));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (selectedChat) getMessages();
    if (selectedChat?.lastMessage?.sender !== user._id) {
      clearUnreadMessages();
    }

    //recieve message from reciver using socket

    socket.off("receive-message").on("receive-message", (message) => {
      const currentChat = store.getState().userReducer.selectedChat;
      if (currentChat._id === message.chat) {
        setMessages((prev) => [...prev, message]);
      }
      
      if(currentChat._id === message.chat && message.sender !== user._id){
        console.log("hhhh");
        clearUnreadMessages();
      }

      //clear unread message from server using socket
      socket.off("unread-messages-cleared").on("unread-messages-cleared",(data) => {
        const currentChat = store.getState().userReducer.selectedChat;
        const tempAllChats = store.getState().userReducer.allChats;

        if(currentChat._id === data.chat){
          //update unreadmessages count in selected chat
          const updatedChat = tempAllChats.map((chat) => {
            if(chat._id === data.chat){
              return {
                ...chat,
                unreadMessages : 0
              };
            }

            return chat;
          });
          dispatch(SetAllChats(updatedChat));

          //set all messages all as read
          setMessages((preMessages) => {
            return preMessages.map( (message) => {
              return {
                ...message,
                read : true
              };
            });
          });

        }
      });
      
    });
  }, [selectedChat]);

  useEffect(() => {
    const messageContainer = document.getElementById("messages");
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }, [messages]);

  return (
    <div className="flex flex-col justify-between h-[82vh] w-full bg-white rounded-2xl border p-4">
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
      <div className="h-[55vh] overflow-y-scroll p-5" id="messages">
        <div className="flex flex-col gap-2">
          {messages.map((message) => {
            const isCurrentUserSender = message.sender === user._id;
            return (
              <div className={`flex ${isCurrentUserSender && "justify-end"}`}>
                <div className="flex flex-col gap-1">
                  <h1
                    className={`${
                      isCurrentUserSender
                        ? "bg-primary text-white rounded-bl-none"
                        : "bg-gray-300 text-primary rounded-tr-none"
                    } p-2 rounded-xl`}
                  >
                    {message.text}
                  </h1>
                  <h1>{moment(message.createdAt).format("hh:mm A")}</h1>
                </div>
                {isCurrentUserSender && (
                  <i
                    class={`ri-check-double-line text-lg p-1
                  ${message.read ? "text-green-700 " : "text-gray-700"}`}
                  ></i>
                )}
              </div>
            );
          })}
        </div>
      </div>
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
