import { Status, initGameState } from "../constants";
import actionTypes from "./actionTypes";

export const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_GAME_STATE: {
            // console.log(actionTypes.UPDATE_GAME_STATE,"ggggggggggggggffffffffff+00000000000");
            let { position, movesList, turn, currentIndex, newmove,movelistIndex } = state;
            // console.log(action.payload.position,"assssssss");
            position = action.payload.position
            movesList = action.payload.movesList
            turn=action.payload.turn
            currentIndex = movesList.length
            movelistIndex=currentIndex
            // console.log(("turnghhhhhhhhhhhhhhh", position.splice(currentIndex,0,action.payload.newPosition)));
            // Clear undone moves when a new move is made
            return {
                ...state,
                position,
                movesList,
                currentIndex,
                turn,
                movelistIndex


            };
        }
        case actionTypes.NEW_MOVE: {
            let { position, movesList, turn, currentIndex,} = state;
            if (action.payload.newPosition) {
                position = [...position, action.payload.newPosition];
            }
            // position.splice(currentIndex+1, 0, action.payload.newPosition);
            currentIndex+=1
            movesList = [...movesList, action.payload.newMove];
            // console.log(currentIndex, movesList.length, "fffffffffffffff------");
                  
            // if (movelistIndex < movesList.length) {

            //     // console.log("string",typeof(movesList[currentIndex]));
            //     if (typeof (movesList[movelistIndex]) === 'object') {
            //         // console.log("push array", action.payload.newMove);
            //         movesList[movelistIndex].push(action.payload.newMove)
            //         // position.splice(movelistIndex,0,action.payload.newPosition)
            //         currentIndex += 1
            //     }
            //     else if (typeof (movesList[movelistIndex]) === 'string') {
            //         newmove = []
            //         if(movelistIndex%2!=0){
            //             newmove.push("...")
            //             newmove.push(action.payload.newMove)
            //             currentIndex += 1
            //         }
            //         else{
            //             newmove = []
            //             newmove.push(action.payload.newMove)

            //         }
            //         movesList.splice(movelistIndex, 0, newmove);
            //         // position.splice(movelistIndex,0,action.payload.newPosition)
            //         // console.log("else push array", action.payload.newMove);
            //         currentIndex += 1
            //     }
            //     // newmove=[]
            //     // currentIndex+=1
            // }

            // else {
            //     movesList.splice(currentIndex, 0, action.payload.newMove);
            //     newmove = []
            //     currentIndex=currentIndex+1
            //     movelistIndex+=1
            //     // console.log(currentIndex,"currentindex");
                
            // }
            // position.push(action.payload.newPosition)
            turn = turn === 'w' ? 'b' : 'w';
            // console.log(("turnghhhhhhhhhhhhhhh", position.splice(currentIndex,0,action.payload.newPosition)));
            // Clear undone moves when a new move is made
            return {
                ...state,
                position,
                movesList,
                turn,
                currentIndex,

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
            const { PlayerNextId, Color } = action.payload;
            return {
                ...state,
                PlayerNextId,
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
            let { turn, castleDirection } = state;
            castleDirection[turn] = action.payload;

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
        case actionTypes.TAKE_BACK: {
            let { position, movesList, turn, undoneMoves, currentIndex,movelistIndex } = state;
            if (currentIndex > 0) {
                // const lastPosition = position[currentIndex - 1];
            //    console.log(Status.ongoing);
               
                // Store the undone move at the beginning of the array
                undoneMoves.unshift(position[currentIndex]);
        
                // Update position to remove the last move
                position = position.slice(0, currentIndex);
        
                // Update currentIndex
                currentIndex -= 1;
                movelistIndex=currentIndex
        
                // Switch the turn between 'w' and 'b'
                turn = turn === 'w' ? 'b' : 'w';
            }
        
            return {
                ...state,
                position,
                movesList,
                turn,
                undoneMoves,
                currentIndex,
                movelistIndex,
                // status: Status.ongoing,
            };
        }
        
        case actionTypes.TAKE_FORWARD: {
            let { position, movesList, turn, undoneMoves, currentIndex,movelistIndex } = state;
        
            if (undoneMoves.length > 0 && currentIndex < position.length) {
                // Retrieve and remove the first undone move
                const forwardPosition = undoneMoves.shift();
        
                // Update position to include the forward move
                position.push(forwardPosition);
                
                // Update currentIndex
                currentIndex += 1;
                movelistIndex=currentIndex
                // Switch the turn between 'w' and 'b'
                turn = turn === 'w' ? 'b' : 'w';
            }
        
            return {
                ...state,
                position,
                movesList,
                turn,
                undoneMoves,
                currentIndex,
                movelistIndex,
                // status: Status.ongoing,
            };
        }
        
        case actionTypes.SET_POSITION: {
            const position = action.payload;
            // console.log(Status.ongoing);
            
            return {
                ...state,
                currentDisplayedPosition: position, // Add this to track the displayed position
                status: Status.ongoing,
            };
        }
        case actionTypes.CURRENT_INDEX: {
            // console.log(action.payload,"hhhhhhhhhhhh");
            let { position, undoneMoves,currentIndex,turn } = state;
            currentIndex = action.payload;

            // if (currentIndex >= 0 && currentIndex < position.length) {
            //     // Move elements from position to undoneMoves starting from currentIndex
            //     const elementsToMove = position.splice(currentIndex+1);
            //     undoneMoves = [...elementsToMove, ...undoneMoves];
            // } else if (currentIndex >= position.length) {
            //     // Calculate the number of elements to move back from undoneMoves to position
            //     const numElementsToMoveBack = currentIndex - position.length + 1;
            //     if (numElementsToMoveBack <= undoneMoves.length) {
            //         const elementsToMoveBack = undoneMoves.splice(0, numElementsToMoveBack);
            //         position = [...position, ...elementsToMoveBack];
            //     }
            // }
            // console.log(currentIndex);
            // turn = currentIndex%2!==0 ? 'w' : 'b';
            return {
                ...state,
                position,
                undoneMoves,
                currentIndex,
                turn,
            };
        }
        case actionTypes.MOVELIST_INDEX: {
            // console.log(action.payload.currentIndex);
            let { movelistIndex,turn } = state;
            movelistIndex = action.payload;
            turn = turn === 'w' ? 'b' : 'w';
            return {
                ...state,
                movelistIndex,
                turn,
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




// case actionTypes.CURRENT_INDEX: {
//     let { position, movesList, turn, undoneMoves, currentIndex } = state;
//     currentIndex = action.payload;

//     if (currentIndex > position.length + undoneMoves.length) {
//       console.log("out of bound");
//       return state;
//     }

//     if (currentIndex === position.length - 1) {
//         console.log(position, undoneMoves, "position and undoneMoves");
//         return state;
//     }

//     if (undoneMoves.length === 0) {
//       console.log("Initializing undone moves array");
//       for (let i = currentIndex + 1; i < position.length; i++) {
//         undoneMoves.push(position[i]);
//       }
//       position = position.slice(0, currentIndex + 1);
//     } else if (currentIndex > position.length - 1) {
//       let tempCurrentIndex = currentIndex - position.length;
//       for (let i = 0; i <= tempCurrentIndex; i++) {
//         position.push(undoneMoves[i]);
//       }
//       undoneMoves = undoneMoves.slice(tempCurrentIndex + 1);
//     } else {
//       if (currentIndex < position.length - 1) {
//         for (let i = currentIndex + 1; i < position.length; i++) {
//           undoneMoves.unshift(position[i]);
//         }
//         position = position.slice(0, currentIndex + 1);
//       }
//     }
//     turn = turn === 'w' ? 'b' : 'w';
//     // console.log(position, undoneMoves);

//     return {
//       ...state,
//       currentIndex,
//       position,
//       undoneMoves,
//       turn,
//     };
//   }