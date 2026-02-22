const socket = io();

const osEl = document.getElementById('os');
const cpuEl = document.getElementById('cpu');
const cpuBar = document.getElementById('cpu-bar');
const memUsedEl = document.getElementById('mem-used');
const memTotalEl = document.getElementById('mem-total');
const memBar = document.getElementById('mem-bar');

socket.on('stats', (data) => {
    // OS updates
    if (osEl.innerText === 'Loading...') {
        osEl.innerText = data.os;
    }

    // CPU updates
    cpuEl.innerText = data.cpu;
    cpuBar.style.width = data.cpu + '%';
    
    if (data.cpu > 80) {
        cpuBar.style.backgroundColor = 'var(--secondary-color)';
    } else {
        cpuBar.style.backgroundColor = 'var(--primary-color)';
    }

    // Memory updates
    memUsedEl.innerText = data.memUsed;
    memTotalEl.innerText = data.memTotal;
    
    const memPercent = (data.memUsed / data.memTotal) * 100;
    memBar.style.width = memPercent + '%';
    
    if (memPercent > 85) {
        memBar.style.backgroundColor = 'var(--secondary-color)';
    } else {
        memBar.style.backgroundColor = 'var(--primary-color)';
    }
});