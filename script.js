const gameArea = document.getElementById('gameArea');
const player = document.createElement('div');
player.classList.add('player');
gameArea.appendChild(player);

const scoreBoard = document.getElementById('scoreBoard');
const startBtn = document.getElementById('startBtn');

let score = 0;
let missed = 0;
let isGameOver = true;
let spawnInterval;
let gravitySpeed = 2;

// Проверяем загрузку изображений (важно для локального запуска)
function imagesLoaded() {
    return new Promise((resolve) => {
        const rabbitImg = new Image();
        const carrotImg = new Image();
        let loadedCount = 0;
        
        function checkDone() {
            if (loadedCount === 2) resolve();
        }

        rabbitImg.onload = () => { loadedCount++; checkDone(); };
        carrotImg.onload = () => { loadedCount++; checkDone(); };
        
        // Устанавливаем src только после назначения onload
        rabbitImg.src = 'rabbit.png';
        carrotImg.src = 'carrot.png';
        
        // Если картинки закэшированы браузером, события могут не сработать
        if (rabbitImg.complete && carrotImg.complete) resolve();
    });
}

document.addEventListener('keydown', (e) => {
    if (isGameOver) return;
    
    const playerRect = player.getBoundingClientRect();
    const areaRect = gameArea.getBoundingClientRect();

    if (e.key === 'ArrowLeft' && playerRect.left > areaRect.left + 5) {
        player.style.left = (player.offsetLeft - 25) + 'px'; // Шаг увеличен под широкое поле
    }
    if (e.key === 'ArrowRight' && playerRect.right < areaRect.right - 5) {
        player.style.left = (player.offsetLeft + 25) + 'px';
    }
});

async function createCarrot() {
    await imagesLoaded(); // Ждем загрузки ассетов
    const carrot = document.createElement('div');
    carrot.classList.add('carrot');
    
    const minLeft = 10;
    const maxLeft = gameArea.clientWidth - 50;
    carrot.style.left = Math.random() * (maxLeft - minLeft) + minLeft + 'px';
    
    gameArea.appendChild(carrot);
    
    let timerId = setInterval(() => {
        const currentTop = carrot.offsetTop;
        
        if (currentTop >= gameArea.clientHeight) {
            clearInterval(timerId);
            gameArea.removeChild(carrot);
            missed++;
            updateScoreboard();
            
            if (missed >= 5) {
                endGame();
            }
            return;
        }
        
        carrot.style.top = (currentTop + gravitySpeed) + 'px';
        
        const collisionX = carrot.offsetLeft < player.offsetLeft + player.clientWidth && 
                           carrot.offsetLeft + carrot.clientWidth > player.offsetLeft;
        const collisionY = carrot.offsetTop < player.offsetTop + player.clientHeight && 
                           carrot.offsetTop + carrot.clientHeight > player.offsetTop;

        if (collisionX && collisionY) {
            clearInterval(timerId);
            gameArea.removeChild(carrot);
            score++;
            increaseDifficulty();
            updateScoreboard();
        }
    }, 20);
}

function increaseDifficulty() {
    if (score > 0 && score % 5 === 0 && gravitySpeed < 7) {
        gravitySpeed += 0.6; // Морковки падают быстрее
    }
}

function updateScoreboard() {
    scoreBoard.textContent = `Счет: ${score} | Пропущено: ${missed}`;
}

function endGame() {
    isGameOver = true;
    clearInterval(spawnInterval);
    alert(`Урожай собран! Ваш счет: ${score}`);
    resetGame();
}

async function startGame() {
    if (!isGameOver) return;
    await imagesLoaded();
    isGameOver = false;
    score = 0;
    missed = 0;
    gravitySpeed = 2;
    updateScoreboard();
    player.style.left = '210px';
    
    const oldCarrots = document.querySelectorAll('.carrot');
    oldCarrots.forEach(c => c.remove());
    
    spawnInterval = setInterval(createCarrot, 1200); // Спавн чуть чаще
}

function resetGame() {
    player.style.left = '210px';
    const carrots = document.querySelectorAll('.carrot');
    carrots.forEach(c => c.remove());
}

startBtn.addEventListener('click', startGame);