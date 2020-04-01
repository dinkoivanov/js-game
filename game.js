const H_CELLS = 6;
const V_CELLS = 5;
const CELL_SIZE = 20;

const CANVAS_WIDTH = H_CELLS * CELL_SIZE;
const CANVAS_HEIGHT = V_CELLS * CELL_SIZE;
const UPDATES_PER_SECOND = 10;
const V_SPEED_CELLS_PER_SECOND = 2;
const V_SPEED_CELLS_PER_UPDATE = V_SPEED_CELLS_PER_SECOND / UPDATES_PER_SECOND;
const board = [];
for (let i = 0; i < H_CELLS; i++) {
    let column = [];
    for (let j = 0; j < V_CELLS; j++) {
        column.push(false);
    }
    board.push(column);
}

const canvas = document.createElement('canvas');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.style = "border:1px solid #000000;"
document.body.insertBefore(canvas, document.body.childNodes[0]);
const ctx = canvas.getContext('2d');
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
        context.fillRect(this.x * CELL_SIZE, Math.floor(this.y) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }

    this.moveH = (deltaX) => {
        let newX = this.x + deltaX;
        if (newX >= 0 && newX < H_CELLS && !board[newX][Math.floor(this.y)]) {
            this.x = newX;
        }
    };

}

let p = new player(Math.round(H_CELLS / 2), 0, 'red');

function movePieces() {
    switch(k) {
        case 37:
            p.moveH(-1);
            break;
        case 39:
            p.moveH(1);
            break;
    }
    k = 0;

    p.y += V_SPEED_CELLS_PER_UPDATE;
    let f = Math.floor(p.y);
    if (f >= V_CELLS || board[p.x][f]) {
        let row = f-1;
        board[p.x][row] = true;

        // check for filled line
        let col = 0;
        while (col < H_CELLS && board[col][row]) {
            col++;
        }
        // filled line, remove
        if (col == H_CELLS) {
            for (let r = row; r > 0; r--) {
                for (col = 0; col < H_CELLS; col++) {
                    board[col][r] = board[col][r-1];
                }    
            }
        }

        p = new player(Math.round(H_CELLS / 2), 0, 'red');
    }
}

function drawScene() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    for (let i = 0; i < H_CELLS; i++) {
        for (let j = 0; j < V_CELLS; j++) {
            if (board[i][j]) {
                ctx.fillStyle = 'blue';
                ctx.fillRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }

    p.draw(ctx);

}

function gameLoop() {
    movePieces();
    drawScene();
}

setInterval(gameLoop, 1000 / UPDATES_PER_SECOND);
