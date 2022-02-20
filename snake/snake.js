//-------------------------------------------------------------- 1 - Canvas --------
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let width = canvas.width;
let height = canvas.height;

let blockSize = 10;
let widthInBlocks = width / blockSize;
let heightInBlocks = height / blockSize;

let score = 0;
let timeout = 200;
let turboBoost = 0;

//------------------------------------------------------------- 2- Borders ---------
function drawBorder() {
    ctx.fillStyle = "Gray";
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, height - blockSize, width, blockSize);
    ctx.fillRect(0, 0, blockSize, height);
    ctx.fillRect(width - blockSize, 0, blockSize, height);
}

function drawScore() {
    ctx.font = "20px Courier";
    ctx.fillStyle = "Black";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Score: " + score + "  Turbo: " + turboBoost, blockSize, blockSize);
}

function gameOver() {

//clearInterval(intervalId);


    ctx.font = "60px Courier";
    ctx.fillStyle = "Black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game Over", width / 2, height / 2);

    clearTimeout(timeoutId);


}


function circle(x, y, radius, fillCircle) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    if (fillCircle) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
}


//---------------------------------------------- 3 - Block ------------------------------------------
let Block = function (col, row) {
    this.col = col;
    this.row = row;
}

Block.prototype.drawSquare = function (color) {
    let x = this.col * blockSize;
    let y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
}

Block.prototype.drawCircle = function (color) {
    let centerX = this.col * blockSize + blockSize / 2;
    let centerY = this.row * blockSize + blockSize / 2;
    ctx.fillStyle = color;
    circle(centerX, centerY, blockSize / 2, true);
}

Block.prototype.equal = function (otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
}


//----------------------------------------------- 4 - Snake -------------------------------
let Snake = function () {
    this.segments = [
        new Block(7, 5),
        new Block(6, 5),
        new Block(5, 5)
    ];

    this.direction = "right";
    this.nextDirection = "right";
}

Snake.prototype.draw = function () {
    for (let i = 0; i < this.segments.length; i++) {
        if (i % 2 === 0) {
            this.segments[i].drawSquare("Blue");
        } else {
            this.segments[i].drawSquare("Red");
        }
    }
}

Snake.prototype.move = function () {
    let head = this.segments[0];
    let newHead;

    this.direction = this.nextDirection;

    if (this.direction === "right") {
        newHead = new Block(head.col + 1, head.row);
    } else if (this.direction === "down") {
        newHead = new Block(head.col, head.row + 1);
    } else if (this.direction === "left") {
        newHead = new Block(head.col - 1, head.row);
    } else if (this.direction === "up") {
        newHead = new Block(head.col, head.row - 1);
    }

    if (this.checkCollision(newHead)) {
        gameOver();

        clearTimeout(timeoutId);

        //ctx.clearRect(0, 0, width, height);
        drawScore();
        snake.move();
        snake.draw();
        apple.draw();
        drawBorder();

        return;
    }

    this.segments.unshift(newHead);

    if (newHead.equal(apple.position)) {   // Apple is eaten
        score++;
        //timeout -= 10;
        apple.move();
    } else {
        this.segments.pop();
    }
}

Snake.prototype.checkCollision = function (head) {
    let leftCollision = (head.col === 0);
    let topCollision = (head.row === 0);
    let rightCollision = (head.col === widthInBlocks - 1);
    let bottomCollision = (head.row === heightInBlocks - 1);

    let wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;

    let selfCollision = false;
    for (let i = 0; i < this.segments.length; i++) {
        if (head.equal(this.segments[i])) {
            selfCollision = true;
        }
    }

    return wallCollision || selfCollision;
}

Snake.prototype.setDirection = function (newDirection) {
    if (this.direction === "up" && newDirection === "down") {
        if (turboBoost > 0) {turboBoost--; timeout +=10;}
        return;

    } else if (this.direction === "right" && newDirection === "left") {
        if (turboBoost > 0) {turboBoost--; timeout +=10;}
        return;

    } else if (this.direction === "down" && newDirection === "up") {
        if (turboBoost > 0) {turboBoost--; timeout +=10;}
        return;

    } else if (this.direction === "left" && newDirection === "right") {
        if (turboBoost > 0) {turboBoost--; timeout +=10;}
        return;

    }

    if (this.direction === newDirection) {
        timeout -= 10;
        turboBoost++;
    }

    this.nextDirection = newDirection;


}

//------------------------------------------------------ 5 - Apple -----------------------------------
let Apple = function () {
    this.position = new Block(10, 10);
}

Apple.prototype.draw = function () {
    this.position.drawCircle("LimeGreen");
}

Apple.prototype.move = function () {

    let isAppleOnSnake = false;


    do {

        let randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
        let randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;

        this.position = new Block(randomCol, randomRow);

        for (let i = 0; i < snake.segments.length; i++) {

            if (this.position.equal(snake.segments[i])) {
                isAppleOnSnake = true;
                break;

            }
        }

    } while (isAppleOnSnake === true);


}

//----------------------------------------------------- 6 - snake + apple -------------------------------
let snake = new Snake();
let apple = new Apple();

/*
let intervalId = setInterval(function () {
    ctx.clearRect(0, 0, width, height);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();
}, 100);

 */




let timeoutID;

let gameloop = function () {
    ctx.clearRect(0, 0, width, height);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();
    timeoutID = setTimeout(gameloop, timeout);
}

gameloop();




//------------------------------------------------------ 7 - Keyboard -------------------------------------
let directions = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
}
document.body.addEventListener("keydown", function (event) {
    let newDirection = directions[event.keyCode];
    if (newDirection !== undefined) {
        snake.setDirection(newDirection);
    }
});