import React, { useState } from 'react'
import UserSearch from './components/userSearch';
import ChatArea from './components/ChatArea';
import UsersList from './components/UsersList';
import { useSelector } from 'react-redux';

const Home = () => {
  const [searchKey , setSearchKey ] = useState('');
  const {selectedChat} = useSelector(state => state.userReducer);
  return (
    <div className="flex gap-5">
      <div className="w-96">
      <UserSearch searchKey={searchKey} setSearchKey={setSearchKey} />
      <UsersList searchKey={searchKey}/>
      </div>

      
      {selectedChat && (
        <div className="w-full">
          <ChatArea />
        </div>
      )}
    </div>
  )
}

export default Home;

