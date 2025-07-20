const move1 = ["a1", "b1", ["w1", "g1", "f2"], "j3", "j4", ["w1", "g1", "f2"]];
const position1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const insertMoveAndPosition = (moves, positions, index, newMove, newPosition) => {
    if (index >= 0 && index <= moves.length) {
        moves.splice(index, 0, newMove);
        positions.splice(index, 0, newPosition);
    } else {
        console.error('Invalid index provided.');
    }
};

const flattenMovesAndPositions = (moves, positions,index) => {                                                                                                                                                                                                                                                                                                                                                                    
    let flattenedMoves = [];
    let flattenedPositions = [];
    // let positionIndex = 0;

    for (let i = 0; i < moves.length; i++) {
        if (Array.isArray(moves[i])) {
            for (let j = 0; j < moves[i].length; j++) {
                flattenedMoves.push(moves[i][j]);
                flattenedPositions.push(positions[positionIndex]);
            }
        } else {
            flattenedMoves.push(moves[i]);
            flattenedPositions.push(positions[positionIndex]);
        }
        positionIndex++;
    }

    return { flattenedMoves, flattenedPositions };
};

const getMoveAndPosition = (moves, positions, index) => {
    const { flattenedMoves, flattenedPositions } = flattenMovesAndPositions(moves, positions);
    
    if (index >= 0 && index < flattenedMoves.length) {
        return {
            move: flattenedMoves[index],
            position: flattenedPositions[index+1]
        };
    } else {
        console.error('Invalid index provided.');
        return null;
    }
};

// Example usage:
// Insert new move and position
insertMoveAndPosition(move1, position1, 5, 'k1', 32);

// console.log('After insertion:');
// console.log('Moves:', move1);      // ["a1", "b1", ["w1", "g1", "f2"], "j3", "j4", "k1", ["w1", "g1", "f2"]]
// console.log('Positions:', position1);  // [1, 2, 3, 4, 5, 32, 6, 7, 8, 9, 10]

// Retrieve move and position at a specific index
const index = 3;
const result = getMoveAndPosition(move1, position1, index);

if (result) {
    // console.log(`Move at index ${index}:`, result.move);       // Output: Move at index 3: w1
    // console.log(`Position at index ${index}:`, result.position,position1[3]); // Output: Position at index 3: 4
}
