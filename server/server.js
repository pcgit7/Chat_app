const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const dbconfig = require("./dbconfig");
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messagesRoute");
const cors = require('cors');
app.use(
    express.json({
      limit: "50mb",
    })
  );
  
app.use(cors());

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:3000", "https://pc7chat-app-baatein.netlify.app"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  //socket events
  //console.log("connected with socket",socket.id);

  //socket connections will we here
  socket.on("join-room", (userId) => {
    socket.join(userId);
  });

  //send messages to clients (who are present in members array)
  socket.on("send-message", (message) => {
    io.to(message.members[0])
      .to(message.members[1])
      .emit("receive-message", message);
  });

  //clear unread messages
  socket.on("clear-unread-messages", (data) => {
    io.to(data.members[0])
      .to(data.members[1])
      .emit("unread-messages-cleared", data);
  });

  //typing
  socket.on("typing",(data) => {
    io.to(data.members[0]).to(data.members[1]).emit('started-typing',data);
  });

  //online users
  let onlineUsers = [];
  socket.on("came-online" ,userId => {
    if(!onlineUsers.includes(userId))
    onlineUsers.push(userId);

    io.emit("online-users",onlineUsers);
  })
});

app.use("api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/message", messageRoutes);
server.listen(port, () => console.log("server runnning on", port));
