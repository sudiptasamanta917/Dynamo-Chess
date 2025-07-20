import actionTypes from '../actionTypes';
import { initGameState } from '../../constants';

export const updateCastling = (direction,turn) => {
    // console.log("updateCastling");
    return {
        type: actionTypes.CAN_CASTLE,
        payload: {direction,turn},
    }
}

export const detectStalemate = () => {
    return {
        type: actionTypes.STALEMATE,
    }
}

export const detectInsufficientMaterial = () => {
    return {
        type: actionTypes.INSUFFICIENT_MATERIAL,
    }
}

export const detectCheckmate = winner => {
    return {
        type: actionTypes.WIN,
        payload : winner
    }
}

export const setupNewGame = () => {
    return {
        type: actionTypes.NEW_GAME,
        payload : initGameState
    }
}
export const setPlayerId = (id) => {
    // console.log("playerId action called",id);
    return {
        type: actionTypes.SET_PLAYERiD,
        payload : id
    }
}
export const UpdateBoard = (newPosition) => {
    // console.log("update board action called",newPosition);
    return {
        type: actionTypes.UPDATE_GAME_STATE,
        payload: {
          newPosition,
        }
    }
}
