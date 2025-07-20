import React from 'react';
import { useAppContext } from '../../../contexts/Context';
import './MovesList.css';
import { clearCandidates, CurrentIndex, CurrentmovelistIndex } from '../../../reducer/actions/move';

const MovesList = () => {
    const { appState: { movesList, currentIndex, movelistIndex }, dispatch,appState } = useAppContext();

    const handleMoveClick = (index) => {
        // console.log(index,"€€€€€€€€€",appState.position);
        dispatch({ type: 'SET_POSITION', payload: appState.position[index+1] });
        dispatch(CurrentIndex(index+1))
    };

    const handleMoveClick1 = (index) => {
        dispatch(CurrentIndex(index + 1));
        dispatch(clearCandidates());
    };

    let overallIndex = 0;

    const getTotalLength = (arr) => {
        let totalLength = 0;
        arr.forEach(item => {
            if (Array.isArray(item)) {
                totalLength += getTotalLength(item);
            } else if (typeof item === 'string') {
                totalLength++; // Count each string as 1
            }
        });
        return totalLength;
    };

    const totalLength = getTotalLength(movesList);
    // console.log(currentIndex,"currentIndex");
    

    return (
        <div className='text-green-600 grid grid-cols-2 overflow-auto moves-list1'>
            {movesList?.map((move, i) => {
                if (Array.isArray(move)) {
                    return (
                        <div key={i} className='col-span-2 grid grid-cols-2 px-10'>
                            {
                                move.map((submove, j) => {
                                    const combinedIndex = overallIndex++;
                                    let className = currentIndex === combinedIndex + 1 ? 'bg-green-500 text-white' : '';
                                    return (
                                        <div
                                            key={`${i}-${j}`}
                                            data-number={Math.floor(combinedIndex / 2)+1}
                                            onClick={() => handleMoveClick1(combinedIndex)}
                                            className={`move-item cursor-pointer text-xs text-red-50 ${className}`}
                                        >
                                            {`${submove}`}
                                        </div>
                                    );
                                })
                            }

                        </div>
                    );
                } else {
                    const moveIndex = overallIndex++;
                    let className = moveIndex === totalLength - 1 ? 'bg-blue-500 text-white'
                        : currentIndex === moveIndex + 1 ? 'bg-green-500 text-white'
                            : '';

                    return (
                        <div
                            key={`${moveIndex} ${i}`}
                            data-number={Math.floor(moveIndex / 2) + 1}
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
