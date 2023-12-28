import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {  GetAllUsers, GetCurrentUser } from "../apicalls/users";
import { GetAllChats } from "../apicalls/chat";
import { HideLoader, ShowLoader } from "../redux/loaderSlice";
import { SetAllUsers, SetUser, SetAllChats } from "../redux/userSlice";

function ProtectedRoute({ children }) {

  const { user } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getCurrentUser = async () => {
    try {
      dispatch(ShowLoader());
      const response = await GetCurrentUser();
      const allUsersResponse = await GetAllUsers();
      const allChatResponse = await GetAllChats();
      dispatch(HideLoader());
      if (response.success) {
        dispatch(SetUser(response.data));
        dispatch(SetAllUsers(allUsersResponse.data));
        dispatch(SetAllChats(allChatResponse.data));
      } else {
        toast.error(response.message);
        localStorage.removeItem("token");
        navigate("/login");
      }
      
    } catch (error) {
      dispatch(HideLoader());
      toast.error(error.message);
      localStorage.removeItem("token");
      navigate("/login");
    }
    
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getCurrentUser();
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div className="h-screen w-screen bg-gray-100 p-2">
      {/* header */}
      <div className="flex justify-between p-5 bg-primary rounded">
        <div className="flex items-center gap-1">
          <i className="ri-message-3-line text-2xl text-white"></i>
          <h1
            className="text-white text-2xl uppercase font-bold cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            SHEYCHAT
          </h1>
        </div>
        
      </div>

      {/* content (pages) */}
      <div className="py-5">{children}</div>
    </div>
  );
}

export default ProtectedRoute;