console.log('js loaded')

let currentGame = ["", "", "", "", "", "", "", "", ""]
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const player1 = 'X';
const player2 = 'O';
let currentPlayer = player1;

let xWins = 0;
let oWins = 0;


const winCheck = function(){
    let gameWon = false;
    for (let i = 0; i < winConditions.length; i++) { // loops through array of win conditions

        const isWin = winConditions[i]; // ---
        let a = currentGame[isWin[0]];  //    |    assigns variable to each index of win condition [0, 1, 2]
        let b = currentGame[isWin[1]];  //    |--- to match with current game status.
        let c = currentGame[isWin[2]];  // ___|

        if (a === "" || b === "" || c === "") { // if any game squares haven't been clicked, continue through the loop
            continue;
        }        
        if (a === b && b === c){ // matched win condition in array of current game
            gameWon = true;
        }
    }
    if (gameWon) {
        $('.game-status').text(`${currentPlayer} wins!!!`)
    }
};

const playerChange = function(){
    if(currentPlayer === player1){
        currentPlayer = player2;
    } else {
        currentPlayer = player1;
    }
};

$('.square').on('click', function(e){
     const id = e.target.id;

 //_________Is square already clicked?__________   
    if($('#' + id).text() != ""){
        return;
    }
// _________Player Input____________
    if (currentPlayer === player1){
        $('#' + id).text('x');
    } else {
        $('#' + id).text('o')
    }
    currentGame[Number(id)] = currentPlayer
    winCheck();
    playerChange();
    console.log(currentGame)
});