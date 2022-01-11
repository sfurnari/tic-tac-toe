console.log('js loaded')

let liveGame = true;
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

const player1 = "x";
const player2 = "o";
let currentPlayer = player1;
let player1Wins = 0;
let player2Wins = 0;

const playerChange = function(){
    if(currentPlayer === player1){
        currentPlayer = player2;
    } else {
        currentPlayer = player1;
    }
};

const winCheck = function(){
    let gameWon = false;
    let $gameResultMessage = $('.game-result')

    for (let i = 0; i < winConditions.length; i++) { // loops through array of win conditions
        const isWin = winConditions[i];         // ---
                                                //    |
        let winIndex0 = currentGame[isWin[0]];  //    |    assigns variable to each index of win condition [0, 1, 2]
        let winIndex1 = currentGame[isWin[1]];  //    |--- to match with current game status.
        let winIndex2 = currentGame[isWin[2]];  // ___|

        if (winIndex0 === "" || winIndex1 === "" || winIndex2 === "") { // if any game squares haven't been clicked, continue through the loop
            continue;
        }        
        if (winIndex0 === winIndex1 && winIndex1 === winIndex2){ // matched win condition in currentGame array
            gameWon = true;
        }
    }
    if (gameWon) {        
        liveGame = false
        $gameResultMessage.text(`${currentPlayer} wins!!!`).fadeIn(100).fadeOut(3000)
        if (currentPlayer === player1){
            player1Wins++
            $('#player1-wins').text(`Player 1 wins: ${player1Wins}`)
        } else {
            player2Wins++
            $('#player2-wins').text(`Player 2 wins: ${player2Wins}`)
        }
    } // if game is won, update win counter and display in ui

    if (!currentGame.includes("")){ // if game results in a draw
        $gameResultMessage.text("Game is a draw").fadeIn(100).fadeOut(3000)
    };
};

const newGame = function(){
    liveGame = true;
    currentPlayer = player1;
    currentGame = ["", "", "", "", "", "", "", "", ""];
    $('*.square').text("");
};

$('.square').on('click', function(e){
     const id = e.target.id;
     
    if (liveGame){ // is game live?
      
        if ($('#' + id).text() != ""){ // has square already been clicked?
            return;
            }
    
        if (currentPlayer === player1){ // players turn input
            $('#' + id).text('x');
        } else {
            $('#' + id).text('o')
        }
        currentGame[Number(id)] = currentPlayer
        winCheck();
        playerChange();
    }
});

$('#new-game').on('click', function (){
    newGame();
})
