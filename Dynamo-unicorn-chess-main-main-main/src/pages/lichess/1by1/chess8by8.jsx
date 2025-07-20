// import "./chess8by8.css";
import Board from "../../../components/Board/Board";
import { reducer } from "../../../pages/AnalysisBoard/reducer/reducer";
import { useEffect, useReducer, useRef, useState } from "react";
import { initGameState } from "../../../constants";
import AppContext from "../../../contexts/Context";
import Control from "../../../components/Control/Control";
import MovesList from "../../../components/Control/bits/MovesList";

import { GiBulletBill } from "react-icons/gi";
import { BsDot } from "react-icons/bs";
import { GoDot, GoDotFill } from "react-icons/go";
import { GrChapterNext, GrChapterPrevious } from "react-icons/gr";
import { MdSkipPrevious } from "react-icons/md";
import { RxTrackNext, RxTrackPrevious } from "react-icons/rx";
import { IoMenu } from "react-icons/io5";


import { CurrentIndex, clearCandidates, forwardMove, takeBack } from "../../../pages/AnalysisBoard/reducer/actions/move";
import { updateCastling } from "../../../pages/AnalysisBoard/reducer/actions/game";

function Chess8by8() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }, [])
  const [appState, dispatch] = useReducer(reducer, initGameState);
  const [isSound, setIsSound] = useState(true)
  const [isNavigation, setIsNavigation] = useState(true)
  const handleSoundChange = () => {
    setIsSound(!isSound)
  }
  const handleNavigationChange = () => {
    setIsNavigation(!isNavigation)
  }
  const providerState = {
    appState,
    dispatch,
  };
  const movelist = appState.movesList
  // console.log(appState.undoneMoves, "hhhhhhhh");
  // console.log(appState.position,"ioooooooooooo");
  function checkLastElementForString(array) {
    // Check if the array is empty
    if (array.length === 0) {
      return false;
    }

    // Get the last element of the array
    let lastElement = array[array.length - 1];

    // console.log(lastElement,"rrrrrrrrrrrr");

    // Check if 'o-o' is in the last element
    if (lastElement.includes('O')) {
      return true;
    } else {
      return false;
    }
  }

  let result;
  if (movelist && movelist.length) {
    result = checkLastElementForString(movelist);
    // console.log(result, "Checking if the last element contains 'o-o'");
  }



  function getTotalLength(arr) {
    let totalLength = 0;

    arr.forEach(item => {
        if (Array.isArray(item)) {
            totalLength += getTotalLength(item); // Recursively calculate length for subarrays
        } else if (typeof item === 'string') {
            totalLength += item.length-1; // Add length of individual strings
        }
    });

    return totalLength;
}
let currentIndex = appState?.currentIndex
const totalLength = getTotalLength(movelist);
  // const handleTakeBack = () => {
  //   if (currentIndex > 0) {
  //     currentIndex-=1
  //     const newIndex=currentIndex
  //     dispatch(CurrentIndex(currentIndex));
  //     // console.log(currentIndex,"yyyyy");
  //     // dispatch(takeBack())
  //     dispatch({ type: 'SET_POSITION', payload: appState.position[newIndex] });
  //     dispatch(clearCandidates());
  //     // socket.emit('getBoardDate', { roomId: RoomId, indexNumber: newIndex, playerId: userId })

  //   }
  // };
  // const handleTakeForward = () => {
  //   // console.log(moveList.length,"moveList.length");
  //   if (currentIndex < totalLength) {
  //     currentIndex+=1;
  //     const newIndex=currentIndex
  //     dispatch(CurrentIndex(currentIndex));
  //     // dispatch(forwardMove())
  //     dispatch({ type: 'SET_POSITION', payload: appState.position[newIndex] });
  //     dispatch(clearCandidates());

  //   }
  // };
  // const handleCurrentIndex = () => {
  //   // console.log(moveList.length,"moveList.length");
  //   dispatch(CurrentIndex(totalLength));
  //   dispatch({ type: 'SET_POSITION', payload: appState.position[movelist.length] });
  //   dispatch(clearCandidates());
  //   // socket.emit('getBoardDate', { roomId: RoomId, indexNumber: moveList.length, playerId: userId });

  // };
  // const handleStartIndex = () => {
  //   dispatch(CurrentIndex(0));
  //   dispatch({ type: 'SET_POSITION', payload: appState.position[0] });
  //   dispatch(clearCandidates());
  //   // socket.emit('getBoardDate', { roomId: RoomId, indexNumber: 0, playerId: userId });

  //   // setCurrentIndex(-1);
  //   // socket.emit('getBoardDate', { roomId: RoomId, indexNumber: currentIndex+1 ,playerId:userId });
  // };

  const handleTakeBack = () => {
    if (currentIndex > 0 ) {
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
    if (currentIndex < movelist.length ) {
      const newIndex = currentIndex + 1;
      dispatch(CurrentIndex(currentIndex + 1));
      // dispatch(forwardMove())
      dispatch({ type: 'SET_POSITION', payload: appState.position[newIndex] });
      dispatch(clearCandidates());
      
    }
  };
  const handleCurrentIndex = () => {
    // console.log(moveList.length,"moveList.length");
    dispatch(CurrentIndex(movelist.length));
    dispatch({ type: 'SET_POSITION', payload: appState.position[movelist.length] });
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

  const scrollableDivRef = useRef(null);
  useEffect(() => {

      if (scrollableDivRef.current) {
        scrollableDivRef.current.scrollTop= scrollableDivRef.current.scrollHeight;
      }

    // Use a timeout to ensure the DOM updates are complete
  }, [movelist.length]);

  localStorage.setItem("Sound", isSound)
  localStorage.setItem("Navigation", isNavigation)
  return (
    <AppContext.Provider value={providerState}>
      <div className="grid grid-cols-4 my-3 max-lg:grid-cols-1 max-md:grid-cols-1 overscroll-contain  ">
        {/* LEFT SIDEBAR */}
        <div className="col-span-1 max-md:my-2 max-md:hidden">
          {/* game status room */}
          <div className="bg-gray-900 ms-8 max-md:mx-1 rounded-md p-3">
            <div className="flex  gap-3">
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
                <p className="text-xs">1 hour ago</p>
              </div>
            </div>
            <p className="flex justify-between text-gray-50 leading-none mt-2">
              <p>Sound </p>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultValue="" checked={isSound}
                  onChange={handleSoundChange} className="sr-only peer" />
                <div className={`relative w-7 h-4 bg-red-600 peer-focus:outline-none   dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-white peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-black  after:border after:rounded-full after:h-3 after:w-3 after:transition-all  peer-checked:bg-lime-500	`}>

                </div>

              </label>
            </p>
            <p className="flex justify-between text-gray-50 leading-none mt-2">
              <p>Navigation </p>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultValue="" checked={isNavigation}
                  onChange={handleNavigationChange} className="sr-only peer" />
                <div className={`relative w-7 h-4 bg-red-600 peer-focus:outline-none   dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-white peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-black  after:border after:rounded-full after:h-3 after:w-3 after:transition-all  peer-checked:bg-lime-500	`}>

                </div>

              </label>
            </p>
            <p className="bg-gray-600 py-[.5px] my-2"></p>
            {/* <p className="text-center text-gray-50">Game aborted</p> */}
          </div>

          {/* chat room */}
          <div className="bg-gray-900 ms-8 max-md:mx-1 rounded-md p-3 h-[400px] mt-4">
            <div className="flex justify-between text-gray-50">
              <p className="text-sm">Chat room</p>
              <div className="flex items-center">
                <p className="p-1.5  bg-green-800 rounded-sm border border-gray-600"></p>
              </div>
            </div>
          </div>
        </div>
        
        {/* middle bar chess board */}
        <div className="col-span-2 p-1 flex justify-center    max-md:col-span-1  ">
          {/* timer */}
          {/* <span className="text-gray-50 text-5xl absolute -top-12 left-0 z-30  rounded-b-none md:hidden    bg-gray-800  font-bold px-4 rounded-md">
            10:00
          </span> */}
          <Board />
          {/* timer */}
          {/* <span className="text-gray-50 text-5xl absolute -bottom-12 right-0  rounded-t-none md:hidden    bg-gray-800  font-bold px-4 rounded-md">
            10:00
          </span> */}
        </div>

        {/* right bar control */}
        <div className="col-span-1   ">
          <div className="flex h-full ">
            <div className=" w-full md:me-5 ">

              <div className="bg-gray-800 md:hidden  max-md:mt-1  p-3">
                <div className="flex  gap-3">
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
                    <p className="text-xs">1 hour ago</p>
                  </div>
                </div>
                <p className="flex justify-between text-gray-50 leading-none mt-2">
                  <p>Sound </p>
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultValue="" checked={isSound}
                      onChange={handleSoundChange} className="sr-only peer" />
                    <div className={`relative w-7 h-4 bg-red-600 peer-focus:outline-none   dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-white peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-black  after:border after:rounded-full after:h-3 after:w-3 after:transition-all  peer-checked:bg-lime-500	`}>

                    </div>

                  </label>
                </p>
                <p className="flex justify-between text-gray-50 leading-none mt-2">
                  <p>Navigation </p>
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultValue="" checked={isNavigation}
                      onChange={handleNavigationChange} className="sr-only peer" />
                    <div className={`relative w-7 h-4 bg-red-600 peer-focus:outline-none   dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-white peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-black  after:border after:rounded-full after:h-3 after:w-3 after:transition-all  peer-checked:bg-lime-500	`}>

                    </div>

                  </label>
                </p>
                <p className="bg-gray-600 py-[.5px] my-2"></p>
                {/* <p className="text-center text-gray-50">Game aborted</p> */}
              </div>
              <div className="bg-gray-800  w-full mt-2 md:mt-0   rounded-r-md">
                {/* heading */}
                <div className="flex  text-gray-50 p-2">
                  <div className="flex items-center">
                    <GoDotFill className={` text-xl ${appState.turn === 'b' ? "text-green-400" : ""} `} />
                  </div>
                  Black Turn
                </div>
                <div className="flex gap-9 border-b border-gray-500 justify-center text-gray-50 bg-gray-950 p-1">
                <GrChapterPrevious className={`text-gray-50`} onClick={handleStartIndex} />
                  <RxTrackPrevious onClick={handleTakeBack} className={`  ${currentIndex > 0 ? 'text-gray-50 cursor-pointer' : 'cursor-not-allowed text-gray-600'}`} />
                  <RxTrackNext onClick={handleTakeForward} className={` ${currentIndex < totalLength ? 'text-gray-50 cursor-pointer' : ' cursor-not-allowed text-gray-600'}`} />
                  <GrChapterNext className={`text-gray-50`} onClick={handleCurrentIndex} />
                  {/* <IoMenu /> */}
                </div>
                {/* chess control */}
                <div className="h-60 overflow-y-auto min-h-60" ref={scrollableDivRef}>
                  
                    <MovesList />
                    {/* <TakeBack /> */}
                </div>
                {/* second heading */}
                <div className="flex  text-gray-400 p-2 mb-2.5">
                  <div className="flex items-center">
                    <GoDotFill className={` text-xl ${appState.turn === 'w' ? "text-green-400" : ""} `} />
                  </div>
                  White Turn
                </div>

              </div>

              {/* timer */}
              {/* <span className="text-gray-50 text-5xl  rounded-t-none     bg-gray-800  font-bold px-4 rounded-md">
                01:00
              </span> */}
            </div>
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default Chess8by8;
