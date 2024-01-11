import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewChat } from "../../../apicalls/chat";
import { SetAllChats, SetSelectedChat } from "../../../redux/userSlice";
import { HideLoader, ShowLoader } from "../../../redux/loaderSlice";
import toast from "react-hot-toast";
import moment from "moment";
import store from '../../../redux/store';

const UsersList = ({ searchKey,socket,onlineUsers }) => {
  const { allUsers, allChats, user, selectedChat } = useSelector(
    (state) => state.userReducer
  );
  const dispatch = useDispatch();

  const createNewChatHandler = async (recepientUserId) => {
    try {
      dispatch(ShowLoader());

      const response = await createNewChat([user._id, recepientUserId]);
      dispatch(HideLoader());

      if (response.success) {
        toast.success(response.message);
        const newChat = response.data;
        const updatedChat = [...allChats, newChat];
        dispatch(SetAllChats(updatedChat));
      }
    } catch (error) {
      toast.error(error.message);
      dispatch(HideLoader());
    }
  };

  const openChatArea = async (recepientUserId) => {
    const chat = allChats.find((chat) =>
      chat.members.map((mem) => mem._id).includes(recepientUserId)
    );
    if (chat) {
      dispatch(SetSelectedChat(chat));
    } else {
      createNewChat(recepientUserId);
    }
  };

  const getData = () => {

    //if search key is empty then return all chats , else return filtered chats and users
    if (searchKey === "") return allChats;

    const data = allUsers.filter((user) =>
      user.name.toLowerCase().includes(searchKey.toLowerCase())
    );

    console.log(data);
    return data;
  };

  const getIsSelectedChatOrNot = (userObj) => {
    if (selectedChat && userObj)
      return selectedChat.members.map((mem) => mem._id).includes(userObj._id);

    return false;
  };

  const getLastMessage = (userObj) => {

    if(!userObj)
    return "";
    const chat = allChats.find((chat) =>
      chat.members.map((mem) => mem._id).includes(userObj._id)
    );

    if (!chat || !chat.lastMessage) {
      return "";
    } else {
      const lastMsgPerson =
        chat?.lastMessage?.sender === user._id ? "You : " : "";
      return (
        <div className="flex justify-between w-72">
          <h1 className="text-gray-600 text-sm">
            {lastMsgPerson} {chat?.lastMessage?.text}
          </h1>
          <h1 className="text-gray-500 text-sm">
            {moment(chat?.lastMessage?.createdAt).format("HH:mm")}
          </h1>
        </div>
      );
    }
  };

  const getUnReadMessages = (userObj) => {
    if(!userObj)
    return "";

    const chat = allChats.find((chat) =>
      chat.members.map((mem) => mem._id).includes(userObj?._id)
    );
    if (
      chat &&
      chat.unreadMessages &&
      chat?.lastMessage?.sender === userObj._id
    ) {
      return (
        <div className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {chat?.unreadMessages}
        </div>
      );
    }
  };

  useEffect(() => {
     // if the chat area opened is not equal to chat in message , then increase unread messages by 1 and update last message
    socket.off("receive-message").on("receive-message",(message) => {
      const currentSelectedChat = store.getState().userReducer.selectedChat;
      let tempAllChats = store.getState().userReducer.allChats;

      //updation of chat for which message has arrived
      if(currentSelectedChat?._id !== message.chat){
        const updatedAllChat = tempAllChats.map( (chat) => {
          if(chat._id === message.chat){
            return {
              ...chat,
              unreadMessages : (chat?.unreadMessages || 0) + 1,
            };
          }

          return chat;
        });

        tempAllChats = updatedAllChat;
      }

      //always latest message will be on the top
      const latestChat = tempAllChats.find((chat) => chat._id === message.chat);
      const otherChats = tempAllChats.filter(
        (chat) => chat._id !== message.chat
      );
      tempAllChats = [latestChat, ...otherChats];
      dispatch(SetAllChats(tempAllChats));
    });
    
  },[])

  return (
    <div className="flex flex-col gap-3 mt-5">
      {getData().map((chatOruserObj) => {
        let userObj = chatOruserObj;

        if(chatOruserObj.members){
          userObj = chatOruserObj.members.find( (mem) => mem._id !== user._id);
        }
        return (
          <div
            className={`shadow border p-5 rounded-2xl bg-white flex justify-between items-center cursor-pointer
            ${getIsSelectedChatOrNot(userObj) && "border-primary border-2"}`}
            key={userObj?._id}
            onClick={() => openChatArea(userObj?._id)}
          >
            <div className="flex gap-5 items-center">
              {userObj?.profilePic && (
                <img
                  src={userObj.profilePic}
                  alt="profile pic"
                  className="w-10 h-10 rounded-full"
                />
              )}
              {!userObj?.profilePic && (
                <div>
                  <h1 className="uppercase font-semibold text-2xl">
                    {userObj?.name[0]}
                  </h1>
                </div>
              )}
              <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                  <div className="flex gap-1 items-center">
                    <h1>{userObj?.name}</h1>
                    {onlineUsers?.includes(userObj?._id) && (
                      <div>
                        <div className="bg-green-700 h-3 w-3 rounded-full"></div>
                      </div>
                    )}
                  </div>
                  {getUnReadMessages(userObj)}
                </div>

                <h1>{getLastMessage(userObj)}</h1>
              </div>
            </div>
            <div onClick={() => createNewChatHandler(userObj?._id)}>
              {!allChats?.find((chat) =>
                chat.members.map((mem) => mem._id).includes(userObj?._id)
              ) && (
                <button className="border-primary border text-primary bg-white p-1 rounded">
                  create chat
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UsersList;
