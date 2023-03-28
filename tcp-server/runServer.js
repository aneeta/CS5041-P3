const { createServer } = require('http');
const { Server } = require('socket.io');

let pairings = {};
let clients = [];


const httpServer = createServer(
    function (req, res) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('P3 test\n');
    }
);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    },
});

const port = 3003;


io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    clients.push(socket.id)
    // console.log(clients)

    // Listen for a custom event called 'message'
    socket.on('message', (data) => {
        const sender = socket.id;
        console.log(`Received message from ${socket.id}:`, data);

        // Emit the message to all connected clients
        clients.forEach(element => {
            if (element != sender) {
                io.to(element).emit('message', { from: sender, message: data });
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);

        // remove from client list
        const idx = clients.indexOf(socket.id);
        if (idx > -1) {
            clients.splice(idx, 1);
        }
    });
});

httpServer.listen(port, () => {
    console.log(`Socket.IO server listening on port ${port}`);
});

// const { hostname } = require("os");
// const { Server } = require("ws");

// const host = '127.0.0.1';
// const port = 3000;

// const wss = new Server({ host: host, port: port }, () => { });

// wss.on('listening', () => {
//     const serverInfo = wss.address();
//     console.log(`WebSocket server listening on ${serverInfo.address}:${serverInfo.port}`);
// });

// wss.on('connection', (socket) => {
//     console.log('Client connected');

//     socket.on('message', (message) => {
//         console.log(`Received: ${message}`);
//         socket.send('Data received!');
//     });

//     socket.on('close', () => {
//         console.log('Client disconnected');
//     });
// });
