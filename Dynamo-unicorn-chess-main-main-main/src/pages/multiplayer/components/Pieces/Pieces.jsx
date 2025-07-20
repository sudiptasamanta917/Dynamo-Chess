import './Pieces.css';
import Piece from './Piece';
import { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../../../../contexts/Context';
import { openPromotion } from '../../../../reducer/actions/popup';
import { getCastlingDirections } from '../../arbiter/getMoves';
import { updateCastling, detectStalemate, detectInsufficientMaterial, detectCheckmate } from '../../../../reducer/actions/game';
import { makeNewMove, clearCandidates } from '../../../../reducer/actions/move';
import arbiter from '../../arbiter/arbiter';
import { getNewMoveNotation } from '../../helper';
import '../../../../globalInit';
import socket from '../../socket';
import { UserDetail } from '../../Utils/getLocalStorageData';

const Pieces = () => {
    const { appState, dispatch } = useAppContext();
    const currentPosition = appState.position[appState.position.length - 1];
    // const [position, setPosition] = useState([]);
    const userDetail = UserDetail();
    const RoomId = localStorage.getItem("RoomId");
    const userId = userDetail?._id;
    const playerId = appState.PlayerId
    const ref = useRef();
    const displayedPosition = appState.currentDisplayedPosition
    // console.log(currentPosition,"hhhhhhhhhhhhhhhhhhhdfgdgdhdfh");
    useEffect(() => {
        if (arraysEqual(displayedPosition, currentPosition)) {
            // console.log("match kar gaya ab chhod do");
            dispatch({ type: 'SET_POSITION', payload: undefined });
        }
    }, [displayedPosition])

    function arraysEqual(arr1, arr2) {
        if ((arr1 && arr1.length) !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {
                if (!arraysEqual(arr1[i], arr2[i])) return false;

            } else if (arr1[i] !== arr2[i]) { return false; }
        }
        return true;
    }


    const updateCastlingState = ({ piece, file, rank }) => {
       
        const direction = getCastlingDirections({
            castleDirection: appState.castleDirection,
            piece,
            file,
            rank
        });
        if (direction) {
            // console.log(direction,"hhhhhhhhhhhhhhhhhhhh",appState.castleDirection);
            socket.emit("castling",{ roomId: RoomId, playerId: userId,playerColour:piece[0],castlingDirection:direction})
            // dispatch(updateCastling(direction,appState.turn));
        }
    };

    const openPromotionBox = ({ rank, file, x, y,a,b }) => {
        dispatch(openPromotion({
            rank: Number(rank),
            file: Number(file),
            x,
            y,
            a,
            b,
        }));
    };

    const calculateCoords = (e) => {
        const { top, left, width } = ref.current.getBoundingClientRect();
        const size = width / 10;

        const y = Math.floor((e.clientX - left) / size);
        const x = 9 - Math.floor((e.clientY - top) / size);
        return { x, y };

    };

    const handleMove = ({ piece, rank, file, x, y, a, b }) => {
        const opponent = piece.startsWith('b') ? 'w' : 'b'
        const castleDirection = appState.castleDirection[`${piece.startsWith('b') ? 'white' : 'black'}`]

        if ((piece === 'wp' && x === 9) || (piece === 'bp' && x === 9)) {
            openPromotionBox({ rank, file, x, y });
            return;
        }

        if (piece.endsWith('r') || piece.endsWith('k')) {
            // console.log("update castling");
            updateCastlingState({ piece, file, rank })
        }
        const newPosition = arbiter.performMove({
            position: currentPosition,
            piece, rank, file,
            x, y
        })
        const isInCheck = (arbiter.isPlayerInCheck({
            positionAfterMove: newPosition,
            player: opponent,
            playerId
        }))
        const isInCheckmate = (arbiter.isCheckMate(newPosition, opponent, castleDirection, playerId))
        const newMove = getNewMoveNotation({
            piece,
            rank,
            file,
            x,
            y,
            a,
            b,
            position: currentPosition,
            isPlayerInCheck: isInCheck,
            isplayerIncheckMate: isInCheckmate,
        })


        socket.emit('boardUpdate', { roomId: RoomId, playerId: userId, boardData: { newPosition }, move: newMove });
        // console.log(newPosition,newMove,"new position");
        if (arbiter.insufficientMaterial(newPosition)) {
            // console.log("its calles detect");
            socket.emit("DrawStatus", { roomId: RoomId, DrawStatus: true })
            // dispatch(detectInsufficientMaterial())

        }
        else if (arbiter.isStalemate(newPosition, opponent, castleDirection, playerId)) {
            // console.log("stalemee called");
            socket.emit("DrawStatus", { roomId: RoomId, DrawStatus: true })
            // dispatch(detectStalemate())

        }
        else if (arbiter.isCheckMate(newPosition, opponent, castleDirection, playerId)) {
            // alert("checkmate ho gaya")
            socket.emit("CheckMate", { roomId: RoomId, playerId: userId });
            // dispatch(detectCheckmate(piece[0]))
        }
        dispatch(clearCandidates())
    };

    const onDrop = (e) => {
        e.preventDefault();
        const { x, y } = calculateCoords(e);
        const [piece, rank, file] = e.dataTransfer.getData("text").split(',');

        const { top, left, width } = ref.current.getBoundingClientRect();
        const size = width / 10;
        let b = Math.floor((e.clientX - left) / size);
        let a = 9 - Math.floor((e.clientY - top) / size);
        if (playerId === userId) {
            // console.log("--------------matched indexing change-------------");
            a = 9 - a;
            //   b=9-b

        }

        // console.log(a,b,x,y,"------------------------------------------------");
        if (appState.candidateMoves.find(m => m[0] === x && m[1] === y)) {
            // audio.play();
            handleMove({ piece, rank, file, x, y, a, b });
        }
    };

    const onDragOver = (e) => e.preventDefault();

    const handleMovePieces = (e) => {
        e.preventDefault();
        const { x, y } = calculateCoords(e)
        // const [piece,rank,file] = childValue;
        const piece = appState.piecePosition?.piece
        const rank = appState.piecePosition?.rank
        const file = appState.piecePosition?.file
        // console.log(childValue);

        const { top, left, width } = ref.current.getBoundingClientRect();
        const size = width / 10;
        let b = Math.floor((e.clientX - left) / size);
        let a = 9 - Math.floor((e.clientY - top) / size);
        if (playerId === userId) {
            // console.log("--------------matched indexing change-------------");
            a = 9 - a;
            //   b=9-b

        }

        if (appState.candidateMoves.find(m => m[0] === x && m[1] === y)) {
            // audio.play();
            // console.log("kkkkkkkk",piece);
            const opponent = piece.startsWith('b') ? 'w' : 'b'
            const castleDirection = appState.castleDirection[`${piece.startsWith('b') ? 'white' : 'black'}`]

            if ((piece === 'wp' && x === 9) || (piece === 'bp' && x === 9)) {
                openPromotionBox({ rank, file, x, y,a,b });
                return;
            }

            if (piece.endsWith('r') || piece.endsWith('k')) {
                // console.log("update castling");
                updateCastlingState({ piece, file, rank })
            }
            const newPosition = arbiter.performMove({
                position: currentPosition,
                piece, rank, file,
                x, y
            })
            const isInCheck = (arbiter.isPlayerInCheck({
                positionAfterMove: newPosition,
                player: opponent,
                playerId
            }))
            const isInCheckmate = (arbiter.isCheckMate(newPosition, opponent, castleDirection, playerId))
            const newMove = getNewMoveNotation({
                piece,
                rank,
                file,
                x,
                y,
                a,
                b,
                position: currentPosition,
                isPlayerInCheck: isInCheck,
                isplayerIncheckMate: isInCheckmate,
            })


            socket.emit('boardUpdate', { roomId: RoomId, playerId: userId, boardData: { newPosition }, move: newMove });
            // console.log(newPosition,newMove,"new position");
            if (arbiter.insufficientMaterial(newPosition)) {
                // console.log("its calles detect");
                socket.emit("DrawStatus", { roomId: RoomId, DrawStatus: true })
                // dispatch(detectInsufficientMaterial())

            }
            else if (arbiter.isStalemate(newPosition, opponent, castleDirection, playerId)) {
                // console.log("stalemee called");
                socket.emit("DrawStatus", { roomId: RoomId, DrawStatus: true })
                // dispatch(detectStalemate())

            }
            else if (arbiter.isCheckMate(newPosition, opponent, castleDirection, playerId)) {
                // alert("checkmate ho gaya")
                socket.emit("CheckMate", { roomId: RoomId, playerId: userId });
                // dispatch(detectCheckmate(piece[0]))
            }
            dispatch(clearCandidates())
        }
    }
    // console.log(displayedPosition,"hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh--------------");
    // console.log("index datahhhhhhhhhj----", displayedPosition, position, arraysEqual(displayedPosition, position));

    // console.log(arraysEqual(displayedPosition,position),displayedPosition,position,"hhjjjjjjjjjjjjjjjjjjk");
    return (
        <div
            className='pieces'
            ref={ref}
            onDrop={onDrop}
            onClick={handleMovePieces}
            onDragOver={onDragOver}
        >
            {(displayedPosition || currentPosition).map((r, rank) =>
                r.map((f, file) =>
                    (displayedPosition || currentPosition)[rank][file] ? (
                        <Piece
                            key={`${rank}-${file}`}
                            rank={rank}
                            file={file}
                            piece={(displayedPosition || currentPosition)[rank][file]}
                        />
                    ) : null
                )
            )}
        </div>
    );
};

export default Pieces;
