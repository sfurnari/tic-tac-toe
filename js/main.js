console.log('js loaded')

const player1 = 'Player 1 ( x )'
const player2 = 'Player 2 ( o )'

let currentPlayer = player1;

const playerChange = function(){
    currentPlayer = currentPlayer === player1 ? player2 : player1
}

$('.square').on('click', function(e){
     const id = e.target.id;
 //_________Is square already clicked?__________   
    if($('#' + id).text() != ""){
        return;
    }
// _________Player Input____________
    if (currentPlayer === player1){
        $('#' + id).text('x')
    } else {
        $('#' + id).text('o')
    }
    playerChange();
})