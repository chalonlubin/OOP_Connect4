/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

// To reset will need to set global variables

// const WIDTH = 7;
// const HEIGHT = 6;

// let currPlayer = 1; // active player: 1 or 2
// let board = []; // array of rows, each row is array of cells  (board[y][x])


// TODO: listen to form submit listener
  // make new player instances (player 1 and 2)
  // make new game instance
    // makeBoard


class Player {
  constructor(color, ){
    this.color = color;
  }

  getColor(){
    console.log(this.color);
  }
}




class Game {
  // we dont need board and currPlayer in params
  constructor(width = 7, height = 6, board, currPlayer) {
    this.width = width;
    this.height = height;
    this.board = [];
    this.players = [];

    this.currPlayer = 0;
    this.gameOver = false;

    this.startGame = document.getElementById("startGame"); // form
    this.handleStartGame(); // TODO: makeBoard
    // this.piece = document.createElement("div");


  }

  handleStartGame() {
    this.startGame.addEventListener("submit", this.createGame.bind(this));
  }

  createGame(evt) {
    evt.preventDefault();
    // we're not validating inputs
    const player1 = document.getElementById("player1").value;
    const player2 = document.getElementById("player2").value;

    // maybe we can move this to a controller function

    // reset board
    // debugger;
    this.board = [];
    this.players = [];
    this.players.push(new Player(player1), new Player(player2));
    console.log(this.players);

    // TODO: Move this to outside of class
    // and create game and player instance when form is submitted
    this.gameOver = false;
    const gameBoard = document.getElementById("board");
    gameBoard.innerHTML = "";

    // we tried just reassigning the instance and use the anti-pattern
    // global variable var
    // window.game = new Game();

    this.makeBoard();
    this.makeHtmlBoard();

  }

  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */
  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      // Array.from({ length: this.width }) ==> by default returns undefined
      // so we need to make checks for undefined instead of null
      this.board.push(Array.from({ length: this.width }));
    }
    console.log(this.board);
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    if(this.gameOver === true) return;


    // console.log("handle click", this);

    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      // if (this.checkForWin.bind(this)) {
      this.gameOver = true;
      return this.endGame(`Player ${this.currPlayer} won!`);
    }

    // check for tie
    if (this.board.every((row) => row.every((cell) => cell))) {
      this.gameOver = true;
      return this.endGame("Tie!");
    }

    // switch players
    this.currPlayer = this.currPlayer === 0 ? 1 : 0;
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    const board = document.getElementById("board");

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");

    // wrong this
    // bind always gives you back a new function
    // when you see this event, run this function
    // the function you are giving it is the function from bind
    top.addEventListener("click", this.handleClick.bind(this));

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr");

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    // console.log("findSpotForCol this", this)
    for (let y = this.height - 1; y >= 0; y--) {

      // @chalon david l. helped fix a small bug where it was appending multiple
      // pieces into the same spot b/c we were using 0 and 1 values for players
      // and !0 evaluated to true.
      if (this.board[y][x] === undefined) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement("div");
    // this.piece.classList.add("piece");
    // this.piece.classList.add(`p${this.currPlayer}`);
    // this.piece.style.top = -50 * (y + 2);
    piece.classList.add("piece");
    // piece.classList.add(`p${this.currPlayer}`);
    piece.style.backgroundColor = this.players[this.currPlayer].color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    // spot.append(this.piece);
    spot.append(piece);

  }

  /** endGame: announce game end */

  endGame(msg) {
    alert(msg);
  }


  checkForWin() {
    // console.log("checkForWin this", this);

    const _win = (cells) => {

      // console.log("checkForWin _win() this", this);

      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    };

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        console.log(this);
        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }


}

const game = new Game();