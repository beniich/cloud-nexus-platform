
// ============================================================
// 4. REAL-TIME COLLABORATION (Enhanced Socket.io)
// ============================================================

import { Server } from 'socket.io';
import * as Y from 'yjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CollaborationService {

    constructor(io) {
        this.io = io;
        this.rooms = new Map(); // room -> Y.Doc
        this.cursors = new Map(); // room -> { userId: cursor }
        this.awareness = new Map(); // room -> awareness state
    }

    initialize() {
        this.io.on('connection', (socket) => {
            console.log(`🔌 User connected: ${socket.id}`);

            // Join collaboration room
            socket.on('join-room', async ({ roomId, userId, userName }) => {
                socket.join(roomId);
                socket.userId = userId; // Store userId on socket for disconnect handling

                // Initialize CRDT if needed
                if (!this.rooms.has(roomId)) {
                    this.rooms.set(roomId, new Y.Doc());
                    this.cursors.set(roomId, new Map());
                }

                const cursors = this.cursors.get(roomId);
                cursors.set(userId, {
                    x: 0,
                    y: 0,
                    userName,
                    color: this.getRandomColor()
                });

                // Broadcast user joined
                this.io.to(roomId).emit('user-joined', {
                    userId,
                    userName,
                    cursors: Array.from(cursors.values())
                });

                // Send current state
                const doc = this.rooms.get(roomId);
                const state = Y.encodeStateAsUpdate(doc);
                socket.emit('sync-state', state);
            });

            // Handle cursor movement
            socket.on('cursor-move', ({ roomId, userId, x, y }) => {
                const cursors = this.cursors.get(roomId);
                if (cursors?.has(userId)) {
                    const cursor = cursors.get(userId);
                    cursor.x = x;
                    cursor.y = y;

                    socket.to(roomId).emit('cursor-update', {
                        userId,
                        x,
                        y,
                        userName: cursor.userName,
                        color: cursor.color
                    });
                }
            });

            // Handle content updates (CRDT)
            socket.on('update', ({ roomId, update }) => {
                const doc = this.rooms.get(roomId);
                if (doc) {
                    Y.applyUpdate(doc, new Uint8Array(update));
                    socket.to(roomId).emit('remote-update', update);
                }
            });

            // Handle selections
            socket.on('selection', ({ roomId, userId, selection }) => {
                socket.to(roomId).emit('user-selection', {
                    userId,
                    selection
                });
            });

            // Handle comments
            socket.on('add-comment', async ({ roomId, comment }) => {
                try {
                    const saved = await prisma.comment.create({
                        data: {
                            roomId,
                            userId: comment.userId,
                            content: comment.content,
                            position: comment.position || {}
                        }
                    });

                    this.io.to(roomId).emit('new-comment', saved);
                } catch (error) {
                    console.error('Error saving comment:', error);
                }
            });

            // Leave room
            socket.on('leave-room', ({ roomId, userId }) => {
                const cursors = this.cursors.get(roomId);
                cursors?.delete(userId);

                socket.leave(roomId);
                this.io.to(roomId).emit('user-left', { userId });
            });

            // Disconnect
            socket.on('disconnect', () => {
                console.log(`🔌 User disconnected: ${socket.id}`);
                // Cleanup if we knew which room they were in (naive implementation)
                // In production we'd map socket.id -> rooms to clean up properly
            });

            // Typing indicator
            socket.on('typing-start', ({ roomId, userId }) => {
                socket.to(roomId).emit('user-typing', { userId, typing: true });
            });

            socket.on('typing-stop', ({ roomId, userId }) => {
                socket.to(roomId).emit('user-typing', { userId, typing: false });
            });

            // Voice channel
            socket.on('voice-signal', ({ roomId, signal, to }) => {
                socket.to(to).emit('voice-signal', {
                    signal,
                    from: socket.id
                });
            });

            // Screen sharing
            socket.on('share-screen', ({ roomId }) => {
                socket.to(roomId).emit('screen-shared', {
                    userId: socket.userId
                });
            });
        });
    }

    getRandomColor() {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
            '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Get active users in room
    async getActiveUsers(roomId) {
        const sockets = await this.io.in(roomId).fetchSockets();
        return sockets.map(s => ({
            id: s.id,
            userId: s.userId
        }));
    }

    // Broadcast to room
    broadcastToRoom(roomId, event, data) {
        this.io.to(roomId).emit(event, data);
    }
}
