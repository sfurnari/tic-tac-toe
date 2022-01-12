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

const player1 = 'X';
const player2 = 'O';
let currentPlayer = player1;
let player1Wins = 0;
let player2Wins = 0;


const cpuChooses = function(){
    if(liveGame){
        currentPlayer = player2;
        const randomNum = Math.floor(Math.random() * currentGame.length);
        if (currentGame[randomNum] === ''){
            currentGame[randomNum] = player2;
            $('#' + randomNum).text('o');
            localStorage.setItem(`square${randomNum}`, `${currentGame[randomNum]}`)
            winCheck();
            currentPlayer = player1    
        } else {
            cpuChooses();
        };
    }
}; // cpuChooses()

const playerChange = function(){
    if(currentPlayer === player1){
        currentPlayer = player2;
    } else {
        currentPlayer = player1;
    }
};

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
            $('#player1-wins').text(`Player 1 [X] wins: ${player1Wins}`)
            openModal()
        } else {
            player2Wins++
            $('#player2-wins').text(`Player 2 [O] wins: ${player2Wins}`)
            openModal()
        }
    } 

    if (!gameWon && !currentGame.includes('')){ // if game results in a draw
        liveGame = false
        $gameResultMessage.text("Game is a draw")
        openModal()
    };

};

const newGame = function(){
    liveGame = true;
    currentPlayer = player1;
    currentGame = ['', '', '', '', '', '', '', '', ''];
    $('*.square').text('');
};

const resetGame = function(){
    $('#player1-wins').text('Player 1 [X] wins: 0')
    $('#player2-wins').text('Player 2 [O] wins: 0')
    player1Wins = 0;
    player2Wins = 0;
    newGame();
};

const closeModal = function(){
    $('.modal').css('display', 'none');
    $('.modal-content').css('display', 'none');
}

const storeLocalData = function(){
    localStorage.setItem('player1wins', `${player1Wins}`);
    localStorage.setItem('player2wins', `${player2Wins}`);
    localStorage.setItem('currentGame', JSON.stringify(currentGame));
    localStorage.setItem('liveGame', `${liveGame}`)
    localStorage.setItem('cpuGame', `${cpuGame}`)
    localStorage.setItem('currentPlayer', `${currentPlayer}`)  
};

const restoreLocalData = function(){  
    player1Wins = parseInt(localStorage.getItem('player1wins'));
    $('#player1-wins').text(`Player 1 [X] wins: ${player1Wins}`);
    
    player2Wins = parseInt(localStorage.getItem('player2wins'));
    $('#player2-wins').text(`Player 2 [O] wins: ${player2Wins}`);

    currentGame = JSON.parse(localStorage.getItem('currentGame'));

    liveGame = JSON.parse(localStorage.getItem('liveGame'));

    cpuGame = JSON.parse(localStorage.getItem('cpuGame'));

    currentPlayer = localStorage.getItem('currentPlayer');
   
    
};

const removeBoardLocalData = function(){
    localStorage.removeItem('currentGame')
    localStorage.removeItem('square0')
    localStorage.removeItem('square1')
    localStorage.removeItem('square2')
    localStorage.removeItem('square3')
    localStorage.removeItem('square4')
    localStorage.removeItem('square5')
    localStorage.removeItem('square6')
    localStorage.removeItem('square7')
    localStorage.removeItem('square8')
}

$('.square').on('click', function(e){
    const id = e.target.id;
    const idNum = Number(id);
    const playGame = function(){
        if (liveGame){ // is game live?

        if ($('#' + id).text() != ''){ // has square already been clicked?
            return;
        }

        if (currentPlayer === player1){ // players turn input
            $('#' + id).text('x');          
        } else {
            $('#' + id).text('o')     
        }
        currentGame[idNum] = currentPlayer;
        winCheck();
        playerChange();
    }
    
    }
    if(cpuGame){
        playGame();
        localStorage.setItem(`square${idNum}`, `${currentGame[idNum]}`)
        cpuChooses();

    } else {
        playGame();
        localStorage.setItem(`square${idNum}`, `${currentGame[idNum]}`)
    }
    storeLocalData();
}); // game is played here

$('#new-game-yes').on('click', function (){
    closeModal();
    newGame();
    removeBoardLocalData();
});

$('#new-game-no').on('click', function(){
    closeModal();
});

$('#reset-game').on('click', function(){
    resetGame()
    localStorage.clear()
});

$('#play-human').on('click', function(){
    resetGame();
    removeBoardLocalData();
    cpuGame = false
});

$('#play-computer').on('click', function(){
    resetGame();
    removeBoardLocalData();
    cpuGame = true;
});