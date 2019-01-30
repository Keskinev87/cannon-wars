let socket = io();
let room;
let player;
let opponent;

class Player {
    constructor() {
        this.playerNumber;
        this.id;
        this.nickName;
        this.points = 0;
        this.pillar;
        this.playerCannon;
        this.cannonRadius;
        this.pillarCoords={};
        this.cannonCoords={};
    }

    randomizeCoords(width, height){
        let widthPercent = Math.floor(Math.random() * 25 + 5) / 100;
        let heightPercent = Math.floor(Math.random() * 40 + 40) / 100;
        this.radius = width * 0.05;
        this.pillarCoords.x = widthPercent * width;
        this.pillarCoords.y = heightPercent * height;
        this.cannonCoords.x = this.pillarCoords.x + 0.5 * this.radius;
        this.cannonCoords.y = this.pillarCoords.y - this.radius;
    }

}

function serverCom() {
    player = new Player();
    opponent = new Player();
    socket.emit('join game', 'Get nickname');

    socket.on('room hosted', function(data){
        console.log("Room hosted");
        room = data.roomNumber;
        player.playerNumber = data.player;
        opponent.nickName = data.opponentsNickName;
    })
    
    socket.on('room joined', function(data){
        console.log("Room joined")
        room = data.roomNumber; 
        player.playerNumber = data.player;
        opponent.nickName = data.opponentsNickName;
    })
}



