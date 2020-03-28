const H_CELLS = 25;
const V_CELLS = 35;
const CELL_SIZE = 20;

const CANVAS_WIDTH = H_CELLS * CELL_SIZE;
const CANVAS_HEIGHT = V_CELLS * CELL_SIZE;
let canvas = document.createElement('canvas');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.style = "border:1px solid #000000;"
document.body.insertBefore(canvas, document.body.childNodes[0]);
let ctx = canvas.getContext('2d');
let k;
window.addEventListener('keydown', e => {
    k = e.keyCode;
    e.preventDefault();
}, false);


function player(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;

    this.draw = context => {
        context.fillStyle = this.color;
        context.fillRect(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }

    this.outside = (x, y) => x < 0 || y < 0 || x >= H_CELLS || y >= V_CELLS;

    this.move = (deltaX, deltaY) => {
        if (!this.outside(this.x + deltaX, this.y + deltaY)) {
            this.x += deltaX;
            this.y += deltaY;
        }
    }

    this.moveUp = () => this.move(0, -1);
    this.moveDown = () => this.move(0, 1);
    this.moveLeft = () => this.move(-1, 0);
    this.moveRight = () => this.move(1, 0);
}

let p = new player(0, 0, 'red');

function movePieces() {
    switch(k) {
        case 37:
            p.moveLeft();
            break;
        case 38:
            p.moveUp();
            break;
        case 39:
            p.moveRight();
            break;
        case 40:
            p.moveDown();
            break;
    }
    k = 0;
}

function drawScene() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    p.draw(ctx);
}

function gameLoop() {
    movePieces();
    drawScene();
}

setInterval(gameLoop, 100);
