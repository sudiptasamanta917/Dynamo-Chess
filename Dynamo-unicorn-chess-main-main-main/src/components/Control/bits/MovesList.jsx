import React, { useState } from "react";
import { useAppContext } from "../../../contexts/Context";
import "./MovesList.css";
import {
  clearCandidates,
  CurrentIndex,
  CurrentmovelistIndex,
} from "../../../pages/AnalysisBoard/reducer/actions/move";

const MovesList = () => {
  const {
    appState: { movesList, currentIndex, movelistIndex },
    dispatch,
    appState,
  } = useAppContext();
  let dot = false;
  const handleMoveClick = (index) => {
    dispatch({ type: "SET_POSITION", payload: appState.position[index + 1] });
    dispatch(CurrentIndex(index + 1));
  };
  const handleMoveClick1 = (index) => {
    if (dot) {
      dispatch(CurrentIndex(index + 1));
    } else dispatch(CurrentIndex(index + 1));

    dispatch(clearCandidates());
  };

  let overallIndex = 0;

  const getTotalLength = (arr) => {
    let totalLength = 0;
    arr.forEach((item) => {
      if (Array.isArray(item)) {
        // item.map(subitem=>{
        //     if(subitem==='...')
        //         totalLength += getTotalLength(item);
        //     else{

        //     }
        // })
        totalLength += getTotalLength(item);
      } else if (typeof item === "string") {
        totalLength++; // Count each string as 1
      }
    });
    return totalLength;
  };

  const totalLength = getTotalLength(movesList);
  let index = false;
  return (
    <div className="text-green-600 grid grid-cols-2 overflow-auto moves-list1">
      {movesList?.map((move, i) => {
        if (Array.isArray(move)) {
          index = true;
          return (
            <div key={i} className="col-span-2 grid grid-cols-2 px-10">
              {move.map((submove, j) => {
                let combinedIndex = i + j;
                // console.log(i, "gffffffffffffffffffff");
                let indexing = overallIndex++;
                let className =
                  currentIndex === indexing + 1
                    ? "bg-green-500 text-white"
                    : "";

                if (submove === "...") {
                  dot = true;
                  return (
                    <div
                      key={`${i}-${j}`}
                      data-number={Math.floor(combinedIndex / 2) + 1}
                      className={`move-item text-xs text-white`}
                    >
                      {`${submove}`}
                    </div>
                  );
                }

                return (
                  <div
                    key={`${i}-${j}`}
                    data-number={Math.floor(combinedIndex / 2) + 1}
                    onClick={() => handleMoveClick1(indexing)}
                    className={`move-item cursor-pointer text-xs text-red-50 ${className}`}
                  >
                    {`${submove}`}
                  </div>
                );
              })}
            </div>
          );
        } else {
          const moveIndex = overallIndex++;
          let className =
            moveIndex === totalLength - 1
              ? "bg-blue-500 text-white"
              : currentIndex === moveIndex + 1
              ? "bg-green-500 text-white"
              : "";

          return (
            <div
              key={`${moveIndex} ${i}`}
              data-number={(index = Math.floor(i / 2) + 1)}
              onClick={() => handleMoveClick(moveIndex, i)}
              className={`move-item cursor-pointer ${className}`}
            >
              {`${move}`}
            </div>
          );
        }
      })}
    </div>
  );
};

export default MovesList;
