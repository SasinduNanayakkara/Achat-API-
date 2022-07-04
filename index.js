const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const socket = require("socket.io");
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});

app.use("/api", userRoutes);
app.use("/api/msg", messageRoutes);

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    }
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-received", data.message);
        }
    });
});
