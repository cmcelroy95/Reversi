/** The state of the game */
var state = {
  action: 'idle',
  over: false,
  turn: 'b',
  board: [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, 'w', 'b', null, null, null],
    [null, null, null, 'b', 'w', null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null]
  ],
  score: {b: 2, w: 2}
}

var ctx;

function getLegalPlacements() {
  var currentPlayer = state.turn;
  var otherPlayer = 'b';
  if(currentPlayer == 'b')
    otherPlayer = 'w';
  for(var y = 0; y < state.board.length; y++){
    for(var x = 0; x < state.board.length; x++){
      if(state.board[y][x] === currentPlayer){
        if(state.board[y-1] && state.board[y-1][x-1] && state.board[y-1][x-1] === otherPlayer)
          checkForPlacement(y-1, x-1, -1, -1);
        if(state.board[y-1] && state.board[y-1][x] && state.board[y-1][x] === otherPlayer)
          checkForPlacement(y-1, x, -1, 0);
        if(state.board[y-1] && state.board[y-1][x+1] && state.board[y-1][x+1] === otherPlayer)
          checkForPlacement(y-1, x+1, -1, +1);
        if(state.board[y][x-1] && state.board[y][x-1] === otherPlayer)
          checkForPlacement(y, x-1, 0, -1);
        if(state.board[y][x+1] && state.board[y][x+1] === otherPlayer)
          checkForPlacement(y, x+1, 0, +1);
        if(state.board[y+1] && state.board[y+1][x-1] && state.board[y+1][x-1] === otherPlayer)
          checkForPlacement(y+1, x-1, +1, -1);
        if(state.board[y+1] && state.board[y+1][x] && state.board[y+1][x] === otherPlayer)
          checkForPlacement(y+1, x, +1, 0);
        if(state.board[y+1] && state.board[y+1][x+1] && state.board[y+1][x+1] === otherPlayer)
          checkForPlacement(y+1, x+1, +1, +1);
      }
    }
  }
  checkIsOver();
}

function checkForPlacement(currentY, currentX, directionY, directionX) {
  var currentPlayer = state.turn;
  if(currentY + directionY < 0 || currentY + directionY > 7 || currentX + directionX < 0 || currentX + directionX > 7) return;
  var squareState = state.board[currentY + directionY][currentX + directionX];
  if(squareState === currentPlayer || squareState === 'ghost') return;
  if(squareState === null || squareState === "ghost") {
    state.board[currentY + directionY][currentX + directionX] = 'ghost';
  }
  else {
    checkForPlacement(currentY + directionY, currentX + directionX, directionY, directionX);
  }
}

function checkIsOver(){
  var blackScore = 0;
  var whiteScore = 0;
  for(var y = 0; y < 8; y++) {
    for(var x = 0; x < 8; x++) {
      if(state.board[y][x] === "ghost"){
        return;
      }
      if(state.board[y][x] === 'b') blackScore++;
      else if(state.board[y][x] === 'w') whiteScore++;
    }
  }
  var text = document.getElementById('current-player');
  text.innerHTML = blackScore >= whiteScore ? 'Black player wins with ' + blackScore + 'points!' : 'White player wins with ' + whiteScore + 'points!';
}

function placeGhost(y, x) {
  ctx.beginPath();
  if(state.turn === 'w')
    ctx.fillStyle = 'rgba(175, 175, 175, .2)';
  else if(state.turn === 'b')
    ctx.fillStyle = 'rgba(75, 75, 75, .2)';
  ctx.arc(x*100+50, y*100+50, 40, 0, Math.PI * 2);
  ctx.fill();
}

function handleMouseMove(event) {
  renderBoard();
  hoverOverPiece(event);
}

