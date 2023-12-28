import React, { useState } from 'react'
import UserSearch from './components/userSearch';
import ChatArea from './components/ChatArea';
import UsersList from './components/UsersList';

const Home = () => {
  const [searchKey , setSearchKey ] = useState('');
  return (
    <div className='flex'>
      <div className='w-96'>
      <UserSearch searchKey={searchKey} setSearchKey={setSearchKey} />
      <UsersList searchKey={searchKey}/>
      </div>

      <div>
        
      </div>
      <div>
        <ChatArea/>
      </div>
    </div>
  )
}

export default Home;

