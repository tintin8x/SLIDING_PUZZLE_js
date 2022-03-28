const CELL_WIDTH = 80;
const CELL_HEIGHT = 80;
const CELL_BORDER = 3;
const BLANK_IMAGE_NAME = "row-0-column-1.png";
const FULL_IMAGE_NAME = "full.PNG"
const FULL_IMAGE_TOP = 40;
const FULL_IMAGE_LEFT = 260;
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
    // width;
    // height;
    moveUpSound;
    moveDownSound;
    moveLeftSound;
    moveRightSound;
    cantMoveSound;
    changeImgSound;
    winSound;
    score;
    win = "false"
    fullImgArr = ["CR7", "GIRL1", "GIRL2", "XE", "CAT", "DOG"];
    msg = document.getElementById("msgHeader");

    init(imgFol) {

        this.cellArr = [];
        this.imgArr = [];
        this.can = document.getElementById('gameCanvas');
        this.ctx = this.can.getContext('2d');
        this.score = 100;

        this.ctx.fillStyle = "white";
        this.ctx.fillRect(110, 5, 255, 600);

        this.ctx.font = "25px Arial";
        this.ctx.fillStyle = "blue";
        this.ctx.fillText("SLIDING PUZZLE", 135, 30);
        this.drawScore();

        this.fullImgCell = new imgCell(0, 1.2 * CELL_WIDTH, 2 * CELL_HEIGHT, FULL_IMAGE_LEFT, FULL_IMAGE_TOP);
        this.ctx.beginPath();
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(260, 40, 1.2 * CELL_WIDTH, 2 * CELL_HEIGHT);
        this.ctx.closePath();

        this.fullImgCell.imgFol = imgFol;
        this.fullImgCell.imgName = FULL_IMAGE_NAME;
        this.fullImgCell.showImage(this.ctx);

        for (let i = 0; i < BOARD_ROW_NUM; i++) {

            this.cellArr[i] = [];
            this.imgArr[i] = [];

            for (let j = 0; j < BOARD_COL_NUM; j++) {

                let x = 120 + j * CELL_WIDTH - j * CELL_BORDER;
                let y = 130 + i * CELL_HEIGHT - i * CELL_BORDER;

                let c = new imgCell(1, CELL_WIDTH, CELL_HEIGHT, x, y, i, j + 1)
                let imgName = "row-" + i + "-column-" + (j + 1) + ".png";

                this.ctx.beginPath();
                this.ctx.fillStyle = 'blue';
                this.ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
                this.ctx.fillStyle = 'white';
                this.ctx.fillRect(x + CELL_BORDER, y + CELL_BORDER, CELL_WIDTH - 2 * CELL_BORDER, CELL_HEIGHT - 2 * CELL_BORDER);
                this.ctx.closePath();

                c.imgFol = imgFol;

                this.imgArr[i][j] = imgName;
                this.cellArr[i][j] = c;

                if (i == 0) {
                    j = j + 2;
                }

            }
        }

        // this.moveSound = new gameSound("sound/move.wav");
        // this.cantMoveSound = new gameSound("sound/hit.wav");
        // this.changeImgSound = new gameSound("sound/changeImg.wav");
        this.moveDownSound = new gameSound("sound/Xuống.mp3");
        this.moveUpSound = new gameSound("sound/Lên.mp3");
        this.moveLeftSound = new gameSound("sound/Trái.mp3");
        this.moveRightSound = new gameSound("sound/Phải.mp3");
        this.cantMoveSound = new gameSound("sound/Vướng rồi.mp3");
        this.changeImgSound = new gameSound("sound/Đổi ảnh.mp3");
        this.winSound = new gameSound("sound/Thắng rồi.mp3");
        this.msg.innerHTML = "BẮT ĐẦU"
        let div = GB.msg.parentElement;
        setTimeout(function(){ div.style.display = "none"; }, 1500);
    }

    shuffleImg() {
        fisherYates(this.imgArr, 1);
        for (let i = 0; i < BOARD_ROW_NUM; i++) {
            for (let j = 0; j < BOARD_COL_NUM; j++) {
                this.cellArr[i][j].imgName = this.imgArr[i][j];
                if (i == 0) {
                    j = j + BOARD_COL_NUM - 1;
                }
            }
        }

        this.drawAllImages();
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

    moveCell(event) {

        switch (event.which) {
            case 37:
                this.moveLeft();
                if( this.win == true){this.start();}
                break;
            case 38:
                this.moveUp();
                if( this.win == true){this.start();}
                break;
            case 39:
                this.moveRight();
                if( this.win == true){this.start();}
                break;
            case 40:
                this.moveDown();
                if( this.win == true){this.start();}
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

        if (a<x && x<c && y > b && y < d) {
            this.randomfullImg();
            this.shuffleImg();
            this.changeImgSound.play();
        }
    }

    checkWin(){
        let win = true;
        for (let i = 0; i < BOARD_ROW_NUM && win == true; i++) {
            for (let j = 0; j < BOARD_COL_NUM && win == true; j++) {
                let imgName = "row-" + i + "-column-" + (j + 1) + ".png";
                if(this.cellArr[i][j].imgName != imgName){
                    win = false;
                    break;
                }
                if (i == 0) {
                    j = j + 2;
                }
            }
        }
        if (win == true){
            this.winSound.play();
            this.msg.innerHTML = "THẮNG RỒI!"
            let div = this.msg.parentElement;
            div.style.display = "block";
        }
        return win;
    }

    start(){
        this.randomfullImg();
        this.shuffleImg();
    }

}

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
            if((i == startRow && j == 0) || (m == startRow && n ==0 )){

            }else{
                let temp = myArray[i][j];
                myArray[i][j] = myArray[m][n];
                myArray[m][n] = temp;
            }
        }
    }
}

window.addEventListener("keydown", function (e) {
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Generate random number
        let j = Math.floor(Math.random() * (i + 1));

        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

let GB = new GameBoard();
GB.start()

