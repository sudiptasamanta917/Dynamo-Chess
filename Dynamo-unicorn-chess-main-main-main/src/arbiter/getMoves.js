import arbiter from "./arbiter"

const UserDetail = JSON.parse(localStorage.getItem("User Detail"));
const userId = UserDetail?._id;
const playerId=localStorage.getItem("PlayerId")

export const getRookMoves = ({position,piece,rank,file}) => {
    const moves = []
    const us = piece[0]
    const enemy = us === 'w' ? 'b' : 'w'

    const direction = [
        [-1,0],
        [1,0],
        [0,-1],
        [0,1],
    ]

    direction.forEach(dir => {
        for (let i = 1; i <= 10; i++) {
            const x = rank+(i*dir[0])
            const y = file+(i*dir[1])
            if(position?.[x]?.[y] === undefined)
                break
            if(position[x][y].startsWith(enemy)){
                moves.push ([x,y])
                break;
            }
            if(position[x][y].startsWith(us)){
                break
            }
            moves.push ([x,y])
        }
    })

    return moves
}

export const getKnightMoves = ({position,rank,file}) => {
    const moves = []
    const enemy = position[rank][file].startsWith('w') ? 'b' : 'w'

    const candidates = [
        [-2,-1],
        [-2,1],
        [-1,-2],
        [-1,2],
        [1,-2],
        [1,2],
        [2,-1],
        [2,1],
    ]
    candidates.forEach(c => {
        const cell = position?.[rank+c[0]]?.[file+c[1]]
        if(cell !== undefined && (cell.startsWith(enemy) || cell === '')){
            moves.push ([rank+c[0],file+c[1]])
        }
    })
    return moves
}

export const getBishopMoves = ({position,piece,rank,file}) => {
    const moves = []
    const us = piece[0]
    const enemy = us === 'w' ? 'b' : 'w'

    const direction = [
        [-1,-1],
        [-1,1],
        [1,-1],
        [1,1],
    ]

    direction.forEach(dir => {
        for (let i = 1; i <= 10; i++) {
            const x = rank+(i*dir[0])
            const y = file+(i*dir[1])
            if(position?.[x]?.[y] === undefined)
                break
            if(position[x][y].startsWith(enemy)){
                moves.push ([x,y])
                break;
            }
            if(position[x][y].startsWith(us)){
                break
            }
            moves.push ([x,y])
        }
    })
    return moves
}

export const getQueenMoves = ({position,piece,rank,file}) => {
    const moves = [
        ...getBishopMoves({position,piece,rank,file}),
        ...getRookMoves({position,piece,rank,file})
    ]
    
    return moves
}
export const getMissileMoves = ({position,piece,rank,file}) => {
    const moves = [
        ...getBishopMoves({position,piece,rank,file}),
        ...getKnightMoves({position,piece,rank,file})
    ]
    
    return moves
}

export const getKingMoves = ({position,piece,rank,file}) => {
    let moves = []
    const us = piece[0]
    // console.log(us,"king moves");
    const direction = [
        [1,-1], [1,0],  [1,1],
        [0,-1],         [0,1],
        [-1,-1],[-1,0], [-1,1],
    ]

    direction.forEach(dir => {
        const x = rank+dir[0]
        const y = file+dir[1]
        if(position?.[x]?.[y] !== undefined && !position[x][y].startsWith(us))
        moves.push ([x,y])
    })
    return moves
}

export const getPawnMoves = ({position,piece,rank,file}) => {
   
    const moves = []
    const dir = piece==='wp' ? 1 : -1
    // const dir = piece==='wp' ? -1 : 1
    // const dir = userId===playerId ? piece==='wp' ? -1 : 1:piece==='wp' ? 1 : -1

    // Move Three tiles on first move
    if (rank % 7 === 1 ){
        if (position?.[rank+dir]?.[file] === '' && position?.[rank+dir+dir]?.[file] === ''){
          
            moves.push ([rank+dir+dir,file]);
        }
        if (position?.[rank+dir]?.[file] === ''&& position?.[rank+dir+dir]?.[file] === '' && position?.[rank+dir+dir+dir]?.[file] === ''){
          
            moves.push ([rank+dir+dir+dir,file]);
        }
       
    }
  
    

    // Move one tile
    if (!position?.[rank+dir]?.[file]){
        moves.push ([rank+dir,file])
    }
    
    return moves
}


