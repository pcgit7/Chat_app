import React, { useEffect, useState } from 'react'
import UserSearch from './components/userSearch';
import ChatArea from './components/ChatArea';
import UsersList from './components/UsersList';
import { useSelector } from 'react-redux';
import {io} from 'socket.io-client';
const socket = io('http://localhost:5000');

const Home = () => {

  const [searchKey , setSearchKey ] = useState('');
  const {selectedChat , user} = useSelector(state => state.userReducer);

  useEffect(() => {
    if(user){
      socket.emit("join-room",user._id)
    }
  },[user]);

  return (
    <div className="flex gap-5">
      <div className="w-96">
      <UserSearch searchKey={searchKey} setSearchKey={setSearchKey} />
      <UsersList searchKey={searchKey} socket = {socket}/>
      </div>

      {selectedChat && (
        <div className="w-full">
          <ChatArea socket={socket}/>
        </div>
      )}
    </div>
  )
}

export default Home;

