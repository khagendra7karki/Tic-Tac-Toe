/* This is the set of the winning combination.
    The board has been though of as an array of 
    length 9 where every cell represents an element of 
    the array                                        */
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

const cellElement = Array.from(document.querySelectorAll('[data-cell]'))
const board = document.getElementById('board')
const winningMessage = document.getElementById('winningMessage')
const winningMessageText = document.querySelector('[data-winning-message-text]')
const restartButton = document.getElementById('restartButton')
const homepage = document.getElementById('homepage')
const xButton = document.getElementById('X')
const oButton = document.getElementById('O')
let AI
let notAI

/*  
    b is an array which represents the mark placed on the
    cell.
    
    ** 1 is for AI 
    ** 0 is for  user
    ** -1 is for empty cell

    This array will later be used to determine
     the state of the game like win, lose or draw
*/

let b = [-1 , -1 , -1 , -1 , -1 , -1 , -1 , -1 ,-1]



restartButton.addEventListener("click",startGame)

xButton.addEventListener("click",()=>{
    AI = "circle"
    notAI = "x"
    homepage.classList.add('hide')
    startGame()
})
oButton.addEventListener("click",()=>{
    AI = "x"
    notAI = "circle"
    homepage.classList.add('hide')
    startGame()
})

/** startgame() is the main function of the game 
 * it assigns all the event handler to individual cell
 *  
 */
function startGame(){                 
    b = [-1 , -1 , -1 , -1 , -1 , -1 , -1 , -1 ,-1]
    board.classList.add('show')
    board.classList.add(notAI)
    cellElement.forEach(cell => {
        cell.classList.remove(AI)
        cell.classList.remove(notAI)
        cell.removeEventListener('click',handleClick)
        cell.addEventListener('click', handleClick, {once: true})
    });
    winningMessage.classList.remove('show')

}


/**
 * handleClick() is the function which is invoked
 * after a particular cell is  clicked
 * it places the mark on the cell that is clicked 
 * and then invokes playAI()
 */

function handleClick(e){
    const cell = e.target
    placeMark(cell)
    update_b()
    playAI()
    update_b()
}


function placeMark(cell){
    cell.classList.add(notAI)
}


/*functions to make the AI play */


function playAI(){  
    let bestmove = findbestmove()
    cellElement[bestmove].removeEventListener('click',handleClick)
    cellElement[bestmove].classList.add(AI) 
}

/**
 *  isDeadEnd() determines the if 
 *  the current configuration of the 
 * board is a dead end or not
 */
function isDeadEnd(b){
    if(b.every(index =>{
        return (index == 0 || index == 1 )
    }))
        return true
    
    else 
        return false
}

/**
 *  determines the value of the present 
 *  configuration for the AI
 * 
 *  returns
 * -10 => if the present board configuration
 *  leads to AI's loss
 * 
 * 10 => if the present board configuration
 * leads to AI's win
 * 
 * 0 => if it leads to dead end
 * 
 */
function minmax(b, depth, isAI){
    let cost = evaluate(b)
    if(cost == 10)
        return 10-depth
    else if(cost == -10)
        return -10
    if(isDeadEnd(b))
        return 0
    if(isAI){
        let best_score = -1000
        for(let i =0 ; i < 9; i++){
           if(b[i] == -1){ 
                b[i] = 1
                best_score =  Math.max(best_score , minmax(b, depth + 1 , !isAI))
                b[i] = -1
            }
        }
        return best_score
    }

    else{
        let best_score = 1000
        for(let i =0 ; i< 9; i++){
            if(b[i] == -1){            
                b[i] = 0
                best_score = Math.min(best_score , minmax(b, depth + 1 , !isAI))
                b[i] = -1
            }
        }
        return best_score
    }
}

/**
 * determines the best move for the AI 
 * to make by comparing the value of the 
 * move made for each empty cell
 */
function findbestmove(){
    let moveval = -1000
    let bestmove = -1
    b.forEach((b_element , index)=> {
        if(b_element == -1){
            b[index] = 1
            console.log(index)
            if( moveval < minmax(b , 0 , false)){
                bestmove = index
                moveval = minmax(b, 0 , false)
            }
            b[index] = -1
        }
    })
    console.log(bestmove)
    return bestmove
}

/**
 *  evaluates the board configuration
 *  returns
 *  10 for AI's win
 * -10 for AI's loss
 *  0 if its not a win or a loss situation
 */
function evaluate(arg_board){
    if(winning_combination.some(combination=>{
        return (combination.every(index =>{
            return (arg_board[index] == 1)

        }))
    }))
        return 10
    else if ( winning_combination.some(combination=>{
        return (combination.every(index =>{
            return (arg_board[index] == 0)
        }))
    }))
        return -10    
    else 
        return 0
}

/**
 * endgame() determines if the game has ended
 * and displays the message accordingly
 */
function endgame(){
    let state_of_board = evaluate(b)
    if( state_of_board == 10 || state_of_board == -10 || isDeadEnd(b) ){
        
        if(state_of_board == 10)
            winningMessageText.innerText =  `${(AI== "x")? "X":"O"} Wins !`
        
        else if(state_of_board == -10)
            winningMessageText.innerText = `${(AI== "x")? "O":"X"} Wins !`
        
        else 
            winningMessageText.innerText = "Draw!"
    
        winningMessage.classList.add('show')
    }
}
/**
 * upadate_b() updates the value of the b
 * it is invoked after each click on any one of the cell
 */

function update_b(){
    cellElement.forEach((cell , index) =>{
        if(cell.classList.contains(AI))
            b[index] = 1
        else if (cell.classList.contains(notAI))
            b[index] =  0
    })
    endgame(b)
}
