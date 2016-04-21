var Player = function(name, sign){
  this.name = name;
  this.sign = sign;
};
var TicTacToe = function(players){
    this.board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];
    this.players = players||[];
    this.filledSquares = 0;
};

TicTacToe.prototype.addPlayer = function(player) {
  if (this.players.length < 2) {
    this.players.push(player);
  } else {
     console.log('Game already has 2 players');
  }
};

TicTacToe.prototype.currentPlayer = function() {
    var index = this.filledSquares % 2;
    return this.players[index]; // returns Player object
};

TicTacToe.prototype.playerBySign = function(sign) {
    // return the Player that has the sign
    for (var i=0; i < this.players.length; i++) {
        if (this.players[i].sign === sign) {
            return this.players[i].name;
        }
    }
};

TicTacToe.prototype.move= function(name, posX, posY) {
  if (this.validatePosition(posX, posY) && this.validatePlayer(name)){
      this.board[posX][posY] = this.currentPlayer().sign;
      console.log(name + ' chose '+ [posX, posY]);
      this.filledSquares++;
      console.log(this.winner());
  }
};


TicTacToe.prototype.validatePosition = function(posX,posY){
  if (this.board[posX][posY] === null) { return true; }
  else { console.log('This cell is not available!'); }
};

TicTacToe.prototype.validatePlayer = function(name) {
    if (this.currentPlayer().name === name) { return true; }
    else { console.log("This is not " + name + "'s turn."); }
};

TicTacToe.prototype.winner = function() {
    var winner;

    this.board.forEach(function(line){
        if (line[0] !== null && line[0] === line[1] && line[1] === line[2]) {
            winner = line[0];
        }
    });

    var board = this.board;
    [0, 1, 2].forEach(function(index){
        var column = board.map(function(line){ return line[index]; });
        if (column[0] !== null && column[0] == column[1] && column[1] == column[2]) { winner = column[0]; }
    });

    if (this.board[0][0] !== null && this.board[0][0] == this.board[1][1] && this.board[1][1] == this.board[2][2]) { winner = this.board[0][0]; }

    if (this.board[2][0] !== null && this.board[2][0] == this.board[1][1] && this.board[1][1] == this.board[0][2]) { winner = this.board[2][0]; }

    return this.playerBySign(winner);
};