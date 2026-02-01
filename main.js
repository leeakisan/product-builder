
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');

    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
    });
}

navSlide();

const darkModeToggle = document.querySelector('#dark-mode-toggle');
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

const rouletteCanvas = document.getElementById('roulette-canvas');
const spinButton = document.getElementById('spin-button');
const ctx = rouletteCanvas.getContext('2d');

const segments = [
    { color: '#f82', text: 'Prize 1' },
    { color: '#0bf', text: 'Prize 2' },
    { color: '#fb0', text: 'Prize 3' },
    { color: '#0fb', text: 'Prize 4' },
    { color: '#b0f', text: 'Prize 5' },
    { color: '#f0b', text: 'Prize 6' },
];

const segmentAngle = 2 * Math.PI / segments.length;
let currentAngle = 0;
let spinAngle = 0;
let spinAngleTotal = 0;
let spinTime = 0;
let spinTimeTotal = 0;

function drawRoulette() {
    ctx.clearRect(0, 0, rouletteCanvas.width, rouletteCanvas.height);
    for (let i = 0; i < segments.length; i++) {
        const angle = currentAngle + i * segmentAngle;
        ctx.fillStyle = segments[i].color;
        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 200, angle, angle + segmentAngle);
        ctx.lineTo(200, 200);
        ctx.fill();

        ctx.save();
        ctx.fillStyle = 'white';
        ctx.translate(200 + Math.cos(angle + segmentAngle / 2) * 150, 200 + Math.sin(angle + segmentAngle / 2) * 150);
        ctx.rotate(angle + segmentAngle / 2 + Math.PI / 2);
        ctx.fillText(segments[i].text, -ctx.measureText(segments[i].text).width / 2, 0);
        ctx.restore();
    }
}

function spin() {
    spinAngle = Math.random() * 10 + 10;
    spinTime = 0;
    spinTimeTotal = Math.random() * 3 + 4 * 1000;
    rotate();
}

function rotate() {
    spinTime += 30;
    if (spinTime >= spinTimeTotal) {
        stopRotate();
        return;
    }
    const spinAngle = spinAngleTotal - easeOut(spinTime, 0, spinAngleTotal, spinTimeTotal);
    currentAngle += (spinAngle * Math.PI / 180);
    drawRoulette();
    requestAnimationFrame(rotate);
}

function stopRotate() {
    const degrees = currentAngle * 180 / Math.PI + 90;
    const arcd = segmentAngle * 180 / Math.PI;
    const index = Math.floor((360 - degrees % 360) / arcd);
    ctx.save();
    ctx.font = 'bold 30px sans-serif';
    const text = segments[index].text;
    ctx.fillText(text, 200 - ctx.measureText(text).width / 2, 250);
    ctx.restore();
}

function easeOut(t, b, c, d) {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
}

drawRoulette();

spinButton.addEventListener('click', spin);
