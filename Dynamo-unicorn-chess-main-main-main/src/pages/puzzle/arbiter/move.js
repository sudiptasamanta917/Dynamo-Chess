import { copyPosition } from "../helper"

export const movePiece = ({ position, piece, rank, file, x, y }) => {
    const newPosition = copyPosition(position);

    if (piece.endsWith('k') && Math.abs(y - file) > 1) { // Castles

        // console.log(y,"hjjjjjjjjjgk");
        if (y === 1) { // Castles Long
            newPosition[rank][0] = '';
            newPosition[rank][2] = piece.startsWith('w') ? 'wr' : 'br'; // Move the rook
            newPosition[rank][1] = piece; // Move the king
            newPosition[rank][5] = ''; // Clear the old king position
        }
        if (y === 8) { // Castles Short
            newPosition[rank][9] = '';
            newPosition[rank][7] = piece.startsWith('w') ? 'wr' : 'br'; // Move the rook
            newPosition[rank][8] = piece; // Move the king
            newPosition[rank][5] = ''; // Clear the old king position
        }
    } else {
        newPosition[rank][file] = '';
        newPosition[x][y] = piece;
    }

    return newPosition;
};

// let count=0
// const counting=()=>{
//     count++
// }


export const movePawn = ({position,piece,rank,file,x,y}) => {
    
    const newPosition = copyPosition(position)

    // EnPassant, looks like capturing an empty cell
    // Detect and delete the pawn to be removed
    if (!newPosition[x][y] && x !== rank && y !== file) {
        newPosition[rank][y] = '';
        // counting();
        // console.log(count,"uuuuuuuuuuuu");

    }
  
    // console.log(count,"uuuuuuuuuuuu");
    newPosition[rank][file] = ''
    newPosition[x][y] = piece
    return newPosition
}