const canvas = document.getElementById('canvas');

const ctx = canvas.getContext('2d');

canvas.width = 96;
canvas.height = 64;

const halfWidth = canvas.width / 2;
const halfHeight = canvas.height / 2;

var background =    loadImage('./img/bg.png');
var selectorImg =   loadImage('./img/selector.png');
var bowl =          loadImage('./img/bowl.png');
var hippoImage =    loadImage('./img/hippo.png');
var bitehippo =     loadImage('./img/bitehippo.png');

var pineapple =     loadImage('./img/pineapple.png');
var pumpkin =       loadImage('./img/pumpkin.png');
var watermellon =   loadImage('./img/watermellon.png');
var alligator =     loadImage('./img/alligator.png');
var oofalligator =  loadImage('./img/oofalligator.png');

var fruits = [pineapple, pumpkin, watermellon, alligator];

var pixelFont = new FontFace('pixelFont', 'url(font/3-by-5-pixel-font.ttf)');
document.fonts.add(pixelFont)
ctx.imageSmoothingEnabled = false;

var POINTS = 0;
var totalClicked = 0;
var isClicked = false;
var die = false;

function loadImage(src) {
    var img = new Image();
    img.src = src;
    this.onload = function() {
        return true;
    }
    return img;
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var hippoTime = 0;
class hippo {
    constructor(hippoIMG) {
        this.hippoIMG = hippoIMG;
        console.log(this.hippoIMG.width);
        if (this.hippoIMG.width == 0) {
            this.hippoIMG.width = 75;
        }
        this.pos = vec2(halfWidth - this.hippoIMG.width / 2, 0);
        console.log(this.pos.x);
    }
    
    draw() {
        ctx.drawImage(this.hippoIMG, this.pos.x, this.pos.y);
        if (this.hippoIMG == bitehippo) {
            hippoTime++;
            if (hippoTime > 3) {
                this.hippoIMG = hippoImage;
                hippoTime = 0;
            }
        }
    }
}

class selector {
    constructor(pos, velocity) {
        this.pos = pos;
        this.velocity = velocity;
        this.arrowPoint = 1;
    }
    
    update() {
        this.pos.x -= this.velocity;
        this.arrowPoint += 1;
        if (isClicked && currentFruit.pos.y > 0) {
            if (currentFruit.name == "alligator") {
                currentFruit.fruitIMG = oofalligator;
                console.log("Game Over");
                die = true;
                return;
            }
            
            totalClicked++;
            if (this.arrowPoint >= 1 && this.arrowPoint <= 4) {
                POINTS += 10;
            } else if (this.arrowPoint > 4 && this.arrowPoint <= 9) {
                POINTS += 5;
            } else if (this.arrowPoint > 9 && this.arrowPoint <= 12) {
                POINTS += 1;
            }
            hippopotamous.hippoIMG = bitehippo;
            console.log("hi it changed?");
            //sleep(5);
            //hippopotamous.hippoIMG = hippoImage;
            currentFruit = newFruit();
        }
        
        if (this.pos.x < 0 || isClicked == true) {
            if (isClicked == false && currentFruit.name != "alligator") {
                console.log("Game Over");
                die = true;
                return;
            }
            if (currentFruit.name == "alligator") {
                POINTS += 20;
                currentFruit = newFruit();
            }
            this.pos.x = canvas.width - 8;
            isClicked = false;
            this.arrowPoint = 1;
        }
    }
    
    draw() {
        ctx.drawImage(selectorImg, this.pos.x, this.pos.y);
    }
}

class fruitFall {
    constructor(fruitIMG) {
        this.velocity = 6;
        this.fruitIMG = fruitIMG;
        if (this.fruitIMG.width == 0) {
            this.fruitIMG.width = 32;
        }
        this.pos = vec2(halfWidth - fruitIMG.width / 2, -fruitIMG.height -50);

        var fullPath = fruitIMG.src;
        var array = fullPath.split("/")
        this.name = array[array.length - 1].replace(".png", "");
    }

    update() {
        if (this.pos.y < 13) {
            this.pos.y += this.velocity;
        } else {
            this.pos.y = 14;
        }
    }

    draw() {
        ctx.drawImage(this.fruitIMG, this.pos.x, this.pos.y);
    }
}
//const Bird = new bird(vec2(halfWidth - 50, halfHeight), vec2(5,5), 15)
const selecter = new selector(vec2(canvas.width - 8, canvas.height - 9), 8);
function newFruit() {
    var fruit = fruits[Math.floor(Math.random()*fruits.length)]
    console.log(fruit);
    return new fruitFall(fruit);
}
var currentFruit = newFruit();
var hippopotamous = new hippo(hippoImage)

function startGame() {
    gameLoop();
}

// https://jakesgordon.com/writing/javascript-game-foundations-sound/
function createAudio(src) {
    var audio = document.createElement('audio');
    audio.volume = 0.5;
    //audio.loop   = options.loop;
    audio.src = src;
    return audio;
}

//var bounce = createAudio('./sound/bounce.wav');

function vec2(x, y) {
    return {x: x, y: y};
}

counter = 0;
function gameUpdate() {
    counter++;
    //console.log(counter);
    if (counter % 4 == 0) {
        selecter.update();
    }
    currentFruit.update();
}

function outlineText(text, x, y, size, outline) {
    ctx.font = `${size * 8}px pixelFont`;
    if (outline) {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 8;
        ctx.strokeText(text, x, y);
    }
    ctx.fillStyle = '#1b1c1b';
    ctx.strokeStyle = '#1b1c1b';
    ctx.fillText(text, x, y);
}

function gameDraw() {
    ctx.drawImage(background, 0, 0);

    pixelFont.load().then(() => {
        outlineText(`${POINTS}`, 3, 6, 1, false);

        outlineText(`${totalClicked}`, canvas.width-15, 6, 1, false);
    });

    hippopotamous.draw()
    console.log(hippopotamous.pos.x);

    ctx.drawImage(bowl, halfWidth - 22, canvas.height - 24);
    currentFruit.draw();
    selecter.draw();
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    window.requestAnimationFrame(gameLoop);

    gameUpdate();
    gameDraw();
}

document.addEventListener('pointerdown', (event) => {
    console.log("MOUSE CLICKED");
    isClicked = true;
});

gameLoop();