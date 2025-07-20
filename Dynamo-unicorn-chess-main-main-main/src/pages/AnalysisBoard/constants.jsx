import socket from '../multiplayer/socket';
import { createPosition } from './helper'

export const Status = {
    'ongoing' : 'Ongoing',
    'promoting' : 'Promoting',
    'white' : 'White wins',
    'black' : 'Black wins',
    'stalemate' : 'Game draws due to stalemate',
    'insufficient' : 'Game draws due to insufficient material',
}
const moveList=[];
const position=[createPosition()];
let currentIndex=0

export const initGameState = {
    position :position,
    turn : 'w',
    candidateMoves : [],
    movesList :moveList,
    currentIndex:0,
    movelistIndex:0,
    undoneMoves: [],
    newmove:[],
    promotionSquare : null,
    status : Status.ongoing,
    castleDirection : {
        w : 'both',
        b : 'both'
    }, 
}