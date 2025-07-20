import "./chess8by8.css";
import Board from "../../components/Board/Board";
import { reducer } from "../../reducer/reducer";
import { useReducer } from "react";
import { initGameState } from "../puzzle/constants";
import AppContext from "../../contexts/Context";
import Control from "../../components/Control/Control";
import MovesList from "../../components/Control/bits/MovesList";

import { GiBulletBill } from "react-icons/gi";
import { BsDot } from "react-icons/bs";
import { GoDot, GoDotFill } from "react-icons/go";
import { GrChapterNext, GrChapterPrevious } from "react-icons/gr";
import { MdSkipPrevious } from "react-icons/md";
import { RxTrackNext } from "react-icons/rx";
import { IoMenu } from "react-icons/io5";


import { clearCandidates, takeBack } from "../../reducer/actions/move";

function Puzzle() {
  // console.log(initGameState,"ccccccccccccccccc");
  const [appState, dispatch] = useReducer(reducer, initGameState);

  const providerState = {
    appState,
    dispatch,
  };
  const HandleTackBack = () => {
    dispatch(takeBack())
    dispatch(clearCandidates())
  }
  return (
    <AppContext.Provider value={providerState}>
      <div className="grid grid-cols-4 mt-3 max-lg:grid-cols-1 max-md:grid-cols-1 overscroll-contain   ">
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
            <p className="flex gap-1 text-gray-50 leading-none mt-2">
              <div className="flex items-center">
                <GoDotFill className="text-xl" />
              </div>
              Anonymous
            </p>
            <p className="flex gap-1 text-gray-50">
              <div className="flex items-center">
                <GoDot className="text-xl" />
              </div>
              Anonymous
            </p>
            <p className="bg-gray-600 py-[.5px] my-2"></p>
            <p className="text-center text-gray-50">Game aborted</p>
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
        <div className="col-span-2 overscroll-contain   max-md:col-span-1 relative flex justify-center items-center  max-md:my-10  ">
          {/* timer */}
          <span className="text-gray-50 text-5xl absolute -top-12 left-0 z-30  rounded-b-none md:hidden    bg-gray-800  font-bold px-4 rounded-md">
            10:00
          </span>
          <Board />
          {/* timer */}
          <span className="text-gray-50 text-5xl absolute -bottom-12 right-0  rounded-t-none md:hidden    bg-gray-800  font-bold px-4 rounded-md">
            10:00
          </span>
        </div>

        {/* right bar control */}
        <div className="col-span-1  max-md:my-2 max-lg:hidden">
          <div className="flex items-center h-full ">
            <div className=" w-full me-5 max-md:mx-2 ">
              {/* timer */}
              {/* <span className="text-gray-50 text-5xl rounded-b-none  bg-gray-800  font-bold px-4 rounded-md">
                01:00
              </span> */}

              <div className="bg-gray-800 mt-2 w-full   rounded-r-md">
                {/* heading */}
                <div className="flex  text-gray-50 p-2">
                  <div className="flex items-center">
                    <GoDot className="text-xl " />
                  </div>
                  Anonymous
                </div>
                <div className="flex gap-9 border-b border-gray-500 justify-end text-gray-50 bg-gray-950 p-1">
                  <GrChapterPrevious onClick={HandleTackBack} />
                  <MdSkipPrevious />
                  <GrChapterNext />
                  <RxTrackNext />
                  <IoMenu />
                </div>
                {/* chess control */}
                <div>
                  <Control>
                    <MovesList />
                    {/* <TakeBack /> */}
                  </Control>
                </div>
                {/* second heading */}
                <div className="flex  text-gray-400 p-2 mb-2.5">
                  <div className="flex items-center">
                    <GoDotFill className="text-xl text-green-400 " />
                  </div>
                  Anonymous
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

export default Puzzle;
