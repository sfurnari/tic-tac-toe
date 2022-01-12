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
    const openModal = function (){
        $('.modal').css('display', 'block');
        $('.modal-content').css('display', 'block');
    }
    

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
            openModal()
        } else {
            player2Wins++
            $('#player2-wins').text(`[O] wins: ${player2Wins}`)
            openModal()
        }
    } 

    if (!gameWon && !currentGame.includes('')){ // if game results in a draw
        liveGame = false
        $gameResultMessage.text("Game is a draw")
        openModal()
    };

}; // winCheck() -  checks for win or draw

const newGame = function(){
    liveGame = true;
    currentPlayer = player1;
    currentGame = ['', '', '', '', '', '', '', '', ''];
    $('*.square').text('');
}; // newGame() - sets game to turn 1

const resetGame = function(){
    $('#player1-wins').text('[X] wins: 0')
    $('#player2-wins').text('[O] wins: 0')
    player1Wins = 0;
    player2Wins = 0;
    newGame();
}; // resetGame() - resets game & score

const closeModal = function(){
    $('.modal').css('display', 'none');
    $('.modal-content').css('display', 'none');
}; // closeModal() - closes modal pop up

const storeLocalData = function(){
    localStorage.setItem('player1wins', `${player1Wins}`);
    localStorage.setItem('player2wins', `${player2Wins}`);
    localStorage.setItem('currentGame', JSON.stringify(currentGame));
    localStorage.setItem('liveGame', `${liveGame}`)
    localStorage.setItem('cpuGame', `${cpuGame}`)
    localStorage.setItem('currentPlayer', `${currentPlayer}`)  
}; // storeLocalData() - stores current game data

const restoreLocalData = function(){  
    player1Wins = parseInt(localStorage.getItem('player1wins'));
    $('#player1-wins').text(`Player 1 [X] wins: ${player1Wins}`);
    
    player2Wins = parseInt(localStorage.getItem('player2wins'));
    $('#player2-wins').text(`Player 2 [O] wins: ${player2Wins}`);

    currentGame = JSON.parse(localStorage.getItem('currentGame'));

    liveGame = JSON.parse(localStorage.getItem('liveGame'));

    cpuGame = JSON.parse(localStorage.getItem('cpuGame'));

    currentPlayer = localStorage.getItem('currentPlayer');

    for (let i = 0; i < currentGame.length; i++) {
        const boardPos = currentGame[i];
        $(`#${i}`).text(currentGame[i])   
    } 
}; // restoreLocalData() - restores local game data

$('.square').on('click', function(e){
    const id = e.target.id;
    const idNum = Number(id);
    const playGame = function(){
        if (liveGame){ // is game live?

        if ($(`#${id}`).text() != ''){ // has square already been clicked?
            return;
        }

        if (currentPlayer === player1){ // players turn input
            $(`#${id}`).text('x');          
        } else {
            $(`#${id}`).text('o')     
        }
        currentGame[idNum] = currentPlayer;
        winCheck();
        playerChange();
        }
    }
    if(cpuGame){
        playGame();
        cpuChooses();

    } else {
        playGame();
    }
    storeLocalData();
}); // game is played here

$('#new-game').on('click', function(){
    newGame();
}); // main menu new game

$('#new-game-yes').on('click', function (){
    closeModal();
    newGame();
}); // modal yes button

$('#new-game-no').on('click', function(){
    closeModal();
}); // modal no button

$('#reset-game').on('click', function(){
    resetGame()
    localStorage.clear()
}); // reset button

$('#play-human').on('click', function(){
    resetGame();
    cpuGame = false
}); // play human button

$('#play-computer').on('click', function(){
    resetGame();
    cpuGame = true;
});// play computer button

$('#restore').on('click', function(){
    restoreLocalData();
});