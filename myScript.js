const CELL_WIDTH = 80;
const CELL_HEIGHT = 80;
const MOVE_SPEED = 10;
const CELL_BORDER = 2;
const BLANK_IMAGE_NAME = "row-0-column-1.png";

const MOVE_LEFT = "left";
const MOVE_RIGHT = "right";
const MOVE_UP = "up";
const MOVE_DOWN = "down";


class picCell {

    flag;
    width;
    height;
    xPos;
    yPos;
    rowId;
    colId;
    imgFol;
    imgName;

    constructor(a0, a1, a2, a3, a4, a5, a6, a7, a8) {
        this.flag = a0;  //flag = 0: Full image cell; flag = 1; Split image cell
        this.width = a1;
        this.height = a2;
        this.xPos = a3;
        this.yPos = a4;
        this.rowId = a5;
        this.colId = a6;
        this.imgFol = a7;
        this.imgName = a8;
    }

    showImage(ctx) {
        let img = new Image();
        let xPos = this.xPos;
        let yPos = this.yPos;
        let width = this.width;
        let height = this.height;
        img.src = "image/" + this.imgFol + "/" + this.imgName;
        ctx.clearRect(xPos + 2, yPos + 2, width - 2 * CELL_BORDER, height - 2 * CELL_BORDER);
        img.onload = function () {
            //ctx.clearRect(xPos + 2, yPos + 2, width - 2 * CELL_BORDER, height - 2 * CELL_BORDER);
            ctx.drawImage(img, xPos + 2, yPos + 2, width - 2 * CELL_BORDER, height - 2 * CELL_BORDER);
        };
    }
}

class GameBoard {
    ctx;
    cellArr;
    width;
    height;

    start(imgFol) {

        this.cellArr = [];
        let canvas = document.getElementById('gameCanvas');
        this.ctx = canvas.getContext('2d');

        let a = new picCell(0, 1.2 * CELL_WIDTH, 2 * CELL_HEIGHT, 240, 10);
        a.imgFol = imgFol;
        a.imgName = "full.PNG";
        a.showImage(this.ctx);

        for (let i = 0; i < 6; i++) {

            this.cellArr[i] = [];

            for (let j = 0; j < 3; j++) {

                let x = 100 + j * CELL_WIDTH - j * CELL_BORDER;
                let y = 100 + i * CELL_HEIGHT - i * CELL_BORDER;

                let c = new picCell(1, CELL_WIDTH, CELL_HEIGHT, x, y, i, j + 1)
                let imgName = "row-" + i + "-column-" + (j + 1) + ".png";

                this.ctx.beginPath();
                this.ctx.fillStyle = 'yellow';
                this.ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
                this.ctx.fillStyle = 'white';
                this.ctx.fillRect(x + CELL_BORDER, y + CELL_BORDER, CELL_WIDTH - 2 * CELL_BORDER, CELL_HEIGHT - 2 * CELL_BORDER);
                this.ctx.closePath();

                c.imgFol = imgFol;
                c.imgName = imgName;
                c.showImage(this.ctx);

                this.cellArr[i][j] = c;

                if (i == 0) {
                    j = j + 2;
                }

            }
        }
    }

    reDrawImages() {
        //this.ctx.clearRect(0,0,500,700);
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 3; j++) {

                let c = this.cellArr[i][j];
                c.showImage(this.ctx);
                console.log("loaded : " + c.imgName)

                if (i == 0) {
                    j = j + 2;
                }
            }
        }
    }

    moveCell(event) {

        switch (event.which) {
            case 37:
                this.moveLeft();
                break;
            case 38:
                this.moveUp();
                break;
            case 39:
                this.moveRight();
                break;
            case 40:
                this.moveDown();
                break;
        }

    }

    moveLeft() {
        let abort = false;
        for (let i = 1; i < 6 && !abort; i++) {
            for (let j = 0; j < 2 && !abort; j++) {
                if (this.cellArr[i][j].imgName == BLANK_IMAGE_NAME) {
                    let temp = this.cellArr[i][j + 1].imgName;
                    this.cellArr[i][j + 1].imgName = this.cellArr[i][j].imgName;
                    this.cellArr[i][j].imgName = temp;
                    abort = true;

                    if (i == 0) {
                        j = j + 2;
                    }
                }
            }
        }
        this.reDrawImages();
    }

    moveRight() {
        let abort = false;
        for (let i = 1; i < 6 && !abort; i++) {
            for (let j = 1; j < 3 && !abort; j++) {
                if (this.cellArr[i][j].imgName == BLANK_IMAGE_NAME) {
                    let temp = this.cellArr[i][j - 1].imgName;
                    this.cellArr[i][j - 1].imgName = this.cellArr[i][j].imgName;
                    this.cellArr[i][j].imgName = temp;
                    abort = true;
                    if (i == 0) {
                        j = j + 2;
                    }
                }
            }
        }
        this.reDrawImages();
    }

    moveUp() {
        let abort = false;
        if(this.cellArr[0][0].imgName == BLANK_IMAGE_NAME){
            let temp = this.cellArr[1][0].imgName;
            this.cellArr[1][0].imgName = this.cellArr[0][0].imgName;
            this.cellArr[0][0].imgName = temp;
        }else {
            for (let i = 1; i < 5 && !abort; i++) {
                for (let j = 0; j < 3 && !abort; j++) {
                    if (this.cellArr[i][j].imgName == BLANK_IMAGE_NAME) {
                        let temp = this.cellArr[i + 1][j].imgName;
                        this.cellArr[i + 1][j].imgName = this.cellArr[i][j].imgName;
                        this.cellArr[i][j].imgName = temp;
                        abort = true;
                        if (i == 0) {
                            j = j + 2;
                        }
                    }
                }
            }
        }
        this.reDrawImages();
    }

    moveDown() {
        let abort = false;
        for (let i = 1; i < 6 && !abort; i++) {
            for (let j = 0; j < 3 && !abort; j++) {
                if (this.cellArr[i][j].imgName == BLANK_IMAGE_NAME) {
                    let temp = this.cellArr[i - 1][j].imgName;
                    this.cellArr[i - 1][j].imgName = this.cellArr[i][j].imgName;
                    this.cellArr[i][j].imgName = temp;
                    abort = true;
                    if (i == 0) {
                        j = j + 2;
                    }
                }
            }
        }
        this.reDrawImages();
    }

}

let GB = new GameBoard();
GB.start("CR7");

