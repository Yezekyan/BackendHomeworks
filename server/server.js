const net = require('net');

const clients = new Map();
const MAX_CLIENTS = 5;

const server = net.createServer((socket) => {
    if (clients.size >= MAX_CLIENTS) {
        socket.write('Server is full. Try again later.\n');
        socket.end();
        return;
    }

    let username = '';

    socket.write('Enter your username: ');

    socket.on('data', (data) => {
        const message = data.toString().trim();

        if (!message) return;

        if (!username) {
            if (clients.has(message)) {
                socket.write('Username already taken. Try another: ');
                return;
            }

            username = message;
            clients.set(username, socket);

            socket.write(`Welcome ${username}!\n`);
            broadcast(`${username} joined the chat`, socket);

            return;
        }

        if (message.startsWith('@')) {
            const parts = message.split(' ');
            const targetUser = parts[0].slice(1);
            const msg = parts.slice(1).join(' ');

            if (clients.has(targetUser)) {
                if (msg) {
                    clients
                        .get(targetUser)
                        .write(`[DM from ${username}]: ${msg}\n`);
                } else {
                    socket.write(
                        'Error: Please provide a message after the username.\n'
                    );
                }
            } else {
                socket.write(`Error: User ${targetUser} not found.\n`);
            }
        } else {
            broadcast(`${username}: ${message}`, socket);
        }
    });

    const cleanup = () => {
        if (username && clients.has(username)) {
            clients.delete(username);
            broadcast(`${username} left the chat`);
        }
    };

    socket.on('end', cleanup);
    socket.on('error', cleanup);
});

function broadcast(message, senderSocket = null) {
    for (const [, clientSocket] of clients.entries()) {
        if (clientSocket !== senderSocket) {
            clientSocket.write(message + '\n');
        }
    }
}

server.listen(3000, () => {
    console.log('Server running on port 3000');
});