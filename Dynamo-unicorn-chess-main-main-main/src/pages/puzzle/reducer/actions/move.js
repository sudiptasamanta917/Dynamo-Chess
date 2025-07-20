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

export const takeBack = () => {
    return {
        type: actionTypes.TAKE_BACK,
    }
}
