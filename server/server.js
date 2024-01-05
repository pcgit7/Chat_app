const express = require('express');
require('dotenv').config();
const app = express();
const port  = process.env.PORT || 5000;
const dbconfig = require('./dbconfig');
const userRoutes = require('./Routes/userRoutes');
const chatRoutes = require('./Routes/chatRoutes');
const messageRoutes = require('./Routes/messagesRoute');

app.use(express.json());

app.use('/api/users',userRoutes);
app.use('/api/chats',chatRoutes);
app.use('/api/message',messageRoutes);
app.listen(port , () => console.log("server runnning on port"));