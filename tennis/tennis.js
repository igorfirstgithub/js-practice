//-------------------------------------------------------------- 1 - Canvas --------
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let width = canvas.width;
let height = canvas.height;

let blockSize = 10;
let widthInBlocks = width / blockSize;
let heightInBlocks = height / blockSize;

let score = 0;
let timeout = 100;
//let turboBoost = 0;

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
    ctx.fillText("Score: " + score, blockSize, blockSize);
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
        new Block(9, heightInBlocks-2),
        new Block(8, heightInBlocks-2),
        new Block(7, heightInBlocks-2),
        new Block(6, heightInBlocks-2),
        new Block(5, heightInBlocks-2)
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
    let tail = this.segments[this.segments.length-1];
    let newHead;
    let newTail;

    this.direction = this.nextDirection;

    if (this.direction === "right" && head.col < widthInBlocks - 2) {
        newHead = new Block(head.col + 1, head.row);
        this.segments.unshift(newHead);
        this.segments.pop();
    } else if (this.direction === "left" && tail.col > 1) {
        newTail = new Block(tail.col - 1, tail.row);
        this.segments.push(newTail);
        this.segments.shift();
    }

   /* if (this.checkCollision(newHead)) {
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

    */

    //this.segments.unshift(newHead);
    //this.segments.pop();



}


Snake.prototype.checkCollision = function (head) {
    let leftCollision = (tail.col === 0);
    //let topCollision = (head.row === 0);
    let rightCollision = (head.col === widthInBlocks - 1);
    //let bottomCollision = (head.row === heightInBlocks - 1);

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

   /* if (this.direction === "up" && newDirection === "down") {
        if (turboBoost > 0) {turboBoost--; timeout +=10;}
        return;

    */

    //} else

   /* if (this.direction === "right" && newDirection === "left") {
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

    */

    this.nextDirection = newDirection;


}

//------------------------------------------------------ 5 - Apple -----------------------------------
/*
let Apple = function () {
    this.position = new Block(10, 10);

}

Apple.prototype.draw = function () {
    this.position.drawCircle("LimeGreen");
}

Apple.prototype.move = function () {
}

 */

//----------------------------------------------------- 5/5 - Ball --------------------------------------
let Ball = function (radius = 20) {
    this.x = width/6;        //starting position
    this.y = height/2;

    this.xSpeed = 3;    // initial movement vector (5; 0)
    this.ySpeed = 5;

    this.speed = 5;
    this.radius = 30;
};

Ball.prototype.move = function () {

    this.x += this.xSpeed;
    this.y += this.ySpeed;

    if (this.x < this.radius + blockSize ) {
        this.xSpeed *= -1;
    }  else if (this.x > width - this.radius - blockSize) {
        this.xSpeed *= -1;
    }

    if (this.y < this.radius + blockSize) {
        this.ySpeed *= -1;
    }
    else if (this.y === width - this.radius - 2 * blockSize   &&   this.ySpeed > 0) {
        for (let i = 0; i < snake.segments.length; i++) {
            if (snake.segments[i].col * 10 < this.x   &&   snake.segments[i].col * 10 + blockSize > this.x) {
                this.ySpeed *= -1.15;
                this.xSpeed *= 1.2;
                score++;

            }
        }

    }

    else if (this.y > height - this.radius - blockSize) {

        gameOver();
       // this.ySpeed *= -1;
       // score++;
    }
};

Ball.prototype.draw = function () {

    circle(this.x, this.y, this.radius, true);
};

//----------------------------------------------------- 6 - snake + apple -------------------------------
let snake = new Snake();
let ball = new Ball();

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
    snake.draw();
    ball.move();
    ball.draw();
    drawBorder();
    timeoutID = setTimeout(gameloop, timeout);
}

gameloop();




//------------------------------------------------------ 7 - Keyboard -------------------------------------
let directions = {
    37: "left",
    //38: "up",
    39: "right",
    //40: "down"
}
document.body.addEventListener("keydown", function (event) {

    let newDirection = directions[event.keyCode];
    if (newDirection !== undefined) {

        snake.setDirection(newDirection);
        snake.move();
    }
})