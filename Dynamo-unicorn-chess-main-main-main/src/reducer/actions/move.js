import actionTypes from '../actionTypes';

export const makeNewMove = ({newPosition,newMove}) => {
    // console.log("make new move",newPosition,newMove);
    return {
        type: actionTypes.NEW_MOVE,
        payload: {newPosition,newMove},
    }
}

export const clearCandidates = () => {
    // console.log( "Clearing candidates" );
    return {
        type: actionTypes.CLEAR_CANDIDATE_MOVES,
    }
}

export const generateCandidates = ({candidateMoves,piece,file,rank}) => {
    // console.log("generate candidate",piece);
    return {
        type: actionTypes.GENERATE_CANDIDATE_MOVES,
        payload : {candidateMoves,piece,file,rank}
    }
}

export const takeBack = (index) => {
    return {
        type: actionTypes.TAKE_BACK,
        payload:{index}
    }
}
export const forwardMove = () => {
    return {
        type: actionTypes.TAKE_FORWARD,
    };
};
export const PiecePosition = (piece,file,rank) => {
    return {
        type: actionTypes.SET_PIECEPOSITION,
        payload:{piece,file,rank}
    };
};
export const PlayerTurn = (PlayerNextId,Color) => {
    return {
        type: actionTypes.PLAYERS_TURN,
        payload:{PlayerNextId,Color}
    };
};
export const OnlinePosition = (newPosition) => {
    return {
        type: actionTypes.ONLINE_POSITION,
        payload:{newPosition}
    };
};
export const CurrentIndex = (currentIndex) => {
    // console.log("index action called",currentIndex);
    return {
        type: actionTypes.CURRENT_INDEX,
        payload:{currentIndex}
    };
};

