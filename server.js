const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const si = require('systeminformation');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Client connected');

    const interval = setInterval(async () => {
        try {
            const cpu = await si.currentLoad();
            const mem = await si.mem();
            const osInfo = await si.osInfo();

            socket.emit('stats', {
                cpu: parseFloat(cpu.currentLoad.toFixed(2)),
                memTotal: parseFloat((mem.total / (1024 ** 3)).toFixed(2)),
                memUsed: parseFloat((mem.active / (1024 ** 3)).toFixed(2)),
                os: `${osInfo.distro} ${osInfo.release}`
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    }, 1000);

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        clearInterval(interval);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});