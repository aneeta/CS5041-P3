const { io } = require("socket.io-client");
const rlp = require('readline');


// const socket = io('https://as627.host.cs.st-andrews.ac.uk/p3/:3003');
const socket = io('http://klovia:3003');

socket.on('connect', () => {
    console.log('Connected to the server');
    const socketId = socket.id;

    const rl = rlp.createInterface({ input: process.stdin, output: process.stdout });

    rl.on('line', (input) => {
        socket.send(input)
    });
});

socket.on('message', (data) => {
    console.log('Received message:', data);
});

socket.on('disconnect', () => {
    console.log('Disconnected from the server');
});




// const net = require('net');

// const serverHost = 'https://as627.host.cs.st-andrews.ac.uk/node/';
// const serverPort = 3003;

// const client = new net.Socket();
// client.setEncoding('utf8');

// // Connect to the TCP server
// client.connect(serverPort, serverHost, () => {
//     console.log(`Connected to the server at ${serverHost}:${serverPort}`);

//     });

// });

// // Listen for data from the server
// client.on('data', (data) => {
//     console.log('Received from the server:', data);

//     // client.destroy();
// });

// // Handle client connection close
// client.on('close', () => {
//     console.log('Connection closed');
// });

// // Handle errors
// client.on('error', (error) => {
//     console.error('An error occurred:', error);
// });
