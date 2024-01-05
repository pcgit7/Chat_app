import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewChat } from "../../../apicalls/chat";
import { SetAllChats, SetSelectedChat } from "../../../redux/userSlice";
import { HideLoader, ShowLoader } from "../../../redux/loaderSlice";
import toast from "react-hot-toast";

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
  return (
    <div className="flex flex-col gap-3 mt-5">
      {getData().map((userObj) => (
        <div
          className={`shadow border p-5 rounded-2xl bg-white flex justify-between items-center cursor-pointer
            ${getIsSelectedChatOrNot(userObj) && "border-primary border-2"}`}
          key={userObj._id}
          onClick={() => openChatArea(userObj._id)}
        >
          <div className="flex gap-2 items-center">
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
            <h1>{userObj.name}</h1>
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
