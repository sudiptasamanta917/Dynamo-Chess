import { Status, initGameState } from "../constants";
import actionTypes from "./actionTypes";

export const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_GAME_STATE: {
            let { position} = state;
            // console.log(action.payload,"assssssss");
            // position = [action.payload.newPosition?.newPosition]
            position = action.payload.newPosition;
            // console.log(position,"ggggggggggggggffffffffff+00000000000");
            // movesList = action.payload.movesList
            
            // currentIndex = movesList.length
            // movelistIndex=currentIndex
            // console.log(("turnghhhhhhhhhhhhhhh", position.splice(currentIndex,0,action.payload.newPosition)));
            // Clear undone moves when a new move is made
            return {
                ...state,
                position,
                // movesList,
                // currentIndex,
            
                // movelistIndex


            };
        }
        case actionTypes.NEW_MOVE: {
            let { position, movesList, turn, currentIndex, newmove } = state;
            if (action.payload.newPosition) {
                position = [...position, action.payload.newPosition];
                movesList = [...movesList, action.payload.newMove];
            }
            currentIndex+=1
           
            turn = turn === 'w' ? 'b' : 'w';
            // console.log(("turnghhhhhhhhhhhhhhh", position.splice(currentIndex,0,action.payload.newPosition)));
            // Clear undone moves when a new move is made
            return {
                ...state,
                position,
                movesList,
                turn,
                currentIndex


            };
        }

        case actionTypes.GENERATE_CANDIDATE_MOVES: {
            const { candidateMoves, piece, file, rank } = action.payload;
            return {
                ...state,
                candidateMoves,
                piece,
                file,
                rank,
            };
        }
        case actionTypes.PLAYERS_TURN: {
            let { turn, } = state;
            const { PlayerNextId, Color } = action.payload;
            turn=Color;
            return {
                ...state,
                PlayerNextId,
               turn,
               Color
            };
        }
        case actionTypes.ONLINE_POSITION: {
            const { newPosition } = action.payload;
            let { position } = state;
            position = [...position, newPosition];
            return {
                ...state,
                ONLINEPOSITION: position
            };
        }
        case actionTypes.SET_PIECEPOSITION: {
            // console.log("piece position reduce called");
            const { piece, file, rank } = action.payload;
            return {
                ...state,
                piecePosition: { piece, file, rank }
            };
        }

        case actionTypes.CLEAR_CANDIDATE_MOVES: {
            return {
                ...state,
                candidateMoves: [],
            };
        }

        case actionTypes.PROMOTION_OPEN: {
            return {
                ...state,
                status: Status.promoting,
                promotionSquare: { ...action.payload },
            };
        }

        case actionTypes.PROMOTION_CLOSE: {
            return {
                ...state,
                status: Status.ongoing,
                promotionSquare: null,
            };
        }

        case actionTypes.CAN_CASTLE: {
            let { castleDirection } = state;
            let {direction,turn} = action.payload;
            // console.log(direction,turn,"castlingv ");
            
            castleDirection[turn] = direction;

            return {
                ...state,
                castleDirection,
            };
        }

        case actionTypes.STALEMATE: {
            return {
                ...state,
                status: Status.stalemate,
            };
        }

        case actionTypes.INSUFFICIENT_MATERIAL: {
            return {
                ...state,
                status: Status.insufficient,
            };
        }

        case actionTypes.WIN: {
            return {
                ...state,
                status: action.payload === 'w' ? Status.white : Status.black,
            };
        }

        case actionTypes.NEW_GAME: {
            return {
                ...action.payload,
            };
        }

        // case actionTypes.TAKE_BACK: {
        //     let { position, movesList, turn, undoneMoves, currentIndex } = state;
        
        //     if (currentIndex > 0) {
        //         // const lastPosition = position[currentIndex - 1];
        
        //         // Store the undone move at the beginning of the array
        //         undoneMoves.unshift(position[currentIndex]);
        
        //         // Update position to remove the last move
        //         position = position.slice(0, currentIndex);
        
        //         // Update currentIndex
        //         currentIndex -= 1;
        
        //         // Switch the turn between 'w' and 'b'
        //         turn = turn === 'w' ? 'b' : 'w';
        //     }
        
        //     return {
        //         ...state,
        //         position,
        //         movesList,
        //         turn,
        //         undoneMoves,
        //         currentIndex
        //     };
        // }
        
        // case actionTypes.TAKE_FORWARD: {
        //     let { position, movesList, turn, undoneMoves, currentIndex } = state;
        
        //     if (undoneMoves.length > 0 && currentIndex < position.length) {
        //         // Retrieve and remove the first undone move
        //         const forwardPosition = undoneMoves.shift();
        
        //         // Update position to include the forward move
        //         position.push(forwardPosition);
        
        //         // Update currentIndex
        //         currentIndex += 1;
        
        //         // Switch the turn between 'w' and 'b'
        //         turn = turn === 'w' ? 'b' : 'w';
        //     }
        
        //     return {
        //         ...state,
        //         position,
        //         movesList,
        //         turn,
        //         undoneMoves,
        //         currentIndex
        //     };
        // }

        case actionTypes.SET_POSITION: {
            const position = action.payload;
            return {
                ...state,
                currentDisplayedPosition: position, // Add this to track the displayed position
            };
        }
        case actionTypes.CURRENT_INDEX: {
            // console.log(action.payload.currentIndex);
            let { currentIndex, } = state;
            currentIndex=action.payload.currentIndex

            return {
                ...state,
                currentIndex,
            };
        }
        case actionTypes.SET_PLAYERiD: {
            const id = action.payload;
            return {
                ...state,
                PlayerId: id // Add this to track the displayed position
            };
        }
      
        default:
            return state;
    }
};
