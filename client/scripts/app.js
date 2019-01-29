let type = "WebGL"

if(!PIXI.utils.isWebGLSupported()){
      type = "canvas"
}

PIXI.utils.sayHello(type)

let Application = PIXI.Application,
loader = PIXI.loader,
resources = PIXI.loader.resources,
Sprite = PIXI.Sprite;
Graphics = PIXI.Graphics;

let app = new Application({ 
        antialias: true,    // default: false
        transparent: false, // default: false
        resolution: 1       // default: 1
    }
);

app.renderer.backgroundColor = 0x061639;
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

loader
    .add("images/survivor.png")
    .on("progress", loadProgressHandler)
    .load(setup);
  
function loadProgressHandler() {
    console.log("loading"); 
    console.log("progress: " + loader.progress + "%"); 
}

let pillar;
let player; 
let state;
let width = window.innerWidth;
let height = window.innerHeight;
let t = new Tink(PIXI, app.renderer.view); //tink library
let pointer;
let pointerPressed = false;

function setup() {
    pillar = new Graphics();
    player = new Graphics();
    pointer = t.makePointer();

    pointer.press = () => {
        console.log(pointer.x, pointer.y);
        pointerPressed = true;
    };
    pointer.release = () => {
        pointerPressed = false;
    };
    pointer.tap = () => console.log("The pointer was tapped");

    //draw the pillar
    pillar.beginFill(0x66CCFF);
    pillar.drawRect(0.1 * width, 0.8 * height, 0.1 * width, 0.2* height);
    pillar.endFill();
    app.stage.addChild(pillar);

    player.beginFill(0x9966FF);
    player.drawCircle(0, 0, 0.05 * width);
    player.endFill();
    player.x = 0.15 * width;
    player.y = 0.8*height - 0.05 * width;
    app.stage.addChild(player);

    state = play;
    //Start the game loop 
    app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta){
    //Update the current game state:
    state(delta);
}
      
function play(delta) {
    if(pointerPressed) {
        let line = new Graphics();
        line.lineStyle(2, 0xFFFFFF, 1);
        line.moveTo(player.x, player.y);
        line.lineTo(pointer.x, pointer.y);
        app.stage.addChild(line);
    }
   
}

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);