function hoverOverPiece(event) {
  // Make sure we have a canvas context to render to
  if(!ctx) return;
  var x = Math.floor((event.clientX - 10)/ 62.5);
  var y = Math.floor((event.clientY - 10) / 62.5);
  if(x < 0 || y < 0 || x > 7 || y > 7) return;
  if(state.board[y][x] && state.board[y][x] === "ghost") {
    ctx.strokeWidth = 15;
    ctx.strokeStyle = "yellow";
    ctx.beginPath();
    ctx.arc(x*100+50, y*100+50, 40, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function handleMouseClick(event) {
  if(!ctx) return;
  var x = Math.floor((event.clientX - 10)/ 62.5);
  var y = Math.floor((event.clientY - 10) / 62.5);
  if(x < 0 || y < 0 || x > 7 || y > 7) return;
  if(state.board[y][x] && state.board[y][x] === "ghost") {
    flipPieces(y, x, -1, -1);
    flipPieces(y, x, -1, 0);
    flipPieces(y, x, -1, +1);
    flipPieces(y, x, 0, -1);
    flipPieces(y, x, 0, +1);
    flipPieces(y, x, 1, -1);
    flipPieces(y, x, 1, 0);
    flipPieces(y, x, 1, +1);
    clearGhosts();
    nextTurn();
  }
}

function flipPieces(y, x, yDirection, xDirection){
  var currentPlayer = state.turn;
  var otherPlayer = 'b';
  if(currentPlayer === 'b') otherPlayer = 'w';

  if(!state.board[y+yDirection] || !state.board[y+yDirection][x+xDirection]) return false;
  if(state.board[y+yDirection][x+xDirection] == null) return false;
  if(state.board[y+yDirection][x+xDirection] === currentPlayer){
    state.board[y][x] = currentPlayer;
    //state.score[currentPlayer]++;
    return true;
  }
  else if(flipPieces(y+yDirection, x+xDirection, yDirection, xDirection)){
    state.board[y][x] = currentPlayer;
    //state.score[currentPlayer]++;
    //state.score[otherPlayer]--;
    return true;
  }
}

function clearGhosts() {
  for(var y = 0; y < 8; y++) {
    for(var x = 0; x < 8; x++) {
      if(state.board[y][x] === "ghost"){
        state.board[y][x] = null;
      }
    }
  }
}

function nextTurn() {
  if(state.turn === 'b') state.turn = 'w';
  else state.turn = 'b';
  //var blackScoreText = document.getElementById('player-black');
  //var whiteScoreText = document.getElementById('player-white');
  //blackScoreText.innerHTML = 'Black: ' + state.score['b'];
  //whiteScoreText.innerHTML = 'White: ' + state.score['w'];
  var currentPlayerText = document.getElementById('current-player');
  currentPlayerText.innerHTML = state.turn === 'b' ? 'Current Player: Black' : 'Current Player: White';
  getLegalPlacements();
}

function renderPiece(piece, x, y) {
  ctx.beginPath();
  if(state.board[y][x].charAt(0) === 'w') {
    ctx.fillStyle = '#fff';
  }else if(state.board[y][x].charAt(0) === 'b'){
    ctx.fillStyle = '#000';
  }
  else placeGhost(y, x);
  ctx.arc(x*100+50, y*100+50, 40, 0, Math.PI * 2);
  ctx.fill();
}

function renderSquare(x,y) {
  if((x + y) % 2 == 1)
    ctx.fillStyle = '#00a802';
  else
    ctx.fillStyle = '#006601';
  ctx.fillRect(x*100, y*100, 100, 100);
  if(state.board[y][x]) {
    renderPiece(state.board[y][x], x, y);
  }
}

function renderBoard() {
  if(!ctx) return;
  for(var y = 0; y < 8; y++) {
    for(var x = 0; x < 8; x++) {
      renderSquare(x, y);
    }
  }
}

function setup() {
  var canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 800;
  //canvas.onmousedown = handleMouseDown;
  canvas.onmouseup = function() {
    handleMouseClick(event);
  };
  canvas.onmousemove = handleMouseMove;
  document.body.appendChild(canvas);
  ctx = canvas.getContext('2d');
  var panel = document.createElement('div');
  panel.id = 'current-player';
  panel.innerHTML = 'Current Player: Black';
  document.body.appendChild(panel);
  getLegalPlacements();
  renderBoard();
}

setup();
