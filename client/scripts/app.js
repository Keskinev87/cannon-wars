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
// app.renderer.view.style.position = "absolute";
// app.renderer.view.style.display = "block";
// app.renderer.autoResize = true;
// app.renderer.resize(window.innerWidth, window.innerHeight);

loader
    .add("images/survivor.png")
    .on("progress", loadProgressHandler)
    .load(setup);
  
function loadProgressHandler() {
    console.log("loading"); 
    console.log("progress: " + loader.progress + "%"); 
}

document.body.appendChild(app.view);

let pillar;
let player; 
let state;
let width = app.renderer.width;
let height = app.renderer.height;
let t = new Tink(PIXI, app.renderer.view); //tink library
let pointer;
let pointerPressed = false;
let controlLine;
let projectiles=[];

function setup() {
    pillar = new Graphics();
    player = new Graphics();
    controlLine = new Graphics();
    pointer = t.makePointer();

    //draw the pillar
    pillar.beginFill(0x66CCFF);
    pillar.drawRect(0.1 * width, 0.8 * height, 0.1 * width, 0.2* height);
    pillar.endFill();
    

    player.beginFill(0x9966FF);
    player.drawCircle(0, 0, 0.05 * width);
    player.endFill();
    player.x = 0.15 * width;
    player.y = 0.8*height - 0.05 * width;

    pointer.press = () => {
        console.log(pointer.x, pointer.y);
        pointerPressed = true;
        pointer.startX = pointer.x;
        pointer.startY = pointer.y;
    };

    pointer.release = () => {
        console.log(player.x, player.y)
        pointerPressed = false;
        if(pointer.x != pointer.startX || pointer.y != pointer.startY)
            releaseProjectile(player.x, player.y, 2, 0);
    };

    pointer.tap = () => console.log("The pointer was tapped");

    function releaseProjectile (x, y, vx, vy) {
        console.log("projectile.released");
        let projectile = new Graphics();
        projectile.x = x;
        projectile.y = y;
        projectile.vx = vx;
        projectile.vy = vy;
        projectile.radius = 10;
        projectile.beginFill(0x9966FF);
        projectile.drawCircle(0, 0, projectile.radius);
        projectile.endFill();  
        projectiles.push(projectile);
        app.stage.addChild(projectile);
        console.log(projectiles)
        console.log(app.stage)
    }

    app.stage.addChild(pillar);
    app.stage.addChild(player);
    app.stage.addChild(controlLine);

    state = play;
    //Start the game loop 
    app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta){
    //Update the current game state:
    state(delta);
}
      
function play(delta) {

    controlLine.clear();
    if(pointerPressed) {
        controlLine.lineStyle(1, 0xFFFFFF, 1);
        controlLine.moveTo(pointer.startX, pointer.startY);
        controlLine.lineTo(pointer.x, pointer.y);
    }

    projectiles.forEach(function(projectile, index) {
        let A = 45;
        let v = 40
        let h = 480;
        projectile.x += projectile.vx;
        projectile.y = h - 4.9 * Math.pow((projectile.x / (v*Math.cos(A * Math.PI / 180))), 2) + Math.tan(A * Math.PI/180) * projectile.x
        console.log(projectile.y);
        if(contain(projectile, width, height)) {
            projectile.clear();
            projectiles.splice(index, 1);
        }
           
    })

   
}

//Add the canvas that Pixi automatically created for you to the HTML document
