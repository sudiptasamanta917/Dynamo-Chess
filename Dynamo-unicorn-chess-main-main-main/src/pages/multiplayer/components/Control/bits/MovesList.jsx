import { useEffect, useState } from 'react';
import { useAppContext } from '../../../../../contexts/Context';
import socket from '../../../socket';
import './MovesList.css';
import { CurrentIndex } from '../../../../../reducer/actions/move';
import captureSound from "../../../../../assets/sound/capture.mp3";
// import captureSound from "../../../../../assets";
import pieceSound from "../../../../../assets/sound/move.mp3";
const pieceS = new Audio(pieceSound);
const captureS = new Audio(captureSound);
// const sound=localStorage.getItem("Sound")
const MovesList = ({Sound}) => {
    const { appState, dispatch } = useAppContext();
    const [moveList, setMoveList] = useState([]);
    const [win, setWin] = useState(false)
    const [LeaveRoom, setLeaveRoom] = useState(false);
    const [gameAborted, setGameAborted] = useState(false);
    const UserDetail = JSON.parse(localStorage.getItem("User Detail"));
    const userId = UserDetail?._id;
    const currentIndex=appState?.currentIndex

    
//  console.log("index in sound",Sound);
   useEffect(() => {
    const handleMoveList = (data) => {
        if (data && data.length > 0 && data[data.length - 1]) {
            const str = data[data.length - 1].split('');
            const result = str.includes('x');
            const castling = str.includes('O');

            if (result && Sound) {
                captureS.play().then(() => console.log("Sound Playing Capture"));
            }
            if ((!result || castling) && Sound) {
                pieceS.play().then(() => console.log("Sound Playing piece"));
            }

            setMoveList(data);
            dispatch(CurrentIndex(data.length));
        }
    };

    socket.on("moveList", handleMoveList);
    return () => {
        socket.off("moveList", handleMoveList);
    };
}, [Sound]);


      // leave and win game listener call
  useEffect(() => {
    socket.on('playerWon', data => {
        // console.log(data, "playerWon multiplayer");
        setWin(true)
    });
    socket.on('abort', data => {
        // console.log("Game aborted multiplayer",data);
        setGameAborted(true);
    });
    socket.on('roomLeftPlayerId', data=>{
        // console.log("player left multiplayer",data);
        setLeaveRoom(true)
    }
    );

    return () => {
        socket.off('playerWon',);
        socket.off('abort',);
        socket.off('roomLeftPlayerId',);
    };
},);

    const RoomId = localStorage.getItem('RoomId');

    // console.log(currentIndex, "current index appstate");
    // const handleMoveClick = (index) => {
    //     if(!win && !gameAborted && !LeaveRoom){
    //         console.log(index,currentIndex, "clicked movelist");
    //         socket.emit('getBoardDate', { roomId: RoomId, indexNumber: index+1 ,playerId:userId });
    //         dispatch(CurrentIndex(index+1))
    //     }
      
    // };

    const handleMoveClick = (index) => {
        // console.log(index,"€€€€€€€€€",appState.position);
        dispatch({ type: 'SET_POSITION', payload: appState.position[index+1] });
        dispatch(CurrentIndex(index+1))
    };

    return (
        <div className='moves-list'>
            {moveList?.map((move, i) => {
                let className = '';
                if (i === moveList.length-1) {
                    className = 'bg-blue-500 text-white'; // Last move is always blue
                } 
                // else if (selectedIndex === i) {
                //     className = 'bg-green-500 text-white'; // Current selected move is green
                // }
                 else if (currentIndex === i+1) {
                    className = 'bg-green-500 text-white'; // Current selected move is green
                }
                return (
                    <div
                        key={i}
                        data-number={Math.floor(i / 2) + 1}
                        onClick={() => handleMoveClick(i)}
                        className={`move-item cursor-pointer ${className}`}
                    >
                        {move}
                    </div>
                );
            })}
        </div>
    );
};

export default MovesList;
