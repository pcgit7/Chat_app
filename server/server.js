const express = require('express');
require('dotenv').config();
const app = express();
const port  = process.env.PORT || 5000;
const dbconfig = require('./dbconfig');
const userRoutes = require('./Routes/userRoutes');
const chatRoutes = require('./Routes/chatRoutes');
const messageRoutes = require('./Routes/messagesRoute');

app.use(express.json());

const server = require('http').createServer(app);
const io = require('socket.io')(server,{
    cors : {
        origin : 'http://localhost:3000',
        methods : ["GET","POST"]
    }
});

io.on("connection", (socket) => {
    //socket events
    //console.log("connected with socket",socket.id);

    socket.on('join-room',(userId) => {
        socket.join(userId);
    });

    socket.on('send-message',(message) => {
        io.to(message.members[0]).to(message.members[1]).emit('receive-message',message);
    });
});

app.use('/api/users',userRoutes);
app.use('/api/chats',chatRoutes);
app.use('/api/message',messageRoutes);
server.listen(port , () => console.log("server runnning on",port));