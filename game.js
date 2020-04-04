const SHAPE_T = [[0, 1],[1, 1],[0, 1]];
const SHAPE_2 = [[1, 0],[1, 1],[0, 1]];
const SHAPE_5 = [[0, 1],[1, 1],[1, 0]];
const SHAPE_0 = [[1, 1],[1, 1]];
const SHAPE_I = [[1, 1, 1, 1]];
const ALL_SHAPES = [SHAPE_T, SHAPE_2, SHAPE_5, SHAPE_0, SHAPE_I];

const H_CELLS = 12;
const V_CELLS = 8;
const CELL_SIZE = 20;

const CANVAS_WIDTH = H_CELLS * CELL_SIZE;
const CANVAS_HEIGHT = V_CELLS * CELL_SIZE;
const UPDATES_PER_SECOND = 10;
const V_SPEED_CELLS_PER_SECOND = 2;
const V_SPEED_CELLS_PER_UPDATE = V_SPEED_CELLS_PER_SECOND / UPDATES_PER_SECOND;

function brick() {
    let randomIndex = Math.floor(Math.random() * Math.floor(ALL_SHAPES.length));
    this.shape = ALL_SHAPES[randomIndex];
    this.x = Math.round((H_CELLS - this.shape.length)/ 2);
    this.y = 0;
    this.color = 'red';

    this.draw = context => {
        context.fillStyle = this.color;
        for (let col = 0; col < this.shape.length; col++) {
            let c = this.shape[col];
            for (let row = 0; row < c.length; row++) {
                if (c[row] == 1) {
                    context.fillRect((this.x + col)* CELL_SIZE, (Math.floor(this.y) + row) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                }
            }
        }
    }

    this.allow = (nx, ny) => {
        let allow = true;
        for (let col = 0; col < this.shape.length && allow; col++) {
            let c = this.shape[col];
            for (let row = 0; row < c.length && allow; row++) {
                if (c[row] == 1) {
                    allow = nx + col >= 0 && nx + col < H_CELLS && !board[nx + col][ny + row];
                }
            }
        }
        return allow;
    } 

    this.moveH = (deltaX) => {
        let newX = this.x + deltaX;
        if (this.allow(newX, Math.floor(this.y))) {
            this.x = newX;
        }
    };

}

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

    // check hit
    let hit = false;
    for (let col = 0; col < p.shape.length && !hit; col++) {
        let c = p.shape[col];
        for (let row = 0; row < c.length && !hit; row++) {
            if (c[row] == 1) {
                hit = f + row >= V_CELLS || board[p.x + col][f + row];
            }
        }
    }

    if (hit) {
        let r1 = f-1;

        // put the brick in place
        for (let col = 0; col < p.shape.length; col++) {
            let c = p.shape[col];
            for (let row = 0; row < c.length; row++) {
                if (c[row] == 1) {
                    board[p.x + col][row + r1] = true;
                }
            }
        }

        // check for filled lines
        for (let row = 0; row < p.shape.length; row++) {
            let col = 0;
            while (col < H_CELLS && board[col][r1 + row]) {
                col++;
            }
            // filled line, remove
            if (col == H_CELLS) {
                for (let r = r1 + row; r > 0; r--) {
                    for (col = 0; col < H_CELLS; col++) {
                        board[col][r] = board[col][r-1];
                    }    
                }
            }
        }

        p = new brick();
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
let p = new brick();

setInterval(gameLoop, 1000 / UPDATES_PER_SECOND);