export const getPawnCaptures =  ({position,prevPosition,piece,rank,file}) => {
// console.log(position,prevPosition,piece,rank,file,"eeeeeeeeeeeeeeeeee");
    const moves = []
    const dir = piece==='wp' ? 1 : -1
    // const dir = piece==='wp' ? -1 : 1
    const enemy = piece[0] === 'w' ? 'b' : 'w'

    // Capture enemy to left
    if (position?.[rank+dir]?.[file-1] && position[rank+dir][file-1].startsWith(enemy) ){
        moves.push ([rank+dir,file-1])
    }

    // Capture enemy to right
    if (position?.[rank+dir]?.[file+1] && position[rank+dir][file+1].startsWith(enemy) ){
        moves.push ([rank+dir,file+1])
    }

    // EnPassant
    // Check if enemy moved twice in last round
    const enemyPawn = dir === 1 ? 'bp' : 'wp'
    const adjacentFiles = [file-1,file+1]
    // console.log(rank,dir,'oooooooooooo');
    if(prevPosition){
        if ((dir === 1 && rank === 6) || (dir === -1 && rank === 3)){
            adjacentFiles.forEach(f => {
                if (position?.[rank]?.[f] === enemyPawn && 
                    position?.[rank+dir+dir]?.[f] === '' &&
                    prevPosition?.[rank]?.[f] === '' && 
                    prevPosition?.[rank+dir+dir]?.[f] === enemyPawn){
                       
                        moves.push ([rank+dir,f])
                    }
            })
        }
        if ((dir === 1 && rank === 5) || (dir === -1 && rank === 4)){
            adjacentFiles.forEach(f => {
                if (position?.[rank]?.[f] === enemyPawn && 
                    position?.[rank+dir+dir]?.[f] === '' &&
                    position?.[rank+dir+dir+dir]?.[f] === '' &&
                    prevPosition?.[rank]?.[f] === '' && 
                    prevPosition?.[rank+dir+dir]?.[f] === '' && 
                    prevPosition?.[rank+dir+dir+dir]?.[f] === enemyPawn){
                        moves.push ([rank+dir,f])
                      
                    }
            })
        }
    }
    // console.log(moves,"aaaaaaaaaaaaaaaaa");

    return moves
}

