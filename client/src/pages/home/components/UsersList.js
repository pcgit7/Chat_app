import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewChat } from "../../../apicalls/chat";
import { SetAllChats, SetSelectedChat } from "../../../redux/userSlice";
import { HideLoader, ShowLoader } from "../../../redux/loaderSlice";
import toast from "react-hot-toast";
import moment from "moment";

const UsersList = ({ searchKey }) => {
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
    const data = allUsers.filter(
      (userObj) =>
        (searchKey &&
          userObj.name.toLowerCase().includes(searchKey.toLowerCase())) ||
        allChats.some((chat) =>
          chat.members.map((mem) => mem._id).includes(userObj._id)
        )
    );
    return data;
  };

  const getIsSelectedChatOrNot = (userObj) => {
    if (selectedChat && userObj)
      return selectedChat.members.map((mem) => mem._id).includes(userObj._id);

    return false;
  };

  const getLastMessage = (userObj) => {
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
    const chat = allChats.find((chat) =>
      chat.members.map((mem) => mem._id).includes(userObj._id)
    );
    if (chat && chat.unreadMessages && chat?.lastMessage.sender !== userObj._id) {
      return (
        <div className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {chat?.unreadMessages}
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-5">
      {getData().map((userObj) => (
        <div
          className={`shadow border p-5 rounded-2xl bg-white flex justify-between items-center cursor-pointer
            ${getIsSelectedChatOrNot(userObj) && "border-primary border-2"}`}
          key={userObj._id}
          onClick={() => openChatArea(userObj._id)}
        >
          <div className="flex gap-5 items-center">
            {userObj.profilePic && (
              <img
                src={userObj.profilePic}
                alt="profile pic"
                className="w-10 h-10 rounded-full"
              />
            )}
            {!userObj.profilePic && (
              <div>
                <h1 className="uppercase font-semibold text-2xl">
                  {userObj.name[0]}
                </h1>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <div className="flex gap-1">
              <h1>{userObj.name}</h1>
              {getUnReadMessages(userObj)}
              </div>
              
              <h1>{getLastMessage(userObj)}</h1>
            </div>
          
          </div>
          <div onClick={() => createNewChatHandler(userObj._id)}>
            {!allChats?.find((chat) =>
              chat.members.map((mem) => mem._id).includes(userObj._id)
            ) && (
              <button className="border-primary border text-primary bg-white p-1 rounded">
                create chat
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersList;
