import { Server } from 'socket.io';
import { createServer } from 'http';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).end(); // Method Not Allowed
    }

    const server = createServer((req, res) => res.end());
    const io = new Server(server);

    const connectedSockets = [];

    io.on('connection', (socket) => {
        connectedSockets.push(socket.id);
        io.emit('clients-total', connectedSockets.length);

        socket.on('disconnect', () => {
            const index = connectedSockets.indexOf(socket.id);
            if (index > -1) {
                connectedSockets.splice(index, 1);
            }
            io.emit('clients-total', connectedSockets.length);
        });

        socket.on('user-message', (data) => {
            socket.broadcast.emit('chat-message', data);
        });

        socket.on('feedback-message', (data) => {
            socket.broadcast.emit('feedback-message', data);
        });
    });

    server.listen(3000, () => console.log("server running on port 3000")); // Serverless functions can only listen on a single port
}
