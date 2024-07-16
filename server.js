const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', socket => {
    socket.on('message', message => {
        const messageString = message.toString('utf8'); // Convert Buffer to string
        console.log('Received:', messageString);

        // Broadcast the message to all clients
        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(messageString);
            }
        });
    });
});

console.log('WebSocket server is running on ws://192.168.0.9:8080');
