const http = require('http');
const express = require('express');
const socketIO = require('socket.io');  // Correct way to import Socket.IO for server-side

const app = express();
const server = http.createServer(app);  // Create an HTTP server
const io = socketIO(server);            // Initialize socket.io with the server

// Serve static files
app.use(express.static('public'));

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle disconnections
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    // Handle custom events (e.g., 'signal' event)
    socket.on('signal', (data) => {
        console.log('Signal received:', data);
        socket.broadcast.emit('signal', data);  // Broadcast to all connected clients
    });
});

// Define the port
const PORT = process.env.PORT || 3000;

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.render('index.html');
});