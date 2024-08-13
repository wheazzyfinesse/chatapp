import express from "express";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from 'cors'

const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(join(__dirname, "public")));
app.use(cors())
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

let connectedSockets = [];

// Socket.io event handlers
const onConnected = (socket) => {
    connectedSockets.push(socket.id);

    io.emit("clients-total", connectedSockets.size);

    socket.on("disconnect", () => {
        connectedSockets.filter(() => socket.id);
        io.emit("clients-total", connectedSockets.size);
    });
    // Retrieve user messages
    socket.on("user-message", (data) => {
        socket.broadcast.emit("chat-message", data);
    });
    // Retrieve feedback messages
    socket.on("feedback-message", (data) => {
        socket.broadcast.emit("feedback-message", data);
    });
};

io.on("connection", onConnected);
