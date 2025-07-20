import React, { useEffect, useState } from 'react';
import arbiter from '../../arbiter/arbiter';
import { useAppContext } from '../../../../contexts/Context';
import { PiecePosition, generateCandidates } from '../../../../reducer/actions/move';
import Bbishop from '../../../../assets/ducpices/BLACK/bb.png';
import Bking from '../../../../assets/ducpices/BLACK/bk2.png';
import Bknight from '../../../../assets/ducpices/BLACK/bn.png';
import Bpawn from '../../../../assets/ducpices/BLACK/bp2.png';
import Bqueen from '../../../../assets/ducpices/BLACK/bq2.png';
import Brook from '../../../../assets/ducpices/BLACK/br2.png';
import Bmisile from '../../../../assets/ducpices/BLACK/bm.png';
import Wbishop from '../../../../assets/ducpices/WHITE/wb.png';
import Wking from '../../../../assets/ducpices/WHITE/wk2.png';
import Wknight from '../../../../assets/ducpices/WHITE/wn.png';
import Wpawn from '../../../../assets/ducpices/WHITE/wp2.png';
import Wqueen from '../../../../assets/ducpices/WHITE/wq2.png';
import Wrook from '../../../../assets/ducpices/WHITE/wr2.png';
import Wmisile from '../../../../assets/ducpices/WHITE/wm.png';
import { InitialPosition, Playerturn, UserDetail } from '../../Utils/getLocalStorageData';
import '../../../../globalInit';
import socket from '../../socket';
// import { detectCheckmate } from '../../reducer/actions/game';

const pieceImages = {
    bp: Bpawn, br: Brook, bn: Bknight, bb: Bbishop, bq: Bqueen, bk: Bking, bm: Bmisile,
    wp: Wpawn, wr: Wrook, wn: Wknight, wb: Wbishop, wq: Wqueen, wk: Wking, wm: Wmisile,
};

const Piece = ({ rank, file, piece }) => {

    const { appState, dispatch } = useAppContext();
    const { turn, castleDirection, position: currentPosition } = appState;
    const userDetail = UserDetail();
    const userId = userDetail?._id;
    const playernextTurn = appState.Color
    const playernextId = appState.PlayerNextId
    const [win, setWin] = useState(false)
    const [LeaveRoom, setLeaveRoom] = useState(false);
    const displayedPosition = appState.currentDisplayedPosition
    const [gameAborted, setGameAborted] = useState(false);
    const [DrawStatus,setDrawStatus]=useState()
    const playerId=appState?.PlayerId
// console.log(playerId,"ggggggggggggggggplayerId");
    useEffect(() => {


        socket.on('playerWon', data => {
            // console.log(data, "playerWon pieces");
            setWin(true)
        });
        socket.on('abort', data => {
            // console.log("Game aborted pieces",data);
            setGameAborted(true);
        });
        socket.on('roomLeftPlayerId', data=>{
            // console.log("player left pieces",data);
            setLeaveRoom(true)
        });
        socket.on('DrawStatus', data => {
            // console.log("Draw status",data);
            setDrawStatus(data?.DrawStatus)
        });

        return () => {
            socket.off('playerWon',);
            socket.off('abort',);
            socket.off('roomLeftPlayerId',);
            socket.off('DrawStatus',);
        };
    },);

    // console.log(turn,"turn");
    const onDragStart = e => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", `${piece},${rank},${file}`);
        setTimeout(() => {
            e.target.style.display = 'none';
        }, 0);
         
        // console.log(playernextTurn ,turn,"yyytttttttttttttt");
        if (!displayedPosition && !DrawStatus && !LeaveRoom && !gameAborted && !win && playernextTurn === piece[0] && userId === playernextId && playernextTurn === turn) {
            const candidateMoves = arbiter.getValidMoves({
                position: currentPosition[currentPosition.length - 1],
                prevPosition: currentPosition[currentPosition.length - 2],
                castleDirection: castleDirection[turn],
                piece,
                file,
                rank,
                playerId
            });
            dispatch(generateCandidates({ candidateMoves, piece, file, rank }));
            dispatch(PiecePosition(piece, file, rank))
        }
    };

    const onDragEnd = e => {
        e.target.style.display = 'block';
    };

    // console.log(prevPosition,"prev position");
    const onClickPiece = e => {
        // console.log(turn,"turn insideside--------------------------");
        // console.log(playernextTurn, turn, playernextId, userId, displayedPosition,"ttttttttttttt");
        if (!displayedPosition && !DrawStatus && !LeaveRoom && !gameAborted && !win && playernextTurn === piece[0] && userId === playernextId && playernextTurn === turn )  {
            const candidateMoves = arbiter.getValidMoves({
                position: currentPosition[currentPosition.length - 1],
                prevPosition: currentPosition[currentPosition.length - 2],
                castleDirection: castleDirection[turn],
                piece,
                file,
                rank,
                playerId
            });
            dispatch(generateCandidates({ candidateMoves, piece, file, rank }));
            dispatch(PiecePosition(piece, file, rank))
        }
    };

    return (
        <div
            className={`piece flex justify-center p-[1px] L-${file}${rank} transition-transform duration-300`}
            draggable={true}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onClick={onClickPiece}
        >
            {
                <img src={pieceImages?.[piece]} alt="" className='' />
            }
        </div>
    );
};

export default Piece;
