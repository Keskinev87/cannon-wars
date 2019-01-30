var express = require('express')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const PORT = process.env.PORT || 4000;


app.use(express.static('client'))

app.get('/', function(req, res){
    res.sendFile(__dirname + '/client/index.html');
});

//////////////////////////////////
////////THE SOCKET LOGIC//////////
//////////////////////////////////

let roomCounter = 1;
let waitingRooms = []; //the rooms with waiting players
let playingRooms = {}; //the rooms with coupled players, who are playing - HASHTABLE
let privateWaitingRooms = {};

io.on('connection', function(socket){
    console.log("Player connected")

    socket.on('join game', function(nickName) {
        //if the player is not in another room
        if(Object.keys(socket.rooms).length <= 1){
          
           if(waitingRooms.length > 0) { //there are rooms with players waiting for another player to join

               let gameRoom = waitingRooms.pop();
               gameRoom.player2 = new Player(socket.id, 'player2', nickName); //set the second player in the room
               playingRooms[gameRoom.number] = gameRoom //move the room from waiting to playing
               socket.join(gameRoom.number); //join the socket to the room's number
               socket.curRoom = gameRoom.number;
   
               gameRoom.sendJoinedRoomStatus('player2'); //send the number of the room to the front-end
            //    gameRoom.sendStatusMsg(gameRoom.player2.nickName + ' joined'); //let the players know, that the second player has joined
            //    gameRoom.sendStatusMsg('The game will begin shortly...'); //let the players know when the game will start
               
            //    setTimeout(function() {
            //        gameRoom.startGame();
            //    }, 1000); //start the game
   
           } else {
               let room = new Room(roomCounter);
               socket.join(room.number); //join the game
               socket.curRoom = room.number;
               room.player1 = new Player(socket.id, 'player1', nickName);
   
               room.sendHostedRoomStatus('player1');
            //    room.sendStatusMsg('Waiting for the other player...')
               waitingRooms.unshift(room);
               roomCounter++;
           }
       } else {
           io.sockets.to(socket.id).emit('error', 'You are already in a game room!')
       } 
   });
});


class Room {
    constructor(number, code){
        this.number = number;
        this.code = code;
        this.player1;
        this.player2;
        this.roundCounter = 0;
    
    }

    sendHostedRoomStatus(player) {
        io.sockets.to(this[player].id).emit('room hosted', {roomNumber: this.number, playerNumber: player, opponentsNickName: ''});
    }

    sendJoinedRoomStatus(player) {
        let opponent = this.getOpponent(player);
        io.sockets.to(this[player].id).emit('room joined', {roomNumber: this.number, playerNumber: player, opponentsNickName: this[opponent].nickName});
        io.sockets.to(this[opponent].id).emit('room joined', {roomNumber: this.number, playerNumber: opponent, opponentsNickName: this[player].nickName});
    }

    sendStatusMsg(msg) {
        io.sockets.to(this.number).emit('status message', msg);
    }

    getOpponent(player) {
        if(player == 'player1')
            return 'player2';
        else
            return 'player1';
    }

    endRound() {

    }

    endGame() {

    }

}

class Player {
    constructor(id,number, nickName){
        this.id = id;
        this.number = number; //player1 or player 2
        this.nickName = nickName;
        this.cards=[];
        this.cardPlayed;
        this.points=0;
        this.roundPoints=0;
        this.gamePoints=0;
    }

    updatePoints(points, roomNumber) {
        this.points += points;
        io.sockets.to(roomNumber).emit('update points', {player: this.number, points: this.points});

        if(this.points >= 66) {
            let loser = playingRooms[roomNumber].getOpponent(this.number);
            
            playingRooms[roomNumber].endRound(this, playingRooms[roomNumber][loser]);
        }
    }
} 



http.listen(PORT, function(){
    console.log('listening on *:4000');
});
