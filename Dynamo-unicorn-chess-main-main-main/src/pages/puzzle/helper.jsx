export const getCharacter = file => String.fromCharCode(file + 96)
export const createPosition = () => {
    // Initialize the position array with empty strings
    const position = new Array(10).fill('').map(() => new Array(10).fill(''));
    
    // Define the pieces for each side
    const whitePieces = ['wr', 'wn', 'wb', 'wm', 'wq', 'wk', 'wm', 'wb', 'wn', 'wr', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'];
    const blackPieces = ['br', 'bn', 'bb', 'bm', 'bq', 'bk', 'bm', 'bb', 'bn', 'br', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'];
    
    // Shuffle the pieces
    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };
    
    shuffle(whitePieces);
    shuffle(blackPieces);
    
    // Place the white pieces on random squares
    for (let i = 0; i < whitePieces.length; i++) {
        let placed = false;
        while (!placed) {
            const row = Math.floor(Math.random() * 10);
            const col = Math.floor(Math.random() * 10);
            if (position[row][col] === '') {
                position[row][col] = whitePieces[i];
                placed = true;
            }
        }
    }
    
    // Place the black pieces on random squares
    for (let i = 0; i < blackPieces.length; i++) {
        let placed = false;
        while (!placed) {
            const row = Math.floor(Math.random() * 10);
            const col = Math.floor(Math.random() * 10);
            if (position[row][col] === '') {
                position[row][col] = blackPieces[i];
                placed = true;
            }
        }
    }
    
    return position;
}

// Example usage:
// console.log(createPosition());


export const copyPosition = position => {
    const newPosition = 
        new Array(10).fill('').map(x => new Array(10).fill(''))

    for (let rank = 0; rank < position.length; rank++) {
        for (let file = 0; file < position[0].length; file++) {
            newPosition[rank][file] = position[rank][file]
        }
    }

    return newPosition
}

export const areSameColorTiles = (coords1,coords2) => 
    (coords1.x + coords1.y) % 2 === (coords2.x + coords2.y)


export const findPieceCoords = (position,type) => {
    let results = []
    position.forEach((rank,i) => {
        rank.forEach((pos,j) => {
            if (pos === type)
                results.push({x: i, y: j})
        })
    });
    return results
}

export const getNewMoveNotation = ({piece,rank,file,x,y,position,promotesTo}) => {
    let note = ''

    rank = Number(rank)
    file = Number(file)
    // console.log(piece?.[1],"hhhhhhhhh'............");
    if (piece[1] === 'k' && Math.abs(file-y) === 2){
        if (file < y)
            return 'O-O'
        else
            return 'O-O-O'
    }

    if(piece[1] !== 'p'){
        note+=piece[1].toUpperCase()
        if(position[x][y]){
            note+='x'
        }
    }
    else if (rank !==x && file !== y ){
        note+=getCharacter(file+1)+'x'
    }

    note+=getCharacter(y+1)+(x+1)

    if(promotesTo)
        note += '=' + promotesTo.toUpperCase()

    return note
}