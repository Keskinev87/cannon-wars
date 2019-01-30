let type = "WebGL"

if(!PIXI.utils.isWebGLSupported()){
      type = "canvas"
}

PIXI.utils.sayHello(type)

serverCom();
let Application = PIXI.Application;
let loader = PIXI.loader;
let resources = PIXI.loader.resources;
let Sprite = PIXI.Sprite;
let Graphics = PIXI.Graphics;
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


let pillar = player.pillar;
let playerCannon = player.playerCannon; 
let state;
let width = app.renderer.width;
let height = app.renderer.height;
player.randomizeCoords(width, height); //the player is initialized in the sockets. 
let t = new Tink(PIXI, app.renderer.view); //tink library
let pointer;
let pointerPressed = false;
let controlLine;
let projectiles=[];
let maxVelocity = 40;

function setup() {
    pillar = new Graphics();
    playerCannon = new Graphics();
    controlLine = new Graphics();
    pointer = t.makePointer();

    //draw the pillar
    pillar.beginFill(0x66CCFF);
    pillar.drawRect(player.pillarCoords.x, player.pillarCoords.y, 0.05 * width, height - player.pillarCoords.y);
    pillar.endFill();
    

    playerCannon.beginFill(0x9966FF);
    playerCannon.drawCircle(0, 0, 0.05 * width);
    playerCannon.endFill();
    playerCannon.x = player.cannonCoords.x;
    playerCannon.y = player.cannonCoords.y;

    pointer.press = () => {
        console.log(pointer.x, pointer.y);
        pointerPressed = true;
        pointer.startX = pointer.x;
        pointer.startY = pointer.y;
    };

    pointer.release = () => {
        console.log(playerCannon.x, playerCannon.y)
        pointerPressed = false;
        if(pointer.x != pointer.startX || pointer.y != pointer.startY)
            releaseProjectile(playerCannon.x, playerCannon.y, pointer.startX, pointer.startY, pointer.x, pointer.y);
    };

    pointer.tap = () => console.log("The pointer was tapped");

    function releaseProjectile (x, y, controlLineStartX, controlLineStartY, controlLineEndX, controlLineEndY) {
        console.log("projectile.released");
        //calculate the angle between the control line and the X axis in radians
        let axisAngle = angle(controlLineStartX, controlLineStartY, controlLineEndX, controlLineEndY);
        let power = calculatePower(controlLineStartX, controlLineStartY, controlLineEndX, controlLineEndY);

        console.log(axisAngle);
        let projectile = new Graphics();
        projectile.t = 0;
        projectile.x = x;
        projectile.y = y;
        projectile.vx = power * maxVelocity * Math.cos(axisAngle);
        projectile.vy = power * maxVelocity * Math.sin(axisAngle);
        projectile.radius = 10;
        projectile.beginFill(0x9966FF);
        projectile.drawCircle(0, 0, projectile.radius);
        projectile.endFill(); 
        
         
        projectiles.push(projectile);
        app.stage.addChild(projectile);
        
    }

    app.stage.addChild(pillar);
    app.stage.addChild(playerCannon);
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
        projectile.t += 0.0167;
        projectile.x += projectile.vx;
        projectile.vy = projectile.vy - 1 * 9.8 * projectile.t;
        projectile.y = projectile.y - projectile.vy;
        // projectile.y = projectile.startY - projectile.vy * projectile.t + 0.5 * 9.8 / 60 * Math.pow(projectile.t, 2) 
        
        if(contain(projectile, width, height)) {
            projectile.clear();
            projectiles.splice(index, 1);
        }
           
    })

   
}

//Add the canvas that Pixi automatically created for you to the HTML document