export const getCastlingMoves = ({position,castleDirection,piece,rank,file}) => {
    const moves = []
    
    // console.log(file,rank,castleDirection,"get castling moves");
    if (file !== 5 || rank % 9 !== 0 || castleDirection === 'none'){
        return moves
    }
    if (piece.startsWith('w') ){

        if (arbiter.isPlayerInCheck({
            positionAfterMove : position,
            player : 'w'
        }))
            return moves

        if (['left','both'].includes(castleDirection) && 
            !position[0][4] && 
            !position[0][3] && 
            !position[0][2] && 
            !position[0][1] &&
            position[0][0] === 'wr' &&
            !arbiter.isPlayerInCheck({
                positionAfterMove : arbiter.performMove({position,piece,rank,file,x:0,y:4}),
                player : 'w'
            })&&
            !arbiter.isPlayerInCheck({
                positionAfterMove : arbiter.performMove({position,piece,rank,file,x:0,y:3}),
                player : 'w'
            })
             &&
            !arbiter.isPlayerInCheck({
                positionAfterMove : arbiter.performMove({position,piece,rank,file,x:0,y:2}),
                player : 'w'
            })){
            moves.push ([0,2])
        }
        if (['right','both'].includes(castleDirection) && 
            !position[0][6] && 
            !position[0][7] && 
            !position[0][8] &&
            position[0][9] === 'wr' &&
            !arbiter.isPlayerInCheck({
                positionAfterMove : arbiter.performMove({position,piece,rank,file,x:0,y:6}),
                player : 'w'
            })&&
            !arbiter.isPlayerInCheck({
                positionAfterMove : arbiter.performMove({position,piece,rank,file,x:0,y:7}),
                player : 'w'
            })
             &&
            !arbiter.isPlayerInCheck({
                positionAfterMove : arbiter.performMove({position,piece,rank,file,x:0,y:8}),
                player : 'w'
            }))
            {
            moves.push ([0,8])
        }
    }
    else {
        if (arbiter.isPlayerInCheck({
            positionAfterMove : position,
            player : 'b'
        }))
            return moves

        if (['left','both'].includes(castleDirection) && 
            !position[9][4] && 
            !position[9][3] && 
            !position[9][2] && 
            !position[9][1] &&
            position[9][0] === 'br' &&
            !arbiter.isPlayerInCheck({
                positionAfterMove : arbiter.performMove({position,piece,rank,file,x:9,y:4}),
                position : position,
                player : 'b'
            })&&
            !arbiter.isPlayerInCheck({
                positionAfterMove : arbiter.performMove({position,piece,rank,file,x:9,y:3}),
                position : position,
                player : 'b'
            })
             &&
            !arbiter.isPlayerInCheck({
                positionAfterMove : arbiter.performMove({position,piece,rank,file,x:9,y:2}),
                position : position,
                player : 'b'
            })){
            moves.push ([9,2])
        }
        if (['right','both'].includes(castleDirection) && 
            !position[9][6] && 
            !position[9][7] && 
            !position[9][8] &&
            position[9][9] === 'br' &&
            !arbiter.isPlayerInCheck({
                positionAfterMove : arbiter.performMove({position,piece,rank,file,x:9,y:6}),
                position : position,
                player : 'b'
            })&&
            !arbiter.isPlayerInCheck({
                positionAfterMove : arbiter.performMove({position,piece,rank,file,x:9,y:7}),
                position : position,
                player : 'b'
            }) 
             &&
            !arbiter.isPlayerInCheck({
                positionAfterMove : arbiter.performMove({position,piece,rank,file,x:9,y:8}),
                position : position,
                player : 'b'
            })){
            moves.push ([9,8])
        }
    }

    return moves

}

export const getCastlingDirections = ({castleDirection,piece,file,rank}) => {
    file = Number(file)
    rank = Number(rank)
    const direction = castleDirection[piece[0]]
    // console.log(direction,file,rank,"get castling direction");
    if (piece.endsWith('k'))
        return 'none'

    if (file === 0 && rank === 0 ){ 
        if (direction === 'both')
            return 'right'
        if (direction === 'left')
            return 'none'
    } 
    if (file === 9 && rank === 0 ){ 
        if (direction === 'both')
            return 'left'
        if (direction === 'right')
            return 'none'
    } 
    if (file === 0 && rank === 9 ){ 
        if (direction === 'both')
            return 'right'
        if (direction === 'left')
            return 'none'
    } 
    if (file === 9 && rank === 9 ){ 
        if (direction === 'both')
            return 'left'
        if (direction === 'right')
            return 'none'
    } 
   
}

export const getPieces = (position, enemy) => {
    const enemyPieces = []
    position.forEach((rank,x) => {
        rank.forEach((file, y) => {
            if(position[x][y].startsWith(enemy))
                enemyPieces.push({
                    piece : position[x][y],
                    rank : x,
                    file : y,
                })
        })
    })
    return enemyPieces
}

export const getKingPosition = (position, player) => {
    let kingPos 
    position.forEach((rank,x) => {
        rank.forEach((file, y) => {
            if(position[x][y].startsWith(player) && position[x][y].endsWith('k'))
                kingPos=[x,y]
        })
    })
    return kingPos
}