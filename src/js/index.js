const playBoard = document.querySelector('.play-board');
const scoreElement = document.querySelector('.score');
const highScoreElement = document.querySelector('.high-score');
const controls = document.querySelectorAll('.controls i');

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

let html;

//Record no localStorage
let highScore = localStorage.getItem('high-score') || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

//Criando as posições da comida
const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

//Tela de game over
const handleGameOver = () => {
    clearInterval(setIntervalId);
    playBoard.innerHTML = `<div class="end-screen">
    <span>Fim de jogo! Sua pontuação foi <b>${score}.</b></span>
    <p>Aperte <b>Ok</b> para jogar novamente</p>
    <button onclick="reloadGame()">OK</button>
    </div>`;
}

//Reiniciar game após morte
const reloadGame = () => {
    location.reload();
}

//Mudando as direções com as setas do teclado
const changeDirection = e => {
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

//Mudando as direções com os controles (para dispositivos com tela menor que 800px)
controls.forEach(button => button.addEventListener('click', () => changeDirection({key: button.dataset.key})));

//Iniciando o jogo
const initGame = () => {
    if(gameOver) return handleGameOver();
   let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    //Quando a posição da cobra for igual a posiçã oda comida
    if(snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]);
        score++;
        highScore = score >= highScore ? score : highScore;

        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    snakeX += velocityX;
    snakeY += velocityY;

    for(let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    for(let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }

    playBoard.innerHTML = html;
}

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);