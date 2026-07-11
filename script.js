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
let gravitySpeed = 2; // Начальная скорость падения

// Управление кроликом стрелками клавиатуры
document.addEventListener('keydown', (e) => {
    if (isGameOver) return;
    
    const playerRect = player.getBoundingClientRect();
    const areaRect = gameArea.getBoundingClientRect();

    if (e.key === 'ArrowLeft' && playerRect.left > areaRect.left + 5) {
        player.style.left = (player.offsetLeft - 20) + 'px';
    }
    if (e.key === 'ArrowRight' && playerRect.right < areaRect.right - 5) {
        player.style.left = (player.offsetLeft + 20) + 'px';
    }
});

// Создание одной морковки
function createCarrot() {
    const carrot = document.createElement('div');
    carrot.classList.add('carrot');
    
    // Случайная позиция по горизонтали
    const minLeft = 10;
    const maxLeft = gameArea.clientWidth - 40;
    carrot.style.left = Math.random() * (maxLeft - minLeft) + minLeft + 'px';
    
    gameArea.appendChild(carrot);
    
    let timerId = setInterval(() => {
        const currentTop = carrot.offsetTop;
        
        // Если морковка долетела до низа
        if (currentTop >= gameArea.clientHeight) {
            clearInterval(timerId);
            gameArea.removeChild(carrot);
            missed++;
            updateScoreboard();
            
            // Условие проигрыша
            if (missed >= 5) {
                endGame();
            }
            return;
        }
        
        carrot.style.top = (currentTop + gravitySpeed) + 'px';
        
        // Проверка столкновения с кроликом
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
    }, 20); // Частота обновления позиции (кадровая частота)
}

// Увеличение сложности каждые 5 очков
function increaseDifficulty() {
    if (score > 0 && score % 5 === 0 && gravitySpeed < 6) {
        gravitySpeed += 0.5;
    }
}

// Обновление счетчика на экране
function updateScoreboard() {
    scoreBoard.textContent = `Счет: ${score} | Пропущено: ${missed}`;
}

// Завершение игры
function endGame() {
    isGameOver = true;
    clearInterval(spawnInterval);
    alert(`Игра окончена! Ваш счет: ${score}`);
    resetGame();
}

// Запуск новой игры
function startGame() {
    if (!isGameOver) return;
    isGameOver = false;
    score = 0;
    missed = 0;
    gravitySpeed = 2;
    updateScoreboard();
    player.style.left = '175px'; // Ставим кролика в центр
    
    // Очищаем старые морковки, если они остались
    const oldCarrots = document.querySelectorAll('.carrot');
    oldCarrots.forEach(c => c.remove());
    
    spawnInterval = setInterval(createCarrot, 1500); // Новая морковка раз в 1.5 секунды
}

// Полный сброс состояния перед новым стартом
function resetGame() {
    player.style.left = '175px';
    const carrots = document.querySelectorAll('.carrot');
    carrots.forEach(c => c.remove());
}

startBtn.addEventListener('click', startGame);