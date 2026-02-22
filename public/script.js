const socket = io();

const osEl = document.getElementById('os');
const cpuEl = document.getElementById('cpu');
const cpuBar = document.getElementById('cpu-bar');
const memUsedEl = document.getElementById('mem-used');
const memTotalEl = document.getElementById('mem-total');
const memBar = document.getElementById('mem-bar');
const processListEl = document.getElementById('process-list');

const ctx = document.getElementById('historyChart').getContext('2d');
const historyData = new Array(60).fill(0);
const historyLabels = new Array(60).fill('');

const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: historyLabels,
        datasets: [{
            label: 'CPU Load (%)',
            data: historyData,
            borderColor: '#00ffcc',
            backgroundColor: 'rgba(0, 255, 204, 0.2)',
            borderWidth: 2,
            pointRadius: 0,
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        animation: false,
        scales: {
            y: {
                min: 0,
                max: 100,
                grid: { color: '#333' }
            },
            x: {
                grid: { display: false },
                ticks: { display: false }
            }
        },
        plugins: {
            legend: { display: false }
        }
    }
});

socket.on('stats', (data) => {
    if (osEl.innerText === 'Loading...') {
        osEl.innerText = data.os;
    }

    cpuEl.innerText = data.cpu;
    cpuBar.style.width = data.cpu + '%';
    
    if (data.cpu > 80) {
        cpuBar.style.backgroundColor = 'var(--secondary-color)';
    } else {
        cpuBar.style.backgroundColor = 'var(--primary-color)';
    }

    memUsedEl.innerText = data.memUsed;
    memTotalEl.innerText = data.memTotal;
    
    const memPercent = (data.memUsed / data.memTotal) * 100;
    memBar.style.width = memPercent + '%';
    
    if (memPercent > 85) {
        memBar.style.backgroundColor = 'var(--secondary-color)';
    } else {
        memBar.style.backgroundColor = 'var(--primary-color)';
    }

    chart.data.datasets[0].data.shift();
    chart.data.datasets[0].data.push(data.cpu);
    chart.update();

    if (data.processes && data.processes.length > 0) {
        processListEl.innerHTML = data.processes.map(p => 
            `<li>
                <span class="process-name">${p.name}</span>
                <span class="process-stats">CPU: ${p.cpu}% | RAM: ${p.mem}%</span>
            </li>`
        ).join('');
    }
});