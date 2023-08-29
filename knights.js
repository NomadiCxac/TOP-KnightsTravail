class knight { 
    constructor(x, y) {
        this.position = [x, y];
        this.possibleMoveSet = this.generatePossibleMoveSet(this.position);
    }

   

    generatePossibleMoveSet(position) {

        if (position[0] == null || position[1] == null) {
            return null;
        } 

        let moveSet = [];
        let x = position[0];
        let y = position[1];

        // North East Direction
        moveSet.push([x + 1, y + 2]);
        moveSet.push([x + 2, y + 1]);

        // Sout East Direction
        moveSet.push([x + 2, y - 1]);
        moveSet.push([x + 1, y - 2]);

        // South West Direction
        moveSet.push([x - 2, y - 1]);
        moveSet.push([x - 1, y - 2]);

        // North West Direction
        moveSet.push([x - 1, y + 2]);
        moveSet.push([x - 2, y + 1]);

        return moveSet;
    }

    setPosition (x, y) {

        if (x > 7 || x < 0 || y > 7 || y < 0) {
            console.log("Illegal Move. Chess Board Coordinates DO NOT Exist!")
            return false;
        }
        this.position = [x, y];
        this.possibleMoveSet = this.generatePossibleMoveSet(this.position);

        return this.position;
    }
    
}

class chessBoard {
    constructor() {
        this.height = 8;
        this.width = 8;
        this.gameState = this.initialize(0);
        this.knight = new knight(null, null);
    }

    initialize(value) {
        let board = [];
        for (let i = 0; i < this.height; i++) {
            let row = [];
            for (let j = 0; j < this.width; j++) {
                row.push(value);
            }
            board.push(row);
        }

        return board;
    }

    display() {
        for (let i = 0; i < this.height; i++) {
            console.log(this.gameState[i].join(" | "));
            if (i !== this.height - 1) {
                console.log("-".repeat(this.width * 4 - 1));  // separator
            }
        }
    }

    checkKnightValidMove() {
        let moves = this.knight.possibleMoveSet;
        let validMoveArray = [];
        for (let i = 0; i < moves.length; i++) {
            if ((moves[i][0] >= 0 && moves[i][0] <= 7) && (moves[i][1] >= 0 && moves[i][1] <= 7)) {
                validMoveArray.push(moves[i]);
            }
        }
        return validMoveArray;
    }

    findShortestPath(start, end) {

        if (start[0] === end[0] && start[1] === end[1]) {
            return {
                path: [start],
                steps: 0
            }
        }

        let queue = [];
        let parents = {};

        queue.push([start, 0, []]); // [position, stepsTaken, pathTaken]
        this.gameState[start[0]][start[1]] = 1; // Mark start position as visited
    
        while (queue.length !== 0) {
            let [currentPosition, steps, path] = queue.shift();
    
            // Update knight's position to the current position and get valid moves from there
            this.knight.setPosition(currentPosition[0], currentPosition[1]);
            let possibleMoveSet = this.checkKnightValidMove();
    
            for (let move of possibleMoveSet) {

                // If target reached
                if (move[0] === end[0] && move[1] === end[1]) {
                    // Construct the complete path including the final move
                    let completePath = [...path, currentPosition, move];
                    this.gameState = this.initialize(0);

                    for (let i = 0; i < completePath.length; i++) {
                        this.gameState[completePath[i][0]][completePath[i][1]] = i + 1;
                    }

                    return {
                        path: completePath,
                        steps: steps + 1,
                        currentPosition: currentPosition
                    };
                }
    
                // If target not reached
                if (this.gameState[move[0]][move[1]] === 0) { // If the move is not visited
                    parents[move] = currentPosition;
                    queue.push([move, steps + 1, [...path, currentPosition]]);
                    this.gameState[move[0]][move[1]] = 1; // Mark this move as visited
                }
            }
        }

    
        // If queue is exhausted without finding the target position, no path exists
        return {
            path: [],
            steps: -1
        }; 
    }
}

// let testKnight = new knight(3, 3);
// console.log(testKnight.position);
// console.log(testKnight.possibleMoveSet);
// testKnight.setPosition(4, 4);
// console.log(testKnight.position);

let testBoard = new chessBoard;
// console.log(testBoard.knight.setPosition(1, 1));
// console.log(testBoard.knight.possibleMoveSet)
// console.log(testBoard.checkKnightValidMove())
// console.log(testBoard.gameState[0][1]);

console.log(testBoard.findShortestPath([7,2], [2,6]));
console.log(testBoard.display())