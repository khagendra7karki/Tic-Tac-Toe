const x_class = "x"
const circle_class = "circle"

const winning_combination = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

const cellElement = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const winningMessage = document.getElementById('winningMessage')
const winningMessageText = document.querySelector('[data-winning-message-text]')
const restartButton = document.getElementById('restartButton')
let circleTurn



startGame()
restartButton.addEventListener("click",startGame)

function startGame(){
    circleTurn = false
    cellElement.forEach(cell => {
        cell.classList.remove(x_class)
        cell.classList.remove(circle_class)
        cell.removeEventListener('click',handleClick)
        cell.addEventListener('click', handleClick, {once: true})
    });
    setBoardHoverClass()
    winningMessage.classList.remove('show')

}

function handleClick(e){
    const cell = e.target
    const currentClass = circleTurn ? circle_class : x_class
    placeMark(cell, currentClass)
    if(checkWin(currentClass))
    {
        endgame(true)
    }
    else if(isDraw()){
        endgame(false)
    }
    else{
        swapTurns()
        setBoardHoverClass()        
    }
    
}

function placeMark(cell, currentClass){
    cell.classList.add(currentClass)
}

function swapTurns(){
    circleTurn = !circleTurn
}

function setBoardHoverClass(){
    board.classList.remove(x_class)
    board.classList.remove(circle_class)
    if(circleTurn){
        board.classList.add(circle_class)

    }
    else{
        board.classList.add(x_class)
    }
}

function checkWin(currentClass){
    return winning_combination.some(combination => {

        return combination.every(index =>{

            return cellElement[index].classList.contains(currentClass)
        })
    })
}

function isDraw(){
    return [...cellElement].every(cell=>{
        return (cell.classList.contains(x_class) || cell.classList.contains(circle_class))
    })
}

function endgame(win_or_draw){
    if(win_or_draw){
        winningMessageText.innerText = `${circleTurn ? "0 " : "X "} Wins!`
    }
    else{
        winningMessageText.innerText = "Draw!"
    }
    winningMessage.classList.add('show')
}

