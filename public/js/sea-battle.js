var Player = function(name){
  this.name = name;
  this.board = [
        [null, null, null, null, null, null,null, null, null, null],
        [null, null, null, null, null, null,null, null, null, null],
        [null, null, null, null, null, null,null, null, null, null],
        [null, null, null, null, null, null,null, null, null, null],
        [null, null, null, null, null, null,null, null, null, null],
        [null, null, null, null, null, null,null, null, null, null],
        [null, null, null, null, null, null,null, null, null, null],
        [null, null, null, null, null, null,null, null, null, null],
        [null, null, null, null, null, null,null, null, null, null],
        [null, null, null, null, null, null,null, null, null, null]
  ];
  this.ships = 0;
  this.burnedShips = 0;
}; 

var SeaBattle = function(players){
    this.players = players||[];
    this.fired = 0;
  };

SeaBattle.prototype.addPlayer = function(player) {
  if (this.players.length < 2) {
    this.players.push(player);
  } else {
     console.log('Game already has 2 players');
  }
};

SeaBattle.prototype.setShips = function(name, posX, posY){
  var curPlayer = this.playerCheck(name);
  if (curPlayer.validatePos(posX, posY)){
     curPlayer.board[posX][posY] = curPlayer.name;
     console.log(curPlayer.name + ' set ship at '+ [posX, posY]);
     curPlayer.ships++;
     curPlayer.shipLimit();
  }
};

SeaBattle.prototype.playerCheck = function(name){
  for(var i = 0 ; i < this.players.length; i++){
    if(this.players[i].name === name) {
     return this.players[i];
    }
  } 
};

SeaBattle.prototype.enemyCheck = function(name){
  for(var i = 0 ; i < this.players.length; i++){
    if(this.players[i].name !== name) {
     return this.players[i];
    }
  } 
};

Player.prototype.shipLimit = function(){
  if(this.ships > 10){
    console.log('Ship limit is 10');
  }
};

Player.prototype.validatePos = function(posX,posY){
  if (this.board[posX][posY] === null) { 
    return true; 
  }
  else { 
    console.log('You already chose this cell before!'); 
  }
};

SeaBattle.prototype.currentPlayer = function(){
  var index = this.fired % 2;
  return this.players[index]; 
};

SeaBattle.prototype.validatePlayer = function(name) {
    if (this.currentPlayer().name === name) { return true; }
    else { console.log("This is not " + name + "'s turn."); }
};

SeaBattle.prototype.fire = function(name, posX, posY){
   var enemy = this.enemyCheck(name);
   if(this.validatePlayer(name)){
     if(enemy.board[posX][posY] === enemy.name){
       console.log(enemy.name + "'s ship on pos " + [posX,posY] + ' was destroyed!');
       enemy.board[posX][posY] = 'Boom';
       enemy.burnedShips++;
     }
     else{
       console.log('Good luck next time :)');
       enemy.board[posX][posY] = 'water';
     }
     this.fired++;
   }
   console.log(this.winner());
};

SeaBattle.prototype.winner = function(){
   var loser;
   for(var i = 0 ; i < this.players.length; i++){
    if(this.players[i].burnedShips === 10){
      loser = this.players[i].name;
      return this.enemyCheck(loser).name;
    }
    else{
      return false;
    }
   } 
};


