console.log('js loaded')


let liveGame = true;
let cpuGame = false;
let currentGame = ['', '', '', '', '', '', '', '', '']

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

const player1 = 'x';
const player2 = 'o';
let currentPlayer = player1;
let player1Wins = 0;
let player2Wins = 0;
let drawCounter = 0


const cpuChooses = function(){
    if(liveGame){
        currentPlayer = player2;
        const randomNum = Math.floor(Math.random() * currentGame.length);
        if (currentGame[randomNum] === ''){
            currentGame[randomNum] = player2;
            $(`#${randomNum}`).text('o');
            winCheck();
            currentPlayer = player1    
        } else {
            cpuChooses();
        };
    }
}; // cpuChooses() - dumb random ai

const playerChange = function(){
    if(currentPlayer === player1){
        currentPlayer = player2;
    } else {
        currentPlayer = player1;
    }
}; // playerChange() - changes player after turn made

const winCheck = function(){
    let gameWon = false;
    let $gameResultMessage = $('#game-result')

    for (let i = 0; i < winConditions.length; i++) { // loops through array of win conditions
        const isWin = winConditions[i];         // ---
                                                //    |
        let winIndex0 = currentGame[isWin[0]];  //    |    assigns variable to each index of the nested win conditions [0, 1, 2]
        let winIndex1 = currentGame[isWin[1]];  //    |--- to match with current game status.
        let winIndex2 = currentGame[isWin[2]];  // ___|

        if (winIndex0 === '' || winIndex1 === '' || winIndex2 === '') { // if any game squares haven't been clicked, continue through the loop
            continue;
        }        
        if (winIndex0 === winIndex1 && winIndex1 === winIndex2){ // matched win condition in currentGame nested array
            gameWon = true;
        }
    }
    if (gameWon) {  // if game is won, update win counter and display      
        liveGame = false
        $gameResultMessage.text(`${currentPlayer} wins!`)
        if (currentPlayer === player1){
            player1Wins++
            $('#player1-wins').text(`[X] wins: ${player1Wins}`)
            openWinModal()
        } else {
            player2Wins++
            $('#player2-wins').text(`[O] wins: ${player2Wins}`)
            openWinModal()
        }
    } 
    if (!gameWon && !currentGame.includes('')){ // if game results in a draw
        liveGame = false
        drawCounter++
        $gameResultMessage.text("Draw!")
        $('#draw').text(`Draws: ${drawCounter}`)
        openWinModal()
    };
}; // winCheck() -  checks for win or draw

const newGame = function(){
    liveGame = true;
    currentPlayer = player1;
    currentGame = ['', '', '', '', '', '', '', '', ''];
    $('*.square').text('');
}; // newGame() - sets game to turn 1

const resetGame = function(){
    $('#player1-wins').text('[X] wins: 0');
    $('#player2-wins').text('[O] wins: 0');
    $('#draw').text('Draws: 0');

    player1Wins = 0;
    player2Wins = 0;
    drawCounter = 0;
    newGame();
}; // resetGame() - resets game & score

const closeModal = function(){
    $('.modal').css('display', 'none');
    $('#game-result').css('display', 'block')
}; // closeModal() - closes modal pop up

const storeLocalData = function(){
    localStorage.setItem('player1wins', `${player1Wins}`);
    localStorage.setItem('player2wins', `${player2Wins}`);
    localStorage.setItem('drawCounter', `${drawCounter}`);
    localStorage.setItem('currentGame', JSON.stringify(currentGame));
    localStorage.setItem('liveGame', `${liveGame}`)
    localStorage.setItem('cpuGame', `${cpuGame}`)
    localStorage.setItem('currentPlayer', `${currentPlayer}`)  
}; // storeLocalData() - stores current game data

const restoreLocalData = function(){  
    player1Wins = parseInt(localStorage.getItem('player1wins'));
    $('#player1-wins').text(`[X] wins: ${player1Wins}`);
    
    player2Wins = parseInt(localStorage.getItem('player2wins'));
    $('#player2-wins').text(`[O] wins: ${player2Wins}`);

    drawCounter = parseInt(localStorage.getItem('drawCounter'));
    $('#draw').text(`Draws: ${drawCounter}`);

    currentGame = JSON.parse(localStorage.getItem('currentGame'));

    liveGame = JSON.parse(localStorage.getItem('liveGame'));

    cpuGame = JSON.parse(localStorage.getItem('cpuGame'));

    currentPlayer = localStorage.getItem('currentPlayer');

    for (let i = 0; i < currentGame.length; i++) {
        $(`#${i}`).text(currentGame[i])   
    } 
}; // restoreLocalData() - restores local game data

const restoreModal = function(){
    $('#restore-modal').css('display', 'block');
    $('.modal-content').css('display', 'block');
};

const openWinModal = function(){
    $('#win-modal').css('display', 'block');
    $('.win-modal-content').css('display', 'block');
};

$('.square').on('click', function(e){
    const id = e.target.id;
    const idNum = Number(id);
    let validTurn = true;
    const playGame = function(){
        if (liveGame){ // is game live?

            if ($(`#${id}`).text() != ''){ // has square already been clicked?
                validTurn = false
            }

            if (currentPlayer === player1){ // players turn input
                $(`#${id}`).text('x');          
            } else {
                $(`#${id}`).text('o')     
            }
            currentGame[idNum] = currentPlayer;
            if (validTurn){
                winCheck();
                playerChange();
            } 
        }
    }
    if (cpuGame){
        playGame();
        if (validTurn){
            cpuChooses();
        }

    } else {
        playGame();
    }
    storeLocalData();
}); // game is played here

$('#new-game').on('click', function(){
    $('#game-result').css('display', 'none')
    openWinModal();

}); // main menu new game

$('#no').on('click', function(){
    closeModal();
    localStorage.clear();
}); // modal no button

$('#reset-game').on('click', function(){
    resetGame()
    localStorage.clear()
}); // reset button

$('#play-human').on('click', function(){
    newGame();
    cpuGame = false;
    closeModal();
}); // play human button

$('#play-computer').on('click', function(){
    newGame();
    cpuGame = true;
    closeModal();
});// play computer button

$('#restore').on('click', function(){
    restoreLocalData();
    closeModal();
});

$('.close').on('click', function(){
    closeModal()
});

if (localStorage.length != 0){
    $('window').on('load', restoreModal());
}