const CELL_WIDTH = 80;
const CELL_HEIGHT = 80;
const CELL_BORDER = 3;
const BLANK_IMAGE_NAME = "row-0-column-1.png";
const FULL_IMAGE_NAME = "full.PNG"
const FULL_IMAGE_TOP = 40;
const FULL_IMAGE_LEFT = 264;
const BOARD_ROW_NUM = 6;
const BOARD_COL_NUM = 3;

//Split image online: https://pinetools.com/split-image

class imgCell {

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
        ctx.clearRect(xPos + CELL_BORDER, yPos + CELL_BORDER, width - 2 * CELL_BORDER, height - 2 * CELL_BORDER);
        img.onload = function () {
            //ctx.clearRect(xPos + CELL_BORDER, yPos + CELL_BORDER, width - 2 * CELL_BORDER, height - 2 * CELL_BORDER);
            ctx.drawImage(img, xPos + CELL_BORDER, yPos + CELL_BORDER, width - 2 * CELL_BORDER, height - 2 * CELL_BORDER);
        };
    }
}

// hàm tạo âm thanh sound
class gameSound {
    soundSrc;
    sound;

    constructor(a0) {
        this.soundSrc = a0;
        this.sound = document.createElement("audio");
        //src lưu thông tin url của file âm thanh
        this.sound.src = this.soundSrc;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
    }

    //hàm play để phát âm thanh
    play() {
        this.sound.play();
    }

    // //hàm stop để dừng âm thanh
    // stop() {
    //     this.sound.pause();
    // }
}

class GameBoard {
    can;
    ctx;
    cellArr;
    imgArr;
    fullImgCell;
    moveUpSound;
    moveDownSound;
    moveLeftSound;
    moveRightSound;
    cantMoveSound;
    changeImgSound;
    winSound;
    score;
    menuShow = false;
    win = false;
    fullImgArr = ["CR7", "GIRL1", "GIRL2", "XE", "CAT", "DOG"];
    msg = document.getElementById("msgHeader");

