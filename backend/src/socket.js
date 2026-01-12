import { createServer } from 'http';
import { Server } from 'socket.io';

export const setupSocket = (app) => {
    const httpServer = createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3005', 'http://localhost:8086'],
            methods: ["GET", "POST"]
        }
    });

    const PORT = process.env.PORT || 3001;

    io.on('connection', (socket) => {
        console.log('🔌 New client connected:', socket.id);
        socket.on('disconnect', () => console.log('❌ Client disconnected:', socket.id));
        socket.on('newHostingRequest', (data) => {
            console.log('📝 New Hosting Request received:', data);
            io.emit('newRequest', data);
        });
    });

    return { httpServer, io, PORT };
};
