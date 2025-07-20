import './Board.css'
import { useAppContext } from '../../../../contexts/Context'

import Ranks from './bits/Ranks'
import Files from './bits/Files'
import Pieces from '../Pieces/Pieces'
import PromotionBox from '../Popup/PromotionBox/PromotionBox'
import Popup from '../Popup/Popup'
import GameEnds from '../Popup/GameEnds/GameEnds'

import arbiter from '../../arbiter/arbiter'
import { getKingPosition } from '../../arbiter/getMoves'

import topbordergreen from '../../../../assets/topGreen.png'
import bottombordergreen from '../../../../assets/bottomgreen.png'
import topborderyellow from '../../../../assets/topyellow.png'
import bottomborderyellow from '../../../../assets/bottomyellow.png'
import socket from '../../socket'
import { useEffect, useState } from 'react'
import { UserDetail } from '../../Utils/getLocalStorageData'
import { useSelector } from 'react-redux'
import { UpdateBoard } from '../../../../reducer/actions/game'

const Board = () => {
    const gamenavigationData = useSelector((state) => state.gamenavigation.data);
    const ranks = Array(10).fill().map((x, i) => 10 - i)
    const files = Array(10).fill().map((x, i) => i + 1)
    const [playernextTurn, setPlayerNextTurn] = useState("");
    const userDetail = UserDetail();
    // const RoomId = localStorage.getItem("RoomId");
    const userId = userDetail?._id;
   

    useEffect(() => {
        const handleNextPlayerTurn = (data) => {
            setPlayerNextTurn(data.playerColour);
        };

        socket.on('nextPlayerTurn', handleNextPlayerTurn);
    

        return () => {
            socket.off('nextPlayerTurn', handleNextPlayerTurn);
         
        };
    },);

    const { appState } = useAppContext();
    const playerId=appState.PlayerId
    const position = appState.position[appState.position.length - 1]
    const prevPosition = appState.position[appState.position.length - 2]
    function findChangedPosition(prevArray, currentArray) {
        let changes = [];

        for (let i = 0; i < prevArray.length; i++) {
            for (let j = 0; j < prevArray[i].length; j++) {
                if (prevArray[i][j] !== currentArray[i][j]) {
                    if (prevArray[i][j] !== '') {
                        changes.push({
                            piece: prevArray[i][j],
                            from: [i, j]
                        });
                    }
                    if (currentArray[i][j] !== '') {
                        changes.push({
                            piece: currentArray[i][j],
                            to: [i, j]
                        });
                    }
                }
            }
        }

        return changes;
    }


    let toi1, toj1, fromi1, fromj1;
let toi2, toj2, fromi2, fromj2;

if (prevPosition) {
    const positions = findChangedPosition(prevPosition, position);
    if (positions.length > 0) {
        const frequency = {};
        positions.forEach(item => {
            if (!frequency[item.piece]) {
                frequency[item.piece] = 0;
            }
            frequency[item.piece]++;
        });

        const result = {};
        positions.forEach(item => {
            if (frequency[item.piece] > 1) {
                if (!result[item.piece]) {
                    result[item.piece] = { from: [], to: [] };
                }
                if (item.from) {
                    result[item.piece].from.push(item.from);
                }
                if (item.to) {
                    result[item.piece].to.push(item.to);
                }
            }
        });

        let array1 = [];
        let array2 = [];
        for (let piece in result) {
            let combined = { piece: piece, from: result[piece].from, to: result[piece].to };
            if (array1.length === 0) {
                array1.push(combined);
            } else {
                array2.push(combined);
            }
        }

        const fromPosition1 = array1[0]?.from[0];
        const toPosition1 = array1[0]?.to[0];
        const fromPosition2 = array2[0]?.from[0];
        const toPosition2 = array2[0]?.to[0];

        if (toPosition1) {
            toi1 = toPosition1[0];
            toj1 = toPosition1[1];
        }
        if (toPosition2) {
            toi2 = toPosition2[0];
            toj2 = toPosition2[1];
        }
        if (fromPosition1) {
            fromi1 = fromPosition1[0];
            fromj1 = fromPosition1[1];
        }
        if (fromPosition2) {
            fromi2 = fromPosition2[0];
            fromj2 = fromPosition2[1];
        }
    }
    // console.log(fromi1, fromj1, toi1, toj1, fromi2, fromj2, toi2, toj2, "gggggggggggggg");
}



    const checkTile = (() => {
        const isInCheck = (arbiter.isPlayerInCheck({
            positionAfterMove: position,
            player: playernextTurn || appState.turn,
            playerId
        }))


        if (isInCheck)
            return getKingPosition(position, playernextTurn || appState.turn)

        return null
    })()

    const getClassName = (i, j) => {
        let c = 'tile';
        if(userId===playerId){

            c += (i + j) % 2 === 0 ? ' tile--light ' : ' tile--dark ';
        }
        else{

            c += (i + j) % 2 === 0 ? ' tile--dark ' : ' tile--light ';
        }
        // c += (i + j) % 2 === 0 ? ' tile--dark ' : ' tile--light ';


        const move = appState.candidateMoves?.find(m => m[0] === i && m[1] === j);
        const Navigation = gamenavigationData
        // console.log(appState,"jjjjjjjj");


        if (Navigation) {
            if (move) {
                if (position[i][j]) {
                    c += ' attacking';
                }
                else {
                    c += ' highlight';
                }
            }

        }
        // console.log(checkTile,"ttttttttttttmcccccccccccc");
        if (checkTile && checkTile[0] === i && checkTile[1] === j) {
            c += ' checked';
        }
        return c;
    };


    return (


        <div className="border-[35px] relative border-[#57b3be]">
            {userId===playerId ?  <Ranks ranks={files} />: <Ranks ranks={ranks} />}
            {/* <Ranks ranks={ranks} /> */}
            <div className="border-4 border-black">
                <div className="border-[28px] border-[#f9f0cd] relative ">
                    <img src={topbordergreen} alt="" className="absolute h-6 w-6 z-40 left-[-28px] top-[-28px]" />
                    <img src={topborderyellow} alt="" className="absolute h-6 w-6 z-40 right-[-28px] top-[-28px]" />
                    <img src={bottombordergreen} alt="" className="absolute h-6 w-6 z-40 right-[-28px] bottom-[-28px]" />
                    <img src={bottomborderyellow} alt="" className="absolute h-6 w-6 z-40 left-[-28px] bottom-[-28px]" />
                    <div className='Board'>


                        <div className='tiles ' >
                            {ranks.map((rank, i) =>
                                files.map((file, j) =>
                                    <div
                                        key={file + '' + rank}
                                        i={i}
                                        j={j}
                                        className={`${getClassName(9 - i, j)} ${(i == 9 - fromi1 && j == fromj1 || i==9-fromi2 && j==fromj2) && 'bg-[#0c73d3] bg-opacity-80 '} ${(i == 9 - toi1 && j == toj1 || i==9-toi2 && j==toj2) && 'bg-[#0c73d3] bg-opacity-80'}`}
                                    >
                                    
                                    </div>
                                )
                            )}
                        </div>




                        <Pieces />

                        <Popup>
                            <PromotionBox />
                            <GameEnds />
                        </Popup>



                    </div>

                </div>

            </div>
            
                { <Files files={files} />}
            
            {/* <Files files={files} /> */}

        </div>

    )

}

export default Board