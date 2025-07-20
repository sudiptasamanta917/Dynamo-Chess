export const createRandomPuzzlePosition = () => {
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

// Example usage
const randomPuzzlePosition = createRandomPuzzlePosition();
// console.log(randomPuzzlePosition);

const url = "https://dynamo-chess.vercel.app/multiplayer/tournament:66d85c189ddc0347d59c14df:bac8128a-5aa3-46e0-93ea-1e9f6f87721a/60";
let uniqueID;

if (url.includes("tournament:")) {
  uniqueID = url.split("tournament:")[1].split(':')[0];
} else {
  uniqueID = url.split('/')[4];
}

// console.log(uniqueID, "aaaaaaaaaaaaa");