    roundRect(x, y, width, height, radius, fill, stroke) {
        if (typeof stroke === 'undefined') {
            stroke = true;
        }
        if (typeof radius === 'undefined') {
            radius = 5;
        }
        if (typeof radius === 'number') {
            radius = {tl: radius, tr: radius, br: radius, bl: radius};
        } else {
            let defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
            for (let side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius.tl, y);
        this.ctx.lineTo(x + width - radius.tr, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        this.ctx.lineTo(x + width, y + height - radius.br);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        this.ctx.lineTo(x + radius.bl, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        this.ctx.lineTo(x, y + radius.tl);
        this.ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        this.ctx.closePath();
        if (fill) {
            this.ctx.fill();
        }
        if (stroke) {
            this.ctx.stroke();
        }

    }

    init(imgFol) {

        this.cellArr = [];
        this.imgArr = [];
        this.can = document.getElementById('gameCanvas');
        this.ctx = this.can.getContext('2d');
        this.score = 100;

        this.ctx.fillStyle = "white";
        this.ctx.shadowColor = 'black';
        this.ctx.shadowBlur = 5;
        this.ctx.shadowOffsetX = 5;
        this.ctx.shadowOffsetY = 5;
        this.ctx.fill();
        this.roundRect(110, 5, 260, 614, 10);

        this.ctx.shadowColor = 'transparent';
        this.ctx.fill();
        this.ctx.font = "25px Arial";
        this.ctx.fillStyle = "blue";
        this.ctx.fillText("SLIDING PUZZLE", 135, 30);
        this.drawScore();

        this.fullImgCell = new imgCell(0, 1.2 * CELL_WIDTH, 2 * CELL_HEIGHT, FULL_IMAGE_LEFT, FULL_IMAGE_TOP);
        this.ctx.fillStyle = "rgba(255, 255, 0, .5)";
        this.ctx.strokeStyle = "red";
        this.roundRect(FULL_IMAGE_LEFT, FULL_IMAGE_TOP, 1.2 * CELL_WIDTH, 2 * CELL_HEIGHT, 5, true);

        this.fullImgCell.imgFol = imgFol;
        this.fullImgCell.imgName = FULL_IMAGE_NAME;
        this.fullImgCell.showImage(this.ctx);

        for (let i = 0; i < BOARD_ROW_NUM; i++) {

            this.cellArr[i] = [];
            this.imgArr[i] = [];

            for (let j = 0; j < BOARD_COL_NUM; j++) {

                let x = 120 + j * CELL_WIDTH;
                let y = 130 + i * CELL_HEIGHT;

                let c = new imgCell(1, CELL_WIDTH, CELL_HEIGHT, x, y, i, j + 1)
                let imgName = "row-" + i + "-column-" + (j + 1) + ".png";

                this.ctx.fillStyle = "rgba(255, 255, 0, .5)";
                this.ctx.strokeStyle = "red";

                this.roundRect(x, y, CELL_WIDTH, CELL_HEIGHT, 5, true);

                c.imgFol = imgFol;

                this.imgArr[i][j] = imgName;
                this.cellArr[i][j] = c;

                if (i == 0) {
                    j = j + BOARD_COL_NUM - 1;
                }

            }
        }

        let soundFolder = "normal"
        let soundType = "wav"
        this.moveDownSound = new gameSound("sound/" + soundFolder + "/down." + soundType);
        this.moveUpSound = new gameSound("sound/" + soundFolder + "/up." + soundType);
        this.moveLeftSound = new gameSound("sound/" + soundFolder + "/left." + soundType);
        this.moveRightSound = new gameSound("sound/" + soundFolder + "/right." + soundType);
        this.cantMoveSound = new gameSound("sound/" + soundFolder + "/hit." + soundType);
        this.changeImgSound = new gameSound("sound/" + soundFolder + "/changeImg." + soundType);
        this.winSound = new gameSound("sound/" + soundFolder + "/win." + soundType);
        this.msg.innerHTML = "BẮT ĐẦU<br>Nhấn nút cách để xem hướng dẫn"

        let div = this.msg.parentElement;
        setTimeout(function () {
            div.style.display = "none";
        }, 3000);
    }

    shuffleImg(toWin) {
        fisherYates(this.imgArr, 1);
        for (let i = 0; i < BOARD_ROW_NUM; i++) {
            for (let j = 0; j < BOARD_COL_NUM; j++) {
                if (toWin == true) {
                    let imgName = "row-" + i + "-column-" + (j + 1) + ".png";
                    this.imgArr[i][j] = imgName;
                }
                this.cellArr[i][j].imgName = this.imgArr[i][j];
                if (i == 0) {
                    j = j + BOARD_COL_NUM - 1;
                }
            }
        }

        this.drawAllImages();

        function fisherYates(myArray, startRow) {
            for (let i = myArray.length - 1; i >= startRow; i--) {
                for (let j = myArray[i].length - 1; j > 0; j--) {
                    let m;
                    let n;
                    if (i == startRow) {
                        m = startRow + Math.floor(Math.random() * (myArray.length - 1))
                        n = Math.floor(Math.random() * (myArray[startRow].length - 1))
                    } else {
                        m = startRow + Math.floor(Math.random() * (i - 1))
                        n = Math.floor(Math.random() * (j - 1))
                    }
                    if ((i == startRow && j == 0) || (m == startRow && n == 0)) {

                    } else {
                        let temp = myArray[i][j];
                        myArray[i][j] = myArray[m][n];
                        myArray[m][n] = temp;
                    }
                }
            }
        }
    }

    drawAllImages() {
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

    keyControl(event) {
        event.preventDefault();
        switch (event.which) {
            case 32:
                if (event.ctrlKey == false) {
                    this.showMenu();
                } else {
                    this.winNow();
                }

                break;
            case 37:
                this.moveLeft();
                if (this.win == true) {
                    this.start();
                }
                break;
            case 38:
                this.moveUp();
                if (this.win == true) {
                    this.start();
                }
                break;
            case 39:
                this.moveRight();
                if (this.win == true) {
                    this.start();
                }
                break;
            case 40:
                this.moveDown();
                if (this.win == true) {
                    this.start();
                }
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
                    this.cellArr[i][j].showImage(this.ctx);
                    this.cellArr[i][j + 1].showImage(this.ctx);
                    abort = true;
                    if (i == 0) {
                        j = j + 2;
                    }
                }
            }
        }
        if (abort == true) {
            this.moveLeftSound.play();
            this.score--;
            this.drawScore();
            this.win = this.checkWin();
        } else {
            this.cantMoveSound.play();
        }
    }

    moveRight() {
        let abort = false;
        for (let i = 1; i < 6 && !abort; i++) {
            for (let j = 1; j < 3 && !abort; j++) {
                if (this.cellArr[i][j].imgName == BLANK_IMAGE_NAME) {
                    let temp = this.cellArr[i][j - 1].imgName;
                    this.cellArr[i][j - 1].imgName = this.cellArr[i][j].imgName;
                    this.cellArr[i][j].imgName = temp;
                    this.cellArr[i][j].showImage(this.ctx);
                    this.cellArr[i][j - 1].showImage(this.ctx);
                    abort = true;
                    if (i == 0) {
                        j = j + 2;
                    }
                }
            }
        }
        if (abort == true) {
            this.moveRightSound.play();
            this.score--;
            this.drawScore();
            this.win = this.checkWin();
        } else {
            this.cantMoveSound.play();
        }
    }

    moveUp() {
        let abort = false;
        let topMove = false;
        if (this.cellArr[0][0].imgName == BLANK_IMAGE_NAME) {
            let temp = this.cellArr[1][0].imgName;
            this.cellArr[1][0].imgName = this.cellArr[0][0].imgName;
            this.cellArr[0][0].imgName = temp;
            this.cellArr[0][0].showImage(this.ctx);
            this.cellArr[1][0].showImage(this.ctx);
            topMove = true;
            abort = true;
        } else {
            for (let i = 1; i < 5 && !abort; i++) {
                for (let j = 0; j < 3 && !abort; j++) {
                    if (this.cellArr[i][j].imgName == BLANK_IMAGE_NAME) {
                        let temp = this.cellArr[i + 1][j].imgName;
                        this.cellArr[i + 1][j].imgName = this.cellArr[i][j].imgName;
                        this.cellArr[i][j].imgName = temp;
                        this.cellArr[i][j].showImage(this.ctx);
                        this.cellArr[i + 1][j].showImage(this.ctx);
                        abort = true;
                        if (i == 0) {
                            j = j + 2;
                        }
                    }
                }
            }
        }
        if (abort == true || topMove == true) {
            this.moveUpSound.play();
            this.score--;
            this.drawScore();
            this.win = this.checkWin();
        } else {
            this.cantMoveSound.play();
        }
    }

    moveDown() {
        let abort = false;

        if (this.cellArr[1][0].imgName == BLANK_IMAGE_NAME) {
            let temp = this.cellArr[0][0].imgName;
            this.cellArr[0][0].imgName = this.cellArr[1][0].imgName;
            this.cellArr[1][0].imgName = temp;
            this.cellArr[0][0].showImage(this.ctx);
            this.cellArr[1][0].showImage(this.ctx);
            abort = true;
        } else {
            for (let i = 2; i < 6 && !abort; i++) {
                for (let j = 0; j < 3 && !abort; j++) {
                    if (this.cellArr[i][j].imgName == BLANK_IMAGE_NAME) {
                        let temp = this.cellArr[i - 1][j].imgName;
                        this.cellArr[i - 1][j].imgName = this.cellArr[i][j].imgName;
                        this.cellArr[i][j].imgName = temp;
                        this.cellArr[i][j].showImage(this.ctx);
                        this.cellArr[i - 1][j].showImage(this.ctx);
                        abort = true;
                    }
                }
            }
        }
        if (abort == true) {
            this.moveDownSound.play();
            this.score--;
            this.drawScore();
            this.win = this.checkWin();
        } else {
            this.cantMoveSound.play();
        }
    }

    drawScore() {
        this.ctx.font = "16px Arial";
        this.ctx.clearRect(130, 50, 100, 30);
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(130, 50, 100, 30);
        this.ctx.fillStyle = "blue";
        this.ctx.fillText("Score: " + this.score, 140, 70);
    }

    winNow() {
        this.shuffleImg(true);
        this.win = this.checkWin();
    }

    randomfullImg() {
        let i = Math.floor(Math.random() * this.fullImgArr.length)
        this.imgArr = [];
        this.init(this.fullImgArr[i]);
    }

    changeFullImage(event) {
        let x = event.pageX;
        let y = event.pageY;
        let a = FULL_IMAGE_LEFT + (this.can.offsetLeft + this.can.clientLeft);
        let b = FULL_IMAGE_TOP + (this.can.offsetTop + this.can.clientTop);
        let c = a + 1.2 * CELL_WIDTH;
        let d = b + 2 * CELL_HEIGHT;

        if (a < x && x < c && y > b && y < d) {
            this.randomfullImg();
            this.shuffleImg();
            this.changeImgSound.play();
        }
    }

    checkWin() {
        let win = true;
        for (let i = 0; i < BOARD_ROW_NUM && win == true; i++) {
            for (let j = 0; j < BOARD_COL_NUM && win == true; j++) {
                let imgName = "row-" + i + "-column-" + (j + 1) + ".png";
                if (this.cellArr[i][j].imgName != imgName) {
                    win = false;
                    break;
                }
                if (i == 0) {
                    j = j + 2;
                }
            }
        }
        if (win == true) {
            this.winSound.play();
            this.msg.innerHTML = "THẮNG RỒI!"
            let div = this.msg.parentElement;
            div.style.display = "block";
        }
        return win;
    }

    showMenu() {
        if (this.menuShow == false) {
            this.msg.innerHTML = "Dùng các phím ↓ ↑ ← → để sắp xếp các ô ảnh cho đúng vị trí theo ảnh mẫu phía trên"
            this.msg.innerHTML = this.msg.innerHTML + "<br>Click vào ảnh mẫu để thay đổi ảnh mẫu"
            this.msg.innerHTML = this.msg.innerHTML + "<br>Giữ Ctrl và ấn dấu cách để thử cảm giác chiến thắng :D"
            let div = this.msg.parentElement;
            div.style.display = "block";
            this.menuShow = true;
        } else {
            let div = this.msg.parentElement;
            div.style.display = "none";
            this.menuShow = false;
        }
    }

    start() {
        this.randomfullImg();
        this.shuffleImg(false);
    }

}



let GB = new GameBoard();
GB.start()

