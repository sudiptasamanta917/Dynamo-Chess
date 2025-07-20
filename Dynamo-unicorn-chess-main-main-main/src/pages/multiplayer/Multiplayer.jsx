// import "./chess8by8.css";
import Board from "./components/Board/Board";
import { reducer } from "../.././reducer/reducer";
import { useEffect, useReducer, useRef, useState } from "react";
import { initGameState } from "./constants";
import AppContext from "../.././contexts/Context";
import Control from "./components/Control/Control";
import MovesList from "./components/Control/bits/MovesList";

import { GiBulletBill } from "react-icons/gi";
import { BsDot } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import { GrChapterNext, GrChapterPrevious } from "react-icons/gr";
import { RxTrackNext, RxTrackPrevious } from "react-icons/rx";
import { FaXmark } from "react-icons/fa6";
import { FaFlag } from "react-icons/fa";
import onehalficon from '../../assets/onehalfIcon2.png';

import { CurrentIndex, OnlinePosition, PlayerTurn, clearCandidates, makeNewMove, takeBack } from "../.././reducer/actions/move";
import '../../globalInit';
import socket from "./socket";
import { setPlayerId, UpdateBoard, updateCastling } from "../../reducer/actions/game";
import { useNavigate, useNavigation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { GameStatus, setNavigation, TournamentStatus } from "../../redux/action";
// import { RiArrowGoBackFill } from "react-icons/ri";
import { IoArrowUndoSharp } from "react-icons/io5";
import { MdSpaceDashboard } from "react-icons/md";
// sounds import
import TimelossMp3 from '../../assets/sound/sort3.mp3'
import { toastInfo } from "../../utils/notifyCustom";
import winMp3 from '../../assets/sound/win2.mp3'
import drawMp3 from '../../assets/sound/draw.mp3'
import LoseMp3 from '../../assets/sound/lose.mp3'
import sentMp3 from '../../assets/sound/notification.mp3'
import { getApiWithToken } from "../../utils/api";
import { useQuery } from "react-query";

const winsound = new Audio(winMp3)
const DrawSound = new Audio(drawMp3)
const LoseSound = new Audio(LoseMp3)
const Timesound = new Audio(TimelossMp3)
const Sentsound = new Audio(sentMp3)

const convertSecondsToMinutes = (totalSeconds) => {
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  // Ensuring two digits for seconds
  let formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${minutes}:${formattedSeconds}`;
};
function Multiplayer() {
  const { roomId, time } = useParams();
  const [appState, dispatch] = useReducer(reducer, initGameState);
  const [RoomId, setRoomId] = useState();
  const [startGame, setStartGame] = useState(false);
  const [timer1, setTimer1] = useState();
  const [timer2, setTimer2] = useState();
  const [isSound, setIsSound] = useState(true);
  const [isNavigation, setIsNavigation] = useState(true);
  // const [positions, setPositions] = useState([]);
  const [gameAborted, setGameAborted] = useState(false);
  const [LeaveRoom, setLeaveRoom] = useState(false);
  const [leave, setLeave] = useState(false);
  const [Players, setPlayers] = useState([]);
  const [playernextTurn, setPlayerNextTurn] = useState("");
  const [playernextId, setPlayerNextId] = useState("");
  const [win, setWin] = useState()
  const [Draw, setDraw] = useState()
  const [DrawStatus, setDrawStatus] = useState()
  const [Threefold, setThreefold] = useState();
  const [tackback, setTackback] = useState();
  const [moveList, setMoveList] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [threefoldStatus, setThreefoldStatus] = useState();
  const [fivefoldStatus, setFivefoldStatus] = useState();
  const [rematchResponse, setRematchResponse] = useState();
  const [timerIs60, settimerIs60] = useState();
  const [newGame, setnewGame] = useState(false)
  const [rematch, setRematch] = useState()
  const [joinStatus, setJoinStatus] = useState(false)
  const UserDetail = JSON.parse(localStorage.getItem("User Detail"));
  const userId = UserDetail?._id;
  const playerId = appState.PlayerId
  const url = window.location.href;

  // console.log(PlayerRating,"fggggggggggggplayerrating");
  const gameStatus = useSelector((state) => state?.gameData?.GameStatus) || null;
  const providerState = {
    appState,
    dispatch,
  };
  // let { time } = useParams();
  // console.log(appState, "appState");
  const dispatche = useDispatch();
  const gamenavigationData = useSelector((state) => state.gamenavigation.data);
  // const gamenavigationData = useSelector((state) => state.gamesound.data);
  // console.log(gamenavigationData,"gggg");
  // setIsNavigation(gamenavigationData)
  const navigate = useNavigate();
  const currentIndex = appState?.currentIndex

  const [updateTime1, setupdatetime1] = useState();
  const [updateTime2, setupdatetime2] = useState();

  // const handleTakeBack = () => {
  //   if (currentIndex > 0 && !gameAborted && !win) {
  //     const newIndex = currentIndex - 1;
  //     dispatch(CurrentIndex(currentIndex - 1));
  //     socket.emit('getBoardDate', { roomId: RoomId, indexNumber: newIndex, playerId: userId })

  //   }
  // };
  // const handleTakeForward = () => {
  //   // console.log(moveList.length,"moveList.length");
  //   if (currentIndex < moveList.length && !gameAborted && !win) {
  //     const newIndex = currentIndex + 1;
  //     dispatch(CurrentIndex(currentIndex + 1));
  //     socket.emit('getBoardDate', { roomId: RoomId, indexNumber: newIndex, playerId: userId })
  //   }
  // };
  // const handleCurrentIndex = () => {
  //   // console.log(moveList.length,"moveList.length");
  //   dispatch(CurrentIndex(moveList.length));
  //   socket.emit('getBoardDate', { roomId: RoomId, indexNumber: moveList.length, playerId: userId });

  // };
  // const handleStartIndex = () => {
  //   dispatch(CurrentIndex(0));
  //   socket.emit('getBoardDate', { roomId: RoomId, indexNumber: 0, playerId: userId });

  //   // setCurrentIndex(-1);
  //   // socket.emit('getBoardDate', { roomId: RoomId, indexNumber: currentIndex+1 ,playerId:userId });
  // };

  const handleTakeBack = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      dispatch(CurrentIndex(currentIndex - 1));
      // dispatch(takeBack())
      dispatch({ type: 'SET_POSITION', payload: appState.position[newIndex] });
      dispatch(clearCandidates());

      // socket.emit('getBoardDate', { roomId: RoomId, indexNumber: newIndex, playerId: userId })

    }
  };
  const handleTakeForward = () => {
    // console.log(moveList.length,"moveList.length");
    if (currentIndex < moveList.length) {
      const newIndex = currentIndex + 1;
      dispatch(CurrentIndex(currentIndex + 1));
      // dispatch(forwardMove())
      dispatch({ type: 'SET_POSITION', payload: appState.position[newIndex] });
      dispatch(clearCandidates());

    }
  };
  const handleCurrentIndex = () => {
    // console.log(moveList.length,"moveList.length");
    dispatch(CurrentIndex(moveList.length));
    dispatch({ type: 'SET_POSITION', payload: appState.position[moveList.length] });
    dispatch(clearCandidates());
    // socket.emit('getBoardDate', { roomId: RoomId, indexNumber: moveList.length, playerId: userId });

  };
  const handleStartIndex = () => {
    dispatch(CurrentIndex(0));
    dispatch({ type: 'SET_POSITION', payload: appState.position[0] });
    dispatch(clearCandidates());
    // socket.emit('getBoardDate', { roomId: RoomId, indexNumber: 0, playerId: userId });

    // setCurrentIndex(-1);
    // socket.emit('getBoardDate', { roomId: RoomId, indexNumber: currentIndex+1 ,playerId:userId });
  };

  const handleSoundChange = () => {
    setIsSound(!isSound);
    localStorage.setItem("Sound", !isSound);
  };

  const handleNavigationChange = () => {
    dispatche(setNavigation(!gamenavigationData));
  };


  useEffect(() => {
    const userColour = localStorage.getItem('userColour')
    if (UserDetail._id && UserDetail.name && UserDetail.dynamoCoin && !joinStatus) {
      // console.log("..........>");

      const tournament = url.includes("tournament:");
      const uniqueID = tournament && url.split("tournament:")[1].split('/')[0];
      // console.log(uniqueID);
      if (UserDetail.dynamoCoin > 200) {
        if (roomId == "randomMultiplayer" && !tournament) {
          // console.log("randomMultiplayer");
          const joinRoom = {
            "playerId": UserDetail._id,
            "name": UserDetail.name,
            "coin": 200,
            "profileImageUrl": "null",
            "playerStatus": "Good",
            "joinId": roomId,
            "timer": time,
            "countryicon": UserDetail.countryIcon
          };
          // console.log(joinRoom, "random");
          socket.emit('joinRoom', joinRoom);
        }
        else if (roomId == "randomMultiplayer" || tournament) {
          // console.log("tournament-------------++++++++++---", userColour);
          const joinRoom = {
            "playerId": UserDetail._id,
            "name": UserDetail.name,
            "coin": 200,
            "profileImageUrl": "null",
            "playerStatus": "Good",
            "joinId": uniqueID,
            "timer": time,
            "countryicon": UserDetail.countryIcon,
            "colour": userColour,
          };
          socket.emit('joinRoomViaTournament', joinRoom);
        }
        else {
          // console.log("joinRoomById");
          const joinRoomById = {
            "playerId": UserDetail._id,
            "name": UserDetail.name,
            "coin": 200,
            "profileImageUrl": "null",
            "playerStatus": "Good",
            "joinId": roomId,
            "timer": time,
            "countryicon": UserDetail?.countryIcon
          };
          socket.emit('joinById', joinRoomById);
        }
      } else {
        toastInfo("Minimum point 2000 is not available")
        navigate('/')
      }
    }
  }, [UserDetail._id, UserDetail.name, roomId, joinStatus]);

  // board data listener called
  useEffect(() => {
    const handleReceiveBoardData = (data) => {
      console.log(data, "Recieve updated board data");
      const newPosition = data?.data?.newPosition
      let playerId = data?.playerId
      dispatch({ type: 'SET_POSITION', payload: undefined });
      setLeave(false)
      setRematch(false)
      setDraw(false)
      setTackback(false)
      if (data?.data?.newPosition) {
        // setPositions(prevPositions => [...prevPositions, data.newPosition]);
        // dispatch(OnlinePosition(data.newPosition))

        // console.log("updated board dispatch ho gayahhhhhh",newPosition);
        if (playerId === userId) {
          dispatch(makeNewMove({ newPosition }));
          dispatch(clearCandidates())
          // console.log("updated board dispatch ho gaya",newPosition);

        }
      }
    };

    const handleCreatePosition = (data) => {
      // const newPositions = [data.createPosition];
      // console.log("Create positions", data);
      // const newPosition2=data?.createPosition

      const newPosition = data?.positions?.[0]?.createPosition2
      localStorage.removeItem("PlayerId");
      localStorage.setItem("PlayerId", data?.positions?.[0]?.playerId)
      dispatch(setPlayerId(data?.positions?.[0]?.playerId))
      dispatch({ type: 'SET_POSITION', payload: undefined });
      setLeave(false)
      setRematch(false)
      setDraw(false)
      setTackback(false)
      if (data?.positions?.[0]?.playerId === userId) {
        // console.log(data?.positions?.[0]?.playerId,"ggggggggggggg");
        // localStorage.setItem("PlayerId",data?.positions?.[0]?.playerId)
        // console.log(localStorage.getItem("PlayerId"),"hhhhhrrrrrrrrrrrrr");
        dispatch(UpdateBoard([newPosition]));
        dispatch(clearCandidates())
        // console.log("dispatch new positions reverse");
      }

      // else{
      //   console.log("dispatch else part",newPosition2);
      //   dispatch(makeNewMove({newPosition2}));
      //   dispatch(clearCandidates())
      // }
    };
    const handleMoveList = (data) => {
      // console.log("moveList", data);
      setMoveList(data);
    };

    socket.on('createPosition', handleCreatePosition);
    socket.on('receive_boardData', handleReceiveBoardData);
    socket.on('updatedRoom', data => {
      console.log("updated room", data);
      setRoomId(data?._id);
      setPlayers(data?.players);
      localStorage.setItem("RoomId", data?._id);
      const newMoveList = data?.moveList;
      const newPosition = data?.allBoardData.map(item => item.newPosition);
      const nextPlayerColor = data?.nextPlayerColor
      setupdatetime1(convertSecondsToMinutes(data?.timer1))
      setupdatetime2(convertSecondsToMinutes(data?.timer2))
      // console.log(updateTime1,updateTime2,"puyt");

      // && url.includes("tournament:") 
      setLeave(false)
      setRematch(false)
      setDraw(false)
      setTackback(false)

      if (newPosition.length > 0) {
        const player1 = data?.players[0]; // Player 1
        const player2 = data?.players[1]; // Player 2

        // Function to check if the player matches the userId
        const isCurrentUser = (player) => player?.playerId === userId;

        // Check if Player 1 is black
        if (player1?.colour === 'b') {
          if (isCurrentUser(player1)) {
            // Player 1 (Black) making the move
            const reversePosition = newPosition.map(item => item.slice().reverse());
            // console.log("Black player making the move (Player 1)");
            dispatch(setPlayerId(player1.playerId));
            dispatch(UpdateBoard(reversePosition, newMoveList, nextPlayerColor));
          } else if (isCurrentUser(player2) && player2?.colour === 'w') {
            // Player 2 (White) making the move
            // console.log("White player making the move (Player 2)");
            dispatch(UpdateBoard(newPosition, newMoveList, nextPlayerColor));
          }
        } else {
          // If Player 1 is white
          if (isCurrentUser(player1)) {
            // Player 1 (White) making the move
            // console.log(" else White player making the move (Player 1)");
            dispatch(UpdateBoard(newPosition, newMoveList, nextPlayerColor));
          } else if (isCurrentUser(player2) && player2?.colour === 'b') {
            // Player 2 (Black) making the move
            const reversePosition = newPosition.map(item => item.slice().reverse());
            // console.log("else Black player making the move (Player 2)");
            dispatch(setPlayerId(player2.playerId));
            dispatch(UpdateBoard(reversePosition, newMoveList, nextPlayerColor));
          }
        }
      }
      // else if (newPosition.length > 1) {
      //   if (data?.players[0].colour === 'w' && data?.players[0].playerId === userId) {
      //     // console.log("White",);
      //     dispatch(UpdateBoard(newPosition, newMoveList, nextPlayerColor));
      //   }
      //   else {
      //     const reversePosition = newPosition?.map(item => item.slice().reverse())
      //     // console.log("black");
      //     dispatch(setPlayerId(data?.players?.[1]?.playerId))
      //     dispatch(UpdateBoard(reversePosition, newMoveList, nextPlayerColor));
      //   }
      // }

      dispatch(clearCandidates())
    });
    socket.on('startGame', data => {
      // console.log(data, "start game");
      setStartGame(data?.start);
    });
    socket.on('timer1', setTimer1);
    socket.on('timer2', setTimer2);
    socket.on('nextPlayerTurn', data => {
      // console.log("next player turn call get data", data);
      setPlayerNextTurn(data.playerColour);
      setPlayerNextId(data.playerId);
      dispatch(PlayerTurn(data.playerId, data.playerColour))
    });
    socket.on('DrawMessage', data => {
      // console.log("Draw message", data);
      setDraw(data?.message)
    });

    socket.on('boardAtIndex', data => {
      // setDisplayPosition(data?.newPosition)
      // console.log("index data", data);
      dispatch({ type: 'SET_POSITION', payload: data?.newPosition });
      dispatch(clearCandidates())

    });
    // socket.on('reJoinRoomData', data => {
    //   // setDisplayPosition(data?.newPosition)
    //   console.log("reJoinRoomData", data);
    //   const newMoveList = data?.moveList;
    //   const newPosition = data?.allBoardData.map(item => item.newPosition);
    //   const nextPlayerColor = data?.nextPlayerColor
    //   // console.log("analysisBoard", data);

    //   if (newPosition.length>1) {
    //     if (data?.players[0].colour === 'w' && data?.players[0].playerId === userId) {
    //       // console.log("White",);
    //       dispatch(UpdateBoard(newPosition, newMoveList, nextPlayerColor));
    //     }
    //     else {
    //       const reversePosition = newPosition?.map(item => item.slice().reverse())
    //       // console.log("black");
    //       dispatch(setPlayerId(data?.players?.[1]?.playerId))
    //       dispatch(UpdateBoard(reversePosition, newMoveList, nextPlayerColor));

    //     }


    //   }
    //   dispatch(clearCandidates())

    // });
    socket.on("moveList", handleMoveList);

    return () => {
      socket.off('createPosition', handleCreatePosition);
      socket.off('receive_boardData', handleReceiveBoardData);
      socket.off('updatedRoom');
      socket.off('startGame');
      socket.off('timer1', setTimer1);
      socket.off('timer2', setTimer2);
      socket.off('nextPlayerTurn');
      socket.off('DrawMessage');

      socket.off('boardAtIndex');
      socket.off("moveList", handleMoveList);
    };
  }, []);

  // start room called
  // useEffect(() => {
  //   if (startGame && RoomId && !joinStatus) {
  //     // if(time){
  //     //   socket.emit('start', { roomId: RoomId, timer:time*60});
  //     // }
  //     // else{
  //     //   socket.emit('start', { roomId: RoomId, timer:300});
  //     // }
  //     socket.emit('start', { roomId: RoomId });
  //     console.log("start romm calld");


  //   }
  // }, [startGame, RoomId, joinStatus]);
  // end start room called


  // leave and win game listener call
  useEffect(() => {

    socket.on('playerWon', data => {
      // console.log(data, "playerWon multiplayer");
      setWin(data)
      dispatche(GameStatus(true))
      dispatche(TournamentStatus(true))
      // dispatch(updateCastling("both",'w'));
      // dispatch(updateCastling("both",'b'));
    });
    socket.on('abort', data => {
      // console.log("Game aborted multiplayer", data);
      setGameAborted(true);
      dispatche(GameStatus(true))
      dispatche(TournamentStatus(true))
      // dispatch(updateCastling("both",'w'));
      // dispatch(updateCastling("both",'b'));
    });
    socket.on('checkMate', data => {
      // console.log("Check mate multiplayer", data);
      // setGameAborted(true);
      dispatche(GameStatus(true))
      dispatche(TournamentStatus(true))
      // dispatch(updateCastling("both",'w'));
      // dispatch(updateCastling("both",'b'));
    });
    socket.on('roomLeftPlayerId', data => {
      // console.log("player left multiplayer", data);
      setLeaveRoom(true)
      dispatche(GameStatus(true))
      dispatche(TournamentStatus(true))
      // dispatch(updateCastling("both",'w'));
      // dispatch(updateCastling("both",'b'));
    });
    socket.on('DrawStatus', data => {
      // console.log("Draw status multiplayere", data);
      setDrawStatus(data?.DrawStatus)
      dispatche(GameStatus(true))
      dispatche(TournamentStatus(true))
      // dispatch(updateCastling("both",'w'));
      // dispatch(updateCastling("both",'b'));
    });
    socket.on('ThreeFold', data => {
      // console.log("Three Fold multiplayere", data);
      setThreefold(true)
    });

    socket.on('rematch', data => {
      // console.log("rematch=>>>>>", data);
      setRematch(data)
    });
    socket.on('JoinStatus', data => {
      // console.log("Join=>>>>>", data);
      localStorage.setItem("JoinStatus", data)
      setJoinStatus(true)
      setStartGame(true);
    });

    socket.on('rematchResponse', data => {

      if (!newGame) {
        // console.log("rematchResponse received:", data);
        const protocol = window.location.protocol;
        const host = window.location.host;
        const uniqueIdurl = `${protocol}//${host}/multiplayer/${data}/${time}`;
        // console.log("Constructed URL:", uniqueIdurl);

        try {
          setnewGame(true)
          // window.open(uniqueIdurl, '_blank');
          window.location.href = uniqueIdurl;
          // console.log("New game tab opened successfully.");
          socket.emit("leaveRoom", { roomId: RoomId, playerId: UserDetail._id });
        } catch (error) {
          console.error("Error opening new game tab:", error);
        }

        // Prevent further updates
      }
    });



    socket.on('turnBack', data => {
      // console.log("tackback multiplayere", data);
      Sentsound.play()
      setTackback(data)
    });

    socket.on('threefoldStatus', data => {
      // console.log("threefoldStatus multiplayere", data);
      setThreefoldStatus(true)
      dispatche(GameStatus(true))
    });
    socket.on('fiveFoldData', (data) => {
      try {
        const tournament = url.includes("tournament:");
        let roundId = null;

        if (tournament) {
          const parts = url.split("tournament:");
          if (parts[1]) {
            const roundParts = parts[1].split(':');
            roundId = roundParts[1] || null;
          }
        }

        // console.log("fiveFoldData multiplayer", { data, roundId, RoomId });

        socket.emit("fiveFoldDraw", {
          roomId: RoomId,
          roundId: roundId,
          gameType: tournament ? 'tournament' : 'normal',
          userId
        });

        setFivefoldStatus(true);
        // Uncomment this line if `threefoldStatus` is needed later
        // setThreefoldStatus(data?.threefoldStatus);
      } catch (error) {
        console.error("Error handling fiveFoldData event:", error);
      }
    });

    socket.on('rematchResponse', data => {
      // console.log("rematchResponse multiplayere", data);
      setRematchResponse(data)
    });

    socket.on('timerIs60', data => {
      // console.log("timeris60 ", data);
      settimerIs60(data)
    });
    socket.on('receive_message', data => {
      // console.log("Chat box recieve message ", data, messages);
      const { message, playerId } = data;
      setMessages((prevMessages) => [...prevMessages, { playerId, message }]);
    });
    socket.on('castlingStatus', data => {
      // let direction = data.status == "true" ? "none" : "both";
      console.log("castling message recieve ", data,);
      // console.log(direction,"pppppppppppppp");    
      if (userId === data?.playerId) {
        dispatch(updateCastling(data.status, data?.playerColour));
      }
      // const { message, playerId } = data;
      // setMessages((prevMessages) => [...prevMessages, { playerId, message }]);
    });

    socket.on('allBoardData', data => {
      const newPosition = data.allBoardData.map(item => item.newPosition);
      // console.log(data,newPosition, "allboard databbbbbbbbbbbb");
      dispatch({ type: 'SET_POSITION', payload: undefined });
      if (newPosition.length > 1) {
        if (data?.players[0].colour === 'w' && data?.players[0].playerId === userId) {
          // console.log("White",newPosition);
          dispatch(UpdateBoard(newPosition));
          dispatch(clearCandidates())
        }
        else {
          const reversePosition = newPosition?.map(item => item.slice().reverse())
          // console.log("black",reversePosition);
          // dispatch(setPlayerId(data?.players?.[1]?.playerId))
          dispatch(UpdateBoard(reversePosition));
          dispatch(clearCandidates())
        }


      }

    });
    return () => {
      socket.off('playerWon',);
      socket.off('JoinStatus',);
      socket.off('timerIs60',);
      socket.off('abort',);
      socket.off('roomLeftPlayerId',);
      socket.off('checkMate',);
      socket.off('DrawStatus');
      socket.off('ThreeFold');
      socket.off('fiveFoldData');
      socket.off('receive_message');
      socket.off('rematchResponse');
      socket.off('rematch');
      socket.off('turnBackStatus');
      socket.off('allBoardData');
      socket.off('castingStatus');
    };
  },);

  // sound effect
  useEffect(() => {
    if (win) {
      if (win?.playerId === userId) {
        winsound.play()
      }
      else {
        LoseSound.play()
      }
    }
    if (DrawStatus) {
      DrawSound.play()
    }

    if (timerIs60 && timerIs60?.playerId === userId) {
      // console.log("timer sound play ho gya", timerIs60);
      Timesound.play()
    }
  }, [win, DrawStatus, playerId, timerIs60])





  // emit leave room
  const handleLeaveRoom = () => {
    if (appState.position.length > 1 && !gameAborted && !LeaveRoom && !win) {
      socket.emit("leaveRoom", { roomId: RoomId, playerId: UserDetail._id });
      setLeave(false);
    }
  };


  const newRoomId = localStorage.getItem("RoomId")
  // emit abort game
  const abortGame = () => {
    // console.log("id assss");
    if (url.includes("tournament:")) {
      const uniqueID = url.split("tournament:")[1].split(':')[0];
      const roundId = url.split("tournament:")[1].split(':')[1];
      if (moveList?.length < 1 && !gameAborted && !LeaveRoom && !win) {
        const newRoomId = RoomId || localStorage.getItem("RoomId")
        // console.log("+++++++++++id assss+++++++++++++++++++",uniqueID,roundId);
        socket.emit("Abort", { roomId: newRoomId, "tournamentId": uniqueID, "userId": userId, roundId: roundId });
      }
    } else if (moveList?.length < 2 && !gameAborted && !LeaveRoom && !win) {
      const newRoomId = RoomId || localStorage.getItem("RoomId")
      // console.log("-----i else assss------------------", newRoomId);
      socket.emit("Abort", { roomId: newRoomId });
    }


  };
  // console.log(positions.length,"hhhhhhhhhh");

  // new game
  const NewGame = () => {
    window.location.reload();
  }


  const requestDraw = () => {
    // console.log(moveList.length, "fgggggggggggffffffffffff");
    if (moveList.length > 1 && !url.includes("tournament:") && !gameAborted && !LeaveRoom && !win && !DrawStatus) {
      socket.emit("Draw", { roomId: RoomId, playerId: UserDetail._id })
    }
  }
  // const requestThreeFold = () => {
  //   console.log(moveList.length, "fgggggggggggffffffffffff");
  //   if (moveList.length > 1) {
  //     socket.emit("threefoldRequest", { roomId: RoomId, playerId: UserDetail._id})
  //   }
  // }
  // draw accept 
  const HandleDraw = () => {
    if (moveList.length > 1 && !url.includes("tournament:") && !gameAborted && !LeaveRoom && !win && !DrawStatus) {
      socket.emit("DrawStatus", { roomId: RoomId, DrawStatus: true })
      setDraw(false)
    }
  }
  // draw cancel
  const CancelDraw = () => {
    if (moveList.length > 1) {
      socket.emit("DrawStatus", { roomId: RoomId, DrawStatus: false })
      setDraw(false)
    }
  }

  // draw accept 
  const Handlethreefold = () => {
    const tournament = url.includes("tournament:");
    // console.log(Threefold,"Threefold");
    let roundId = null;
    if (tournament)
      roundId = url.split("tournament:")[1].split(':')[1];
    if (tournament && Threefold) {
      socket.emit("threefoldCancel", { roomId: RoomId, threefold: true, roundId: roundId, userId })

    } else if (Threefold) {
      socket.emit("threefoldCancel", { roomId: RoomId, threefold: true })

    }
  }


  const HandleRematch = () => {
    // console.log("rematch");

    socket.emit("rematch", { roomId: RoomId, playerId: UserDetail._id })
  }

  const HandleRematchAccept = () => {
    socket.emit("rematchStatus", { roomId: RoomId, rematchResponse: true })
    setRematch(false)
  }

  const CancelRematch = () => {
    socket.emit("rematchStatus", { roomId: RoomId, rematchResponse: false })
    setRematch(false)
  }
  const HandleTackback = () => {
    // console.log("turnback");
    if (moveList.length > 1 || !gameAborted || !LeaveRoom || !win || !DrawStatus) {
      socket.emit("turnBack", { roomId: RoomId, playerId: UserDetail._id })
      Sentsound.play()
    }
  }

  const HandleTackbackAccept = () => {
    if (moveList.length > 1) {
      socket.emit("turnBackStatus", { roomId: RoomId, playerId: UserDetail._id, turnBack: true })
      setTackback(false)
    }
  }

  const CancelTackback = () => {
    if (moveList.length > 1) {
      socket.emit("turnBackStatus", { roomId: RoomId, turnBack: false })
      setTackback(false)
    }
  }



  const [pageAccessedByReload, setPageAccessedByReload] = useState(false);

  // Listen for page reload or unload event
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ''; // This triggers the confirmation dialogue

      // Set flag only after the user confirms the reload
      setPageAccessedByReload(true);
    };
    if (!gameStatus) {
      // Attach the event listener for page reload or close
      window.addEventListener('beforeunload', handleBeforeUnload);
    }
    return () => {
      if (!gameStatus)
        window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [gameStatus]);

  // Handle effects for page reload scenario
  useEffect(() => {
    if (pageAccessedByReload && !gameStatus) {
      // Perform necessary actions only if the page reload was confirmed
      window.addEventListener('unload', () => {
        if (RoomId && UserDetail?._id) {
          socket.emit("leaveRoom", { roomId: RoomId, playerId: UserDetail._id });
        }
      });
    }
  }, [pageAccessedByReload, RoomId, UserDetail._id, gameStatus]);

  const isAbortDisabled = moveList?.length > 1 || gameAborted || LeaveRoom || win || DrawStatus || url.includes("tournament:");;
  const isDrawDisabled = moveList?.length < 1 || gameAborted || LeaveRoom || win || DrawStatus || url.includes("tournament:");
  const isLeaveDisabled = moveList?.length < 1 || gameAborted || LeaveRoom || win || DrawStatus;
  const IsMessageDisabled = gameAborted || LeaveRoom || win || DrawStatus
  const IspopupDisabled = gameAborted || LeaveRoom || win || DrawStatus || startGame
  const IsredirectResult = gameAborted || LeaveRoom || win || DrawStatus;
  const mobileshownotification = gameAborted || LeaveRoom || win || DrawStatus || threefoldStatus || rematch;
  // auto redirect profile page
  useEffect(() => {

    if (IsredirectResult && url.includes("tournament:")) {
      const uniqueID = url.split("tournament:")[1]?.split(':')[0];

      if (uniqueID) {
        setTimeout(() => {
          window.location.href = `/LiveTournamentDetail/${uniqueID}`
          // navigate(`/LiveTournamentDetail/${uniqueID}`)
          // dispatche(GameStatus(false))
        }, 10000); // Delay for 2 seconds before navigating
      }
    }
  }, [IsredirectResult, navigate]);


  const handleSendMessage = () => {
    if (startGame && !IsMessageDisabled && message.trim() !== '') {
      socket.emit("send_message", { roomId: RoomId, playerId: UserDetail._id, message: message })
      // SendMessage(message);
      setMessage(''); // Clear the input field after sending the message
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && startGame && !IsMessageDisabled) {
      handleSendMessage();
    }
  };


  useEffect(() => {

    window.scrollTo(0, 0); // Scrolls to the top of the page

  }, []);

  const scrollableDivRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the container whenever appState.moves changes
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight;
    }
  }, [moveList.length]);
  // const HandleAnalysis=()=>{

  // }
  // console.log(userId , win,"hhjjjjjjjjjjjjjjjjjjk=====>>>>");

  // timer sound less time






  useEffect(() => {
    let timer;
    if (!startGame && url.includes("tournament:")) {
      timer = setTimeout(() => {
        abortGame();
        // console.log("called abort game");
      }, 60000); //  1 minute
    }
    else if (!startGame) {
      timer = setTimeout(() => {
        abortGame();
        // console.log("called abort game");
      }, 1800000); //  30 min
    }

    return () => clearTimeout(timer); // Cleanup the timeout if startGame changes or component unmounts
  }, [startGame, roomId]);

  // Cleanup if component unmounts or startGame changes

  // console.log(Players && Players[1]?.countryicon, "mmmmmm", Players && Players[0]?.countryicon);

  useEffect(() => {
    const fetchData = async () => {

      try {
        if (url.includes("tournament:")) {
          const userId = UserDetail?._id;
          const [uniqueID, roundId] = url.includes("tournament:") && url.split("tournament:")[1].split(':');

          const apiUrl = `${import.meta.env.VITE_URL}/getJoinedCount/${uniqueID}/${roundId}/${userId}`;
          // console.log("API hit occurred:", apiUrl);

          const response = await getApiWithToken(apiUrl);
          // console.log(response, "Response received");
        }
      } catch (error) {
        console.log(error, "Error occurred while fetching");
      }
    };

    fetchData();
  }, [url]);

  const handleGoToDashboard = () => {
    try {
      if (!url.includes("tournament:")) {
        throw new Error("Invalid URL format");
      }

      const uniqueID = url.split("tournament:")[1]?.split(':')[0];

      if (!uniqueID) {
        throw new Error("Invalid tournament ID");
      }

      // Show a confirm dialog and navigate if the user clicks "OK"
      const confirmed = window.confirm("if you go to Dashboard you will loose the round");

      if (confirmed) {
        navigate(`/LiveTournamentDetail/${uniqueID}`);
      }
    } catch (error) {
      console.error("Failed to navigate to tournament:", error);
    }
  };

  const tournamentID = url.includes("tournament:") ? url.split("tournament:")[1].split(':')[0] : null;
  let tournamentData = {};

  if (tournamentID) {
    // console.log(tournamentID, "oooo");

    const tournamentsuUrl = `${import.meta.env.VITE_URL}${import.meta.env.VITE_GET_MY_TOURNAMENT_BY_ID}${tournamentID}`;

    const queryGetTournamentById = useQuery(
      ["GetTournamentByIdData", tournamentsuUrl],
      () => getApiWithToken(tournamentsuUrl),
    );

    // console.log(queryGetTournamentById, "iiiiii");
    tournamentData = queryGetTournamentById?.data?.data?.data || {};
  }

  // if (url.includes("tournament:")) {}

  console.log(url.includes("tournament:"), "uuuuuuuu========");



  return (
    <AppContext.Provider value={providerState}>
      <div className="grid grid-cols-4 my-3 max-lg:grid-cols-1 max-md:grid-cols-1 overscroll-contain min-h-screen">
        {/* LEFT SIDEBAR */}
        <div className="col-span-1 max-md:my-2 max-md:hidden">
          <div className="bg-gray-900 ms-8 max-md:mx-1 rounded-md p-3">
            <div className="flex gap-3">
              <div className="flex items-center text-white">
                <GiBulletBill className="text-3xl" />
              </div>
              <div className="text-gray-50">
                <p className="flex gap-1 leading-none">
                  1+1
                  <div className="flex items-center">
                    <BsDot />
                  </div>
                  Casual
                  <div className="flex items-center">
                    <BsDot />
                  </div>
                  Bullet
                </p>
                {tournamentID && (
                  <>
                    <p className="text-xs">Round Number: {tournamentData.upComingRound - 1}</p>
                    <p className="text-xs">Tournament Name: {tournamentData.tournamentName}</p>
                  </>
                )}

              </div>
            </div>
            <p className="flex justify-between text-gray-50 leading-none mt-2">
              <p>Sound</p>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={isSound}
                  onChange={handleSoundChange} className="sr-only peer" />
                <div className={`relative w-7 h-4 bg-red-600 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-white peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-black after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-lime-500`} />
              </label>
            </p>
            <p className="flex justify-between text-gray-50 leading-none mt-2">
              <p>Navigation</p>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={gamenavigationData}
                  onChange={handleNavigationChange} className="sr-only peer" />
                <div className={`relative w-7 h-4 bg-red-600 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-white peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-black after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-lime-500`} />
              </label>
            </p>
            <p className="bg-gray-600 py-[.5px] my-2"></p>
          </div>
          {/* chat room */}
          <div className="bg-gray-900 relative ms-8 max-md:mx-1 rounded-md p-3 h-[400px] mt-4 ">
            <div className="flex justify-between text-gray-50">
              <p className="text-sm">Chat room</p>
              <div className="flex items-center">
                <p className="p-1.5 bg-green-800 rounded-sm border border-gray-600"></p>
              </div>
            </div>
            <div className="h-[300px] overflow-y-auto mt-4 px-2">
              {messages.map((msg, index) => (
                <div key={index} className={msg.playerId === UserDetail._id ? 'text-end text-green-800' : 'text-start text-white'}>
                  <p className="message">{msg.message}</p>
                </div>
              ))}
            </div>


            <div className="absolute bottom-2 w-full ">
              <input
                type="text"
                className={`rounded-lg p-1 ${(!startGame || IsMessageDisabled) ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'}`}
                value={message}
                placeholder="Message here..."
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!startGame || IsMessageDisabled}
              />
              <button
                className={`text-gray-400 ms-3 px-4 py-1 rounded-lg ${(!startGame || IsMessageDisabled) ? 'cursor-not-allowed bg-gray-300' : 'bg-blue-500 text-white rounded'}`}
                onClick={handleSendMessage}
                disabled={!startGame || IsMessageDisabled}
              >
                Send
              </button>
            </div>
          </div>
        </div>
        {/* middle bar */}
        <div className="col-span-2 overscroll-contain max-md:col-span-1 relative">
          <div className="flex sm:hidden justify-center bg-gray-500">
            {
              !url.includes("tournament:") &&
              <div className="flex gap-6 px-5 py-3 rounded-sm">
                <div className="relative group">
                  {moveList.length < 2 ?
                    <>
                      <button
                        className={`hover:bg-gray-700 active:bg-green-400 rounded-sm bg-gray-500 p-2 ${isAbortDisabled && 'cursor-not-allowed hover:bg-transparent'}`}
                        onClick={() => abortGame()}
                        disabled={isAbortDisabled}
                      >
                        <FaXmark className={`text-3xl text-black  `} />
                      </button>
                      <p className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-black text-white p-1 rounded text-xs opacity-0 group-hover:opacity-100 group-hover:visible transition-opacity duration-300">Abort</p>
                    </>
                    :

                    <>
                      <button
                        className={`hover:bg-gray-700 active:bg-green-400 bg-gray-500 p-2 ${isDrawDisabled && 'cursor-not-allowed hover:bg-transparent'}`}
                        onClick={HandleTackback}
                        disabled={isDrawDisabled}
                      >
                        <IoArrowUndoSharp className={`text-3xl text-black ${isDrawDisabled && 'text-gray-700'}`} />
                      </button>
                      <p className="absolute top-[-44px] left-1/2 transform -translate-x-1/2 bg-black text-white p-1 rounded text-xs opacity-0 group-hover:opacity-100 group-hover:visible transition-opacity duration-300">Propose a tackback</p>
                    </>

                  }
                </div>
                <div className="relative group">
                  <button
                    onClick={requestDraw}
                    className={`hover:bg-gray-700 active:bg-green-400 rounded-sm relative p-2 bg-gray-500 ${isDrawDisabled && 'cursor-not-allowed hover:bg-transparent'}`}
                  // disabled={isDrawDisabled}
                  >
                    <img src={onehalficon} alt="" className="w-5 h-5" />
                    {/* {Threefold && <span className="text-red-800 text-[10px] absolute left-0">Three Fold</span>} */}
                  </button>
                  <p className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-black text-white p-1 rounded text-xs opacity-0 group-hover:opacity-100 group-hover:visible transition-opacity duration-300">Request Draw</p>
                </div>
                <div className="relative group">
                  <button
                    className={`hover:bg-gray-700 active:bg-green-400 rounded-sm p-2 bg-gray-500 ${isLeaveDisabled && 'cursor-not-allowed hover:bg-transparent'}`}
                    onClick={() => setLeave(true)}
                    disabled={isLeaveDisabled}
                  >
                    <FaFlag className={`text-2xl text-black ${isLeaveDisabled && 'text-gray-700'}`} />
                  </button>
                  <p className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-black text-white p-1 rounded text-xs opacity-0 group-hover:opacity-100 group-hover:visible transition-opacity duration-300">Resign</p>
                </div>
              </div>
            }
            {/* {url.includes("tournament:") == true ? <div className="relative group">
                          <button
                            className={`hover:bg-gray-700 active:bg-green-400 rounded-sm p-2 bg-gray-500  hover:bg-transparent`}
                            onClick={handleGoToDashboard}

                          >
                            <MdSpaceDashboard className={`text-2xl text-black`} />
                          </button>
                          <p className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-black text-white p-1 rounded text-xs opacity-0 group-hover:opacity-100 group-hover:visible transition-opacity duration-300">Go To Dashboard</p>
                        </div> : ""} */}
            <div className="flex gap-6 px-5 py-3 rounded-sm">
              <div className="relative group">
                {fivefoldStatus ?
                  <p className={`text-sm text-black p-1 `}>Five Fold</p> :
                  (Threefold && userId === playernextId) &&
                  <button
                    className={`hover:bg-gray-700 p-1 active:bg-green-400 rounded-sm bg-gray-500 `}
                    onClick={Handlethreefold}
                  // disabled={isDrawDisabled}
                  >
                    <p className={`text-sm text-black `}>Three Fold</p>
                  </button>
                }
              </div>

            </div>
          </div>
          <div className={` w-full sm:hidden bg-black my-2 ${mobileshownotification && "p-4"} `}>
            <div className={`${win ? 'visible bg-gray-400' : 'hidden'}`}>
              <p className="text-center capitalize text-black font-bold text-xl my-1"><span>{playerId === win?.playerId ? "0-1" : '1-0'}</span></p>
              <p className="text-center capitalize text-black my-1">{playerId === win?.playerId ? "Black Win" : 'White Win'}</p>
            </div>
            <div className={`${DrawStatus ? 'visible bg-gray-400' : 'hidden'}`}>
              <p className="text-center capitalize text-black font-bold text-xl my-1"><span>{"1/2-1/2"}</span></p>
              <p className="text-center capitalize text-black font-bold text-xl my-1">Draw</p>
            </div>
            {/* <div className={`${threefoldStatus ? 'visible bg-gray-400' : 'hidden'}`}>
              <p className="text-center capitalize text-black font-bold text-xl my-1"><span>{"1/2-1/2"}</span></p>
              <p className="text-center capitalize text-black font-bold text-xl my-1">Draw</p>
            </div> */}
            <p className={`text-center capitalize text-white ${gameAborted ? 'visible' : 'hidden'}`}>Game aborted</p>
            <div className={`${gameAborted || LeaveRoom || win || DrawStatus || threefoldStatus ? 'visible' : 'hidden'}`}>
              <div className="grid py-2 bg-gray-500 my-1 hover:bg-green-700 text-white">
                <button className="uppercase cursor-pointer" onClick={HandleRematch}>Rematch</button>
              </div>
              <div className="grid py-2 bg-gray-500 my-1 hover:bg-green-700 text-white" onClick={NewGame}>
                <button className="uppercase">New opponent</button>
              </div>
            </div>
            <div onClick={() => navigate(`/analysisBoard/${RoomId}`)} className={`grid py-2 bg-gray-500 my-1 hover:bg-green-700 text-white ${LeaveRoom || win || DrawStatus || threefoldStatus ? 'visible' : 'hidden'}`}>
              <button className="uppercase">Analysis Board</button>
            </div>

            <div className={`${Draw ? 'bg-gray-500 text-black visible w-full p-2' : "hidden"}`}>
              <p className="text-center">{Draw} </p>
              <div className="flex justify-end gap-3 me-5 mt-8 ">
                <button className="text-blue-700 hover:text-blue-800 active:text-green-800" onClick={HandleDraw}>Accept</button>
                <button className="hover:text-gray-700 active:text-red-800" onClick={CancelDraw}>Cancel</button>
              </div>
            </div>
            {/* Leave room confirmation */}
            <div className={`${leave ? 'bg-gray-500 text-black visible w-full p-2' : "hidden"}`}>
              <p className="text-center">Do you want to Leave Game? </p>
              <div className="flex justify-end gap-3 me-5 mt-8 ">
                <button className="text-blue-700 hover:text-blue-800 active:text-green-800" onClick={handleLeaveRoom}>Yes</button>
                <button className="hover:text-gray-700 active:text-red-800" onClick={() => setLeave(false)}>No</button>
              </div>
            </div>
            <div className={`${rematch ? 'bg-gray-500 text-black visible w-full p-2' : "hidden"}`}>
              <p className="text-center">{"Do you wanna play game"} </p>
              <div className="flex justify-end gap-3 me-5 mt-8 ">
                <button className="text-blue-700 hover:text-blue-800 active:text-green-800" onClick={HandleRematchAccept}>Accept</button>
                <button className="hover:text-gray-700 active:text-red-800" onClick={CancelRematch}>Cancel</button>
              </div>
            </div>
            <div className={`${tackback ? 'bg-gray-500 text-black visible w-full p-2 mb-1' : "hidden"}`}>
              <p className="text-center">{"Your opponent proposes a takeback"} </p>
              <div className="flex justify-end gap-3 me-5 mt-8 ">
                <button className="text-blue-700 hover:text-blue-800 active:text-green-800" onClick={HandleTackbackAccept}>Accept</button>
                <button className="hover:text-gray-700 active:text-red-800" onClick={CancelTackback}>Cancel</button>
              </div>
            </div>
          </div>
          {userId === playerId ? (
            <div className="">
              <div className="flex sm:hidden">
                <span className="text-gray-50 text-3xl flex items-center justify-start  z-30 rounded-b-none md:hidden bg-gray-800 font-bold px-4 rounded-md">
                  {timer1 || "00:00"}
                </span>
                {/* name and flag mobile view */}
                <div className="flex sm:hidden font-bold  text-black items-center justify-between px-4 py-2">
                  <div className="flex p-2 gap-1 items-center">

                    <GoDotFill className={`text-xl ${userId !== playernextId && "text-green-400"}`} />
                    <p className="truncate" >
                      {Players ? Players?.[0]?.name : "Anonymous"}
                    </p>
                    <div className="flex items-center ">
                      <p>

                        {Players && Players[0]?.countryicon == undefined ? "" : <img className="h-6 w-9 ml-4" src={Players && Players[0]?.countryicon} alt="countryIcon" />}
                      </p>
                      <p className="ms-7">

                        {Players && Players ? ` Rating: ${Players?.[0]?.Rating.toFixed(2)} ` : "0"}
                      </p>
                    </div>

                  </div>
                </div>
              </div>

              {/* board container */}
              <div className="flex justify-center items-center sm:my-2 lg:my-0">
                <Board />
                {!IspopupDisabled && (
                  <p className="py-6 px-4 absolute border border-black rounded-md bg-white text-black">
                    {url.includes("tournament:")
                      ? (
                        <>
                          Please wait for your paired opponent <br />
                          for this Round to join the board
                        </>
                      )
                      : "Please Wait for an Opponent"}
                  </p>


                )}

              </div>
              <div className="flex justify-end sm:hidden">
                {/* name and flag mobile view */}
                <div className="flex sm:hidden font-bold  text-black p-2  justify-between items-center">

                  <GoDotFill className={`text-xl ms-2 ${(userId == playernextId || playernextTurn === 'b') && 'text-green-400'}`} />
                  <p className="truncate">
                    {Players ? Players?.[1]?.name : "Anonymous"}
                  </p>
                  <div className="flex items-center">
                    <p>
                      {
                        Players && Players[1]?.countryicon == undefined ? "" :
                          <img className="h-6 w-9  ml-4" src={Players && Players[1]?.countryicon} alt="countryIcon" />
                      }

                    </p>
                    <p className="ms-7">

                      {Players && Players ? `Rating: ${Players?.[1]?.Rating.toFixed(2)}` : "0"}
                    </p>
                  </div>

                </div>
                <span className="text-gray-50 text-3xl flex justify-end items-center   rounded-t-none md:hidden bg-gray-800 font-bold px-4 rounded-md">
                  {timer2 || "00:00"}
                </span>

              </div>
            </div>
          ) : (
            <div className="my-3 md:my-0">
              <div className="flex sm:hidden">
                <span className="text-gray-50 text-3xl flex justify-start items-center  rounded-b-none md:hidden bg-gray-800 font-bold px-4 rounded-md">
                  {timer2 || "00:00"}
                </span>
                {/* name and flag mobile view */}
                <div className="flex font-bold sm:hidden text-black p-2 justify-between items-center text-sm">
                  <GoDotFill className={`text-xl ${userId !== playernextId && "text-green-400"}`} />
                  <p className="truncate">
                    {Players ? Players?.[1]?.name : "Anonymous"}
                  </p>
                  <div className="flex items-center">
                    <p>
                      {
                        Players && Players[1]?.countryicon == undefined ? "" : <img className="h-6 w-9  ml-4" src={Players && Players[1]?.countryicon} alt="countryIcon" />
                      }

                    </p>
                    <p className="ms-7">

                      {Players && Players ? `Rating: ${Players?.[1]?.Rating.toFixed(2)} ` : "0"}
                    </p>

                  </div>

                </div>
              </div>
              {/* board container */}
              <div className="flex justify-center items-center">
                <Board />
                {!IspopupDisabled && (
                  <p className="py-6 px-4 absolute border border-black rounded-md bg-white text-black">
                    {url.includes("tournament:")
                      ? (
                        <>
                          Please wait for your paired opponent <br />
                          for this Round to join the board
                        </>
                      )
                      : "Please Wait for an Opponent"}
                  </p>


                )}

              </div>
              <div className="flex justify-end sm:hidden">
                {/* name and flag mobile view */}
                <div className="flex sm:hidden font-bold  text-black text-sm p-2  justify-between items-center">
                  <GoDotFill className={`text-xl ms-2 ${(userId == playernextId || playernextTurn === 'w') && 'text-green-400'}`} />
                  <p className="truncate">
                    {Players ? Players?.[0]?.name : "Anonymous"}
                  </p>
                  <div className="flex items-center">
                    <p>
                      {
                        Players && Players[0]?.countryicon == undefined ? "" : <img className="h-6 w-9 ml-4" src={Players && Players[0]?.countryicon} alt="countryIcon" />
                      }
                    </p>
                    <p className="ms-7">
                      {Players && Players ? `Rating: ${Players?.[0]?.Rating.toFixed(2)}` : "0"}

                    </p>

                  </div>
                </div>
                <span className="text-gray-50 text-3xl flex justify-end items-center  rounded-t-none md:hidden bg-gray-800 font-bold px-4 rounded-md ">
                  {timer1 || "00:00"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* right bar */}
        <div className="col-span-1 my-3">
          <div className="flex items-center h-full">
            <div className="w-full me-5 max-md:mx-2">
              {userId === playerId ? (
                <>
                  <span className="text-gray-50 text-5xl rounded-b-none max-sm:hidden bg-gray-800 font-bold px-4 rounded-md">
                    {timer1 || updateTime1 || "00:00"}
                  </span>
                  <div className="bg-gray-800 mt-2 w-full relative rounded-r-md">
                    <div className="hidden sm:flex items-center justify-between px-4 py-2">
                      <div className="flex text-gray-50 p-2 gap-1 items-center">

                        <GoDotFill className={`text-xl ${userId !== playernextId && "text-green-400"}`} />

                        {Players ? Players?.[0]?.name : "Anonymous"}
                        {Players && Players[0]?.countryicon == undefined ? "" : <img className="h-6 w-9 ml-4" src={Players && Players[0]?.countryicon} alt="countryIcon" />}
                        {Players && Players ? ` Rating: ${Players?.[0]?.Rating.toFixed(2)} ` : "0"}
                      </div>


                    </div>


                    <div className="flex gap-9 border-b border-gray-500 justify-center  bg-gray-950 p-1">
                      <GrChapterPrevious className={`text-gray-50`} onClick={handleStartIndex} />
                      <RxTrackPrevious onClick={handleTakeBack} className={`  ${currentIndex > 0 ? 'text-gray-50 cursor-pointer' : 'cursor-not-allowed text-gray-600'}`} />
                      <RxTrackNext onClick={handleTakeForward} className={` ${currentIndex < moveList.length ? 'text-gray-50 cursor-pointer' : ' cursor-not-allowed text-gray-600'}`} />
                      <GrChapterNext className={`text-gray-50`} onClick={handleCurrentIndex} />
                    </div>
                    <div className="h-48 overflow-y-auto" ref={scrollableDivRef}>
                      <MovesList Sound={isSound} />

                    </div>
                    <div className={` w-full hidden sm:block `}>
                      <div className={`${win ? 'visible bg-gray-400' : 'hidden'}`}>
                        <p className="text-center capitalize text-black font-bold text-xl my-1"><span>{playerId === win?.playerId ? "0-1" : '1-0'}</span></p>
                        <p className="text-center capitalize text-black my-1">{playerId === win?.playerId ? "Black Win" : 'White Win'}</p>
                      </div>
                      {url.includes("tournament:") === true ? <></> : <>
                        <div className={`${DrawStatus ? 'visible bg-gray-400' : 'hidden'}`}>
                          <p className="text-center capitalize text-black font-bold text-xl my-1"><span>{"1/2-1/2"}</span></p>
                          <p className="text-center capitalize text-black font-bold text-xl my-1">Draw</p>
                        </div>
                        {/* <div className={`${threefoldStatus ? 'visible bg-gray-400' : 'hidden'}`}>
                        <p className="text-center capitalize text-black font-bold text-xl my-1"><span>{"1/2-1/2"}</span></p>
                        <p className="text-center capitalize text-black font-bold text-xl my-1">Draw</p>
                      </div> */}
                        <p className={`text-center capitalize text-white ${gameAborted ? 'visible' : 'hidden'}`}>Game aborted</p>
                        <div className={`${gameAborted || LeaveRoom || win || DrawStatus || threefoldStatus ? 'visible' : 'hidden'}`}>
                          <div className="grid py-2 bg-gray-500 my-1 hover:bg-green-700 text-white">
                            <button className="uppercase cursor-pointer" onClick={HandleRematch}>Rematch</button>
                          </div>
                          <div className="grid py-2 bg-gray-500 my-1 hover:bg-green-700 text-white" onClick={NewGame}>
                            <button className="uppercase">New opponent</button>
                          </div>
                        </div>
                        <div onClick={() => navigate(`/analysisBoard/${RoomId}`)} className={`grid py-2 bg-gray-500 my-1 hover:bg-green-700 text-white ${LeaveRoom || win || DrawStatus || threefoldStatus ? 'visible' : 'hidden'}`}>
                          <button className="uppercase">Analysis Board</button>
                        </div>

                        <div className={`${Draw ? 'bg-gray-500 text-black visible w-full p-2' : "hidden"}`}>
                          <p className="text-center">{Draw} </p>
                          <div className="flex justify-end gap-3 me-5 mt-8 ">
                            <button className="text-blue-700 hover:text-blue-800 active:text-green-800" onClick={HandleDraw}>Accept</button>
                            <button className="hover:text-gray-700 active:text-red-800" onClick={CancelDraw}>Cancel</button>
                          </div>
                        </div>
                      </>}


                      {/* Leave room confirmation */}
                      <div className={`${leave ? 'bg-gray-500 text-black visible w-full p-2' : "hidden"}`}>
                        <p className="text-center">Do you want to Leave Game? </p>
                        <div className="flex justify-end gap-3 me-5 mt-8 ">
                          <button className="text-blue-700 hover:text-blue-800 active:text-green-800" onClick={handleLeaveRoom}>Yes</button>
                          <button className="hover:text-gray-700 active:text-red-800" onClick={() => setLeave(false)}>No</button>
                        </div>
                      </div>
                      <div className={`${rematch ? 'bg-gray-500 text-black visible w-full p-2' : "hidden"}`}>
                        <p className="text-center">{"Do you wanna play game"} </p>
                        <div className="flex justify-end gap-3 me-5 mt-8 ">
                          <button className="text-blue-700 hover:text-blue-800 active:text-green-800" onClick={HandleRematchAccept}>Accept</button>
                          <button className="hover:text-gray-700 active:text-red-800" onClick={CancelRematch}>Cancel</button>
                        </div>
                      </div>
                      <div className={`${tackback ? 'bg-gray-500 text-black visible w-full p-2 mb-1' : "hidden"}`}>
                        <p className="text-center">{"Your opponent proposes a takeback"} </p>
                        <div className="flex justify-end gap-3 me-5 mt-8 ">
                          <button className="text-blue-700 hover:text-blue-800 active:text-green-800" onClick={HandleTackbackAccept}>Accept</button>
                          <button className="hover:text-gray-700 active:text-red-800" onClick={CancelTackback}>Cancel</button>
                        </div>
                      </div>
                    </div>

                    <div className="hidden sm:flex justify-center bg-gray-500">
                      {
                        !url.includes("tournament:") &&
                        <div className="flex gap-6 px-5 py-3 rounded-sm">
                          <div className="relative group">
                            {moveList.length < 2 ?
                              <>
                                <button
                                  className={`hover:bg-gray-700 active:bg-green-400 rounded-sm bg-gray-500 p-2 ${isAbortDisabled && 'cursor-not-allowed hover:bg-transparent'}`}
                                  onClick={() => abortGame()}
                                  disabled={isAbortDisabled}
                                >
                                  <FaXmark className={`text-3xl text-black  `} />
                                </button>
                                <p className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-black text-white p-1 rounded text-xs opacity-0 group-hover:opacity-100 group-hover:visible transition-opacity duration-300">Abort</p>
                              </>
                              :

                              <>
                                <button
                                  className={`hover:bg-gray-700 active:bg-green-400 bg-gray-500 p-2 ${isDrawDisabled && 'cursor-not-allowed hover:bg-transparent'}`}
                                  onClick={HandleTackback}
                                  disabled={isDrawDisabled}
                                >
                                  <IoArrowUndoSharp className={`text-3xl text-black ${isDrawDisabled && 'text-gray-700'}`} />
                                </button>
                                <p className="absolute top-[-44px] left-1/2 transform -translate-x-1/2 bg-black text-white p-1 rounded text-xs opacity-0 group-hover:opacity-100 group-hover:visible transition-opacity duration-300">Propose a tackback</p>
                              </>

                            }
                          </div>
                          <div className="relative group">
                            <button
                              onClick={requestDraw}
                              className={`hover:bg-gray-700 active:bg-green-400 rounded-sm relative p-2 bg-gray-500 ${isDrawDisabled && 'cursor-not-allowed hover:bg-transparent'}`}
                            // disabled={isDrawDisabled}
                            >
                              <img src={onehalficon} alt="" className="w-5 h-5" />
                              {/* {Threefold && <span className="text-red-800 text-[10px] absolute left-0">Three Fold</span>} */}
                            </button>
                            <p className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-black text-white p-1 rounded text-xs opacity-0 group-hover:opacity-100 group-hover:visible transition-opacity duration-300">Request Draw</p>
                          </div>
                          <div className="relative group">
                            <button
                              className={`hover:bg-gray-700 active:bg-green-400 rounded-sm p-2 bg-gray-500 ${isLeaveDisabled && 'cursor-not-allowed hover:bg-transparent'}`}
                              onClick={() => setLeave(true)}
                              disabled={isLeaveDisabled}
                            >
                              <FaFlag className={`text-2xl text-black ${isLeaveDisabled && 'text-gray-700'}`} />
                            </button>
                            <p className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-black text-white p-1 rounded text-xs opacity-0 group-hover:opacity-100 group-hover:visible transition-opacity duration-300">Resign</p>
                          </div>
                        </div>
                      }
                      {/* {url.includes("tournament:") == true ? <div className="relative group">
                          <button
                            className={`hover:bg-gray-700 active:bg-green-400 rounded-sm p-2 bg-gray-500  hover:bg-transparent`}
                            onClick={handleGoToDashboard}

                          >
                            <MdSpaceDashboard className={`text-2xl text-black`} />
                          </button>
                          <p className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-black text-white p-1 rounded text-xs opacity-0 group-hover:opacity-100 group-hover:visible transition-opacity duration-300">Go To Dashboard</p>
                        </div> : ""} */}
                      <div className="flex gap-6 px-5 py-3 rounded-sm">
                        <div className="relative group">
                          {
                            fivefoldStatus ?
                              <p className={`text-sm text-black p-1 `}>Five Fold</p> :
                              (Threefold && userId === playernextId) &&
                              <button
                                className={`hover:bg-gray-700 p-1 active:bg-green-400 rounded-sm bg-gray-500 `}
                                onClick={Handlethreefold}
                              // disabled={isDrawDisabled}
                              >
                                <p className={`text-sm text-black `}>Three Fold</p>
                              </button>
                          }
                        </div>

                      </div>
                    </div>
                    {/* players name rating */}
                    <div className=" hidden sm:flex text-gray-50 p-2 gap-1 items-center">

                      <GoDotFill className={`text-xl  ${(userId == playernextId || playernextTurn === 'b') && 'text-green-400'}`} />

                      {Players ? Players?.[1]?.name : "Anonymous"}
                      {
                        Players && Players[1]?.countryicon == undefined ? "" : <img className="h-6 w-9  ml-4" src={Players && Players[1]?.countryicon} alt="countryIcon" />
                      }
                      {Players && Players ? `Rating: ${Players?.[1]?.Rating.toFixed(2)} ` : "0"}

                    </div>
                  </div>
                  <span className="text-gray-50 text-5xl rounded-t-none max-sm:hidden bg-gray-800 font-bold px-4 rounded-md">
                    {timer2 || updateTime2 || "00:00"}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-gray-50 text-5xl rounded-b-none max-sm:hidden bg-gray-800 font-bold px-4 rounded-md">
                    {timer2 || updateTime2 || "00:00"}
                  </span>
                  <div className="bg-gray-800 mt-2 w-full relative rounded-r-md">
                    <div className=" hidden sm:flex text-gray-50 p-2 gap-1 items-center">

                      <GoDotFill className={`text-xl  ${(userId !== playernextId || playernextTurn === 'b') && 'text-green-400'}`} />

                      {Players ? Players?.[1]?.name : "Anonymous"}
                      {
                        Players && Players[1]?.countryicon == undefined ? "" : <img className="h-6 w-9  ml-4" src={Players && Players[1]?.countryicon} alt="countryIcon" />
                      }
                      {Players && Players ? `Rating: ${Players?.[1]?.Rating.toFixed(2)} ` : "0"}

                    </div>
                    <div className="flex gap-9 border-b border-gray-500 justify-center  bg-gray-950 p-1">
                      <GrChapterPrevious className={`text-gray-50`} onClick={handleStartIndex} />
                      <RxTrackPrevious onClick={handleTakeBack} className={`  ${currentIndex > 0 ? 'text-gray-50 cursor-pointer' : 'cursor-not-allowed text-gray-600'}`} />
                      <RxTrackNext onClick={handleTakeForward} className={` ${currentIndex < moveList.length ? 'text-gray-50 cursor-pointer' : ' cursor-not-allowed text-gray-600'}`} />
                      <GrChapterNext className={`text-gray-50`} onClick={handleCurrentIndex} />
                    </div>
                    <div className="h-52 overflow-y-auto min-h-52" ref={scrollableDivRef}>

                      <MovesList Sound={isSound} />

                    </div>
                    <div className={`  w-full hidden sm:block `}>
                      <div className={`${win ? 'visible bg-gray-400' : 'hidden'}`}>
                        <p className="text-center capitalize text-black font-bold text-xl my-1"><span>{playerId === win?.playerId ? "0-1" : '1-0'}</span></p>
                        <p className="text-center capitalize text-black my-1">{playerId === win?.playerId ? "Black Win" : 'White Win'}</p>
                      </div>
                      {url.includes("tournament:") === true ? <></> : <>
                        <div className={`${DrawStatus ? 'visible bg-gray-400' : 'hidden'}`}>
                          <p className="text-center capitalize text-black font-bold text-xl my-1"><span>{"1/2-1/2"}</span></p>
                          <p className="text-center capitalize text-black font-bold text-xl my-1">Draw</p>
                        </div>
                        {/* <div className={`${threefoldStatus ? 'visible bg-gray-400' : 'hidden'}`}>
                        <p className="text-center capitalize text-black font-bold text-xl my-1"><span>{"1/2-1/2"}</span></p>
                        <p className="text-center capitalize text-black font-bold text-xl my-1">Draw</p>
                      </div> */}
                        <p className={`text-center capitalize text-white ${gameAborted ? 'visible' : 'hidden'}`}>Game aborted</p>
                        <div className={`${gameAborted || LeaveRoom || win || DrawStatus || threefoldStatus ? 'visible' : 'hidden'}`}>
                          <div className="grid py-2 bg-gray-500 my-1 hover:bg-green-700 text-white">
                            <button className="uppercase cursor-pointer" onClick={HandleRematch}>Rematch</button>
                          </div>
                          <div className="grid py-2 bg-gray-500 my-1 hover:bg-green-700 text-white" onClick={NewGame}>
                            <button className="uppercase">New opponent</button>
                          </div>
                        </div>
                        <div onClick={() => navigate(`/analysisBoard/${RoomId}`)} className={`grid py-2 bg-gray-500 my-1 hover:bg-green-700 text-white ${LeaveRoom || win || DrawStatus || threefoldStatus ? 'visible' : 'hidden'}`}>
                          <button className="uppercase">Analysis Board</button>
                        </div>
                        {/* draw confirmation */}
                        <div className={`${Draw ? 'bg-gray-500 text-black visible w-full p-2' : "hidden"}`}>
                          <p className="text-center">{Draw} </p>
                          <div className="flex justify-end gap-3 me-5 mt-8 ">
                            <button className="text-blue-700 hover:text-blue-800 active:text-green-800" onClick={HandleDraw}>Accept</button>
                            <button className="hover:text-gray-700 active:text-red-800" onClick={CancelDraw}>Cancel</button>
                          </div>
                        </div>
                      </>}

                      {/* Leave room confirmation */}
                      <div className={`${leave ? 'bg-gray-500 text-black visible w-full p-2' : "hidden"}`}>
                        <p className="text-center">Do you want to Leave Game? </p>
                        <div className="flex justify-end gap-3 me-5 mt-8 ">
                          <button className="text-blue-700 hover:text-blue-800 active:text-green-800" onClick={handleLeaveRoom}>Yes</button>
                          <button className="hover:text-gray-700 active:text-red-800" onClick={() => setLeave(false)}>No</button>
                        </div>
                      </div>
                      {/* rematch confirmation */}
                      <div className={`${rematch ? 'bg-gray-500 text-black visible w-full p-2' : "hidden"}`}>
                        <p className="text-center">{"Do you wanna play game"} </p>
                        <div className="flex justify-end gap-3 me-5 mt-8 ">
                          <button className="text-blue-700 hover:text-blue-800 active:text-green-800" onClick={HandleRematchAccept}>Accept</button>
                          <button className="hover:text-gray-700 active:text-red-800" onClick={CancelRematch}>Cancel</button>
                        </div>
                      </div>
                      {/* tack back confirmation */}
                      <div className={`${tackback ? 'bg-gray-500 text-black visible w-full p-2 mb-1' : "hidden"}`}>
                        <p className="text-center">{"Your opponent proposes a takeback"} </p>
                        <div className="flex justify-end gap-3 me-5 mt-8 ">
                          <button className="text-blue-700 hover:text-blue-800 active:text-green-800" onClick={HandleTackbackAccept}>Accept</button>
                          <button className="hover:text-gray-700 active:text-red-800" onClick={CancelTackback}>Cancel</button>
                        </div>
                      </div>
                    </div>
                    <div className="hidden sm:flex justify-center bg-gray-500">
                      {
                        !url.includes("tournament:") &&
                        <div className="flex gap-6 px-5 py-3 rounded-sm">
                          <div className="relative group">
                            {moveList.length < 2 ?
                              <>
                                <button
                                  className={`hover:bg-gray-700 active:bg-green-400 rounded-sm bg-gray-500 p-2 ${isAbortDisabled && 'cursor-not-allowed hover:bg-transparent'}`}
                                  onClick={() => abortGame()}
                                  disabled={isAbortDisabled}
                                >
                                  <FaXmark className={`text-3xl text-black  `} />
                                </button>
                                <p className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-black text-white p-1 rounded text-xs opacity-0 group-hover:opacity-100 group-hover:visible transition-opacity duration-300">Abort</p>
                              </>
                              :

                              <>
                                <button
                                  className={`hover:bg-gray-700 active:bg-green-400 bg-gray-500 p-2 ${isDrawDisabled && 'cursor-not-allowed hover:bg-transparent'}`}
                                  onClick={HandleTackback}
                                  disabled={isDrawDisabled}
                                >
                                  <IoArrowUndoSharp className={`text-3xl text-black ${isDrawDisabled && 'text-gray-700'}`} />
                                </button>
                                <p className="absolute top-[-44px] left-1/2 transform -translate-x-1/2 bg-black text-white p-1 rounded text-xs opacity-0 group-hover:opacity-100 group-hover:visible transition-opacity duration-300">Propose a tackback</p>
                              </>

                            }
                          </div>
                          <div className="relative group">
                            <button
                              onClick={requestDraw}
                              className={`hover:bg-gray-700 active:bg-green-400 rounded-sm relative p-2 bg-gray-500 ${isDrawDisabled && 'cursor-not-allowed hover:bg-transparent'}`}
                            // disabled={isDrawDisabled}
                            >
                              <img src={onehalficon} alt="" className="w-5 h-5" />
                              {/* {Threefold && <span className="text-red-800 text-[10px] absolute left-0">Three Fold</span>} */}
                            </button>
                            <p className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-black text-white p-1 rounded text-xs opacity-0 group-hover:opacity-100 group-hover:visible transition-opacity duration-300">Request Draw</p>
                          </div>
                          <div className="relative group">
                            <button
                              className={`hover:bg-gray-700 active:bg-green-400 rounded-sm p-2 bg-gray-500 ${isLeaveDisabled && 'cursor-not-allowed hover:bg-transparent'}`}
                              onClick={() => setLeave(true)}
                              disabled={isLeaveDisabled}
                            >
                              <FaFlag className={`text-2xl text-black ${isLeaveDisabled && 'text-gray-700'}`} />
                            </button>
                            <p className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-black text-white p-1 rounded text-xs opacity-0 group-hover:opacity-100 group-hover:visible transition-opacity duration-300">Resign</p>
                          </div>
                        </div>
                      }
                      {/* {url.includes("tournament:") == true ? <div className="relative group">
                          <button
                            className={`hover:bg-gray-700 active:bg-green-400 rounded-sm p-2 bg-gray-500  hover:bg-transparent`}
                            onClick={handleGoToDashboard}

                          >
                            <MdSpaceDashboard className={`text-2xl text-black`} />
                          </button>
                          <p className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-black text-white p-1 rounded text-xs opacity-0 group-hover:opacity-100 group-hover:visible transition-opacity duration-300">Go To Dashboard</p>
                        </div> : ""} */}
                      <div className="flex gap-6 px-5 py-3 rounded-sm">
                        <div className="relative group">
                          {
                            fivefoldStatus ?
                              <p className={`text-sm text-black p-1 `}>Five Fold</p> :
                              (Threefold && userId === playernextId) &&
                              <button
                                className={`hover:bg-gray-700 p-1 active:bg-green-400 rounded-sm bg-gray-500 `}
                                onClick={Handlethreefold}
                              // disabled={isDrawDisabled}
                              >
                                <p className={`text-sm text-black `}>Three Fold</p>
                              </button>
                          }
                        </div>

                      </div>
                    </div>

                    <div className=" hidden sm:flex  bg-gray-500 text-gray-400 p-2 mb-2.5 gap-1 items-center">

                      <GoDotFill className={`text-xl ${(userId == playernextId || playernextTurn === 'w') && 'text-green-400'}`} />

                      {Players ? Players?.[0]?.name : "Anonymous"}

                      {
                        Players && Players[0]?.countryicon == undefined ? "" : <img className="h-6 w-9 ml-4" src={Players && Players[0]?.countryicon} alt="countryIcon" />
                      }
                      {Players && Players ? `Rating: ${Players?.[0]?.Rating.toFixed(2)}` : "0"}
                    </div>
                  </div>
                  <span className="text-gray-50 text-5xl rounded-t-none max-sm:hidden bg-gray-800 font-bold px-4 rounded-md">
                    {timer1 || updateTime1 || "00:00"}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* mobile view */}
        <div className="col-span-1 max-md:my-2 md:hidden">
          <div className="bg-gray-900 ms-8 max-md:mx-1 rounded-md p-3">
            <div className="flex gap-3">
              <div className="flex items-center text-white">
                <GiBulletBill className="text-3xl" />
              </div>
              <div className="text-gray-50">
                <p className="flex gap-1 leading-none">
                  1+1
                  <div className="flex items-center">
                    <BsDot />
                  </div>
                  Casual
                  <div className="flex items-center">
                    <BsDot />
                  </div>
                  Bullet
                </p>
                {tournamentID && (
                  <>
                    <p className="text-xs">Round Number: {tournamentData.upComingRound - 1}</p>
                    <p className="text-xs">Tournament Name: {tournamentData.tournamentName}</p>
                  </>
                )}
              </div>
            </div>
            <p className="flex justify-between text-gray-50 leading-none mt-2">
              <p>Sound</p>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={isSound}
                  onChange={handleSoundChange} className="sr-only peer" />
                <div className={`relative w-7 h-4 bg-red-600 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-white peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-black after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-lime-500`} />
              </label>
            </p>
            <p className="flex justify-between text-gray-50 leading-none mt-2">
              <p>Navigation</p>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={gamenavigationData}
                  onChange={handleNavigationChange} className="sr-only peer" />
                <div className={`relative w-7 h-4 bg-red-600 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-white peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-black after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-lime-500`} />
              </label>
            </p>
            <p className="bg-gray-600 py-[.5px] my-2"></p>
          </div>
          <div className="bg-gray-900 relative ms-8 max-md:mx-1 rounded-md p-3 h-[400px] mt-4 ">
            <div className="flex justify-between text-gray-50">
              <p className="text-sm">Chat room</p>
              <div className="flex items-center">
                <p className="p-1.5 bg-green-800 rounded-sm border border-gray-600"></p>
              </div>
            </div>
            <div className="h-[300px] overflow-y-auto mt-4 px-2">
              {messages.map((msg, index) => (
                <div key={index} className={msg.playerId === UserDetail._id ? 'text-end text-green-800' : 'text-start text-white'}>
                  <p className="message">{msg.message}</p>
                </div>
              ))}
            </div>


            <div className="absolute bottom-2 w-full ">
              <input
                type="text"
                className={`rounded-lg p-1 ${(!startGame || IsMessageDisabled) ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'}`}
                value={message}
                placeholder="Message here..."
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!startGame || IsMessageDisabled}
              />
              <button
                className={`text-gray-400 ms-3 px-4 py-1 rounded-lg ${(!startGame || IsMessageDisabled) ? 'cursor-not-allowed bg-gray-300' : 'bg-blue-500 text-white rounded'}`}
                onClick={handleSendMessage}
                disabled={!startGame || IsMessageDisabled}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default Multiplayer;
