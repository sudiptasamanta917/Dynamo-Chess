import React, { useState, useEffect, useRef } from 'react'
import { getApi } from '../utils/api';
import { useQuery } from 'react-query';
import "../styles.css"
import LoadingBar from 'react-top-loading-bar';
const Games = () => {
  const loadingBar = useRef(null);
  const [showModal, setShowModal] = useState(false);
  // const [selectedPiece, setSelectedPiece] = useState('');

  const handleOpenModal = () => {
    // setSelectedPiece(piece);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // setSelectedPiece('');
  };
  const [showModal2, setShowModal2] = useState(false);
  // const [selectedPiece, setSelectedPiece] = useState('');

  const handleOpenModal2 = () => {
    // setSelectedPiece(piece);
    setShowModal2(true);
  };

  const handleCloseModal2 = () => {
    setShowModal2(false);
    // setSelectedPiece('');
  };

  const url = `${import.meta.env.VITE_URL}${import.meta.env.VITE_GET_RULE}/getAll`;
  // console.log(url, "vvvv");
  const queryGetAllContent = useQuery("getAllContent", () => getApi(url),);

  // console.log(queryGetAllContent?.data?.data?.data);

  const startLoading = () => {
    loadingBar.current.continuousStart();
  };
  const finishLoading = () => {
    loadingBar.current.complete();
  };
  useEffect(() => {
    if (queryGetAllContent.isLoading) {
      startLoading();
    } else {
      finishLoading();
    }
  }, [queryGetAllContent.isLoading]);

  return (
    <div className=''>
      <LoadingBar color="#F11946" ref={loadingBar} />
      <Modal show={showModal} onClose={handleCloseModal}>
        <div className='max-h-[80vh] overflow-y-auto  p-4'>
          <p className='flex flex-wrap '>
            <h2 className='text-xl font-semibold '>The Castling</h2>
          </p>
          <p className='pt-1 font-normal '>
            <p className='text-base '>
              castling is a special move involving the king and one of the rooks of the same colour. It is performed as follows:
              <ul className='pl-8 pt-1'>
                <li className=' list-disc text-lg font-semibold'>
                  King's Move:<span className=' font-normal bg-lime-200 text-base '> The king moves three squares towards the rook.(Unlike king moving 2 Squares towards a Rook during castling in 64square chess)</span>
                </li>
                <li className=' list-disc py-1 text-lg font-semibold'>
                  Rook's Move: <span className=' font-normal text-base text-gray-600'>  The rook then moves to the square next to the king that the king has just crossed.</span>
                </li>

              </ul>

            </p>
            <p className='py-1'>
              <h2 className='text-xl font-semibold'>Conditions for Castling</h2>
              <ul className='pl-8 pt-1'>
                <li className=' list-disc text-lg font-semibold'>
                  No Prior Moves: <span className=' font-normal text-base text-gray-600'> Neither the king nor the chosen rook may have moved prior to castling.</span>
                </li>
                <li className=' list-disc py-1 text-lg font-semibold'>
                  No Check: <span className=' font-normal text-base text-gray-600'>  The king cannot be in check, and the squares the king moves across, including the destination square, must not be under attack.</span>
                </li>
                <li className=' list-disc py-1 text-lg font-semibold'>
                  No Pieces in Between: <span className=' font-normal text-base text-gray-600'>  All the squares between the king and the rook must be empty.</span>
                </li>

              </ul>
            </p>
            <p className='py-1'>
              <h2 className='text-xl font-semibold'>Types of Castling</h2>
              <ul className='pl-8 pt-1'>
                <li className=' list-disc text-lg font-semibold'>
                  Kingside Castling (O-O):  <span className=' font-normal text-base text-gray-600'>Castling with the rook originally on the j1 square for White or the j10 square for Black.</span>
                </li>
                <li className=' list-disc py-1 text-lg font-semibold'>
                  Queenside Castling (O-O-O): <span className=' font-normal text-base text-gray-600'>  Castling with the rook originally on the a1 square for White or the a10 square for Black.</span>
                </li>


              </ul>
            </p>
          </p>

        </div>
      </Modal>
      <Modal2 show={showModal2} onClose={handleCloseModal2}>
        <div className='max-h[80vh] overflow-y-auto p-2'>
          <h2 className='text-xl font-semibold '>En-passant </h2>
          <p>
            En passant is a special pawn move. When a player moves a pawn two or three squares forward from its starting position, and this move places the pawn beside an opponent's pawn on an adjacent file, the opponent has the right to capture the first player's pawn "en passant." The capture must be made on the very next move, and it is as if the first player's pawn had moved  one square less. The capturing pawn moves to the square the first player's pawn
            would have occupied if it had moved one square less, and the first player's pawn is removed from the board.
          </p>
        </div>
      </Modal2>
      <div className="2xl:container  2xl:mx-auto lg:py-8 lg:px-12 md:py-12 md:px-6 py-9 px-4">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          {queryGetAllContent?.data?.data?.data.map((item, index) => {
            if (item.title === "History & Preamble of Dynamo Chess") {
              return (
                <div key={index} className="w-full">

                  <div className=''>
                    <h2 className='text-3xl max-sm:text-normal px-3 text-gray-800'>
                      {item.title}:
                    </h2>
                    <p className='leading-6 px-3 pt-3 text-justify text-gray-600 custom-content ' dangerouslySetInnerHTML={{ __html: item.content }} />


                    {/* {item.images.map((image, imgIndex) => (
                  <img key={imgIndex} src={image} alt={item.title} />
                ))} */}
                  </div>
                </div>
              );
            }
            return null; // Return null for items that don't match the condition
          })}
          {/* <div className="w-full lg:w-7/12 flex flex-col px-4">
        
          {/*  */}


          {/* </div> */}

        </div>
        <div className='  px-3'>
          {queryGetAllContent?.data?.data?.data.map((item, index) => {
            if (item.title === "Introducing the Dynamo Chess Game") {
              return (
                <div key={index}>
                  <h2 className='text-2xl font-semibold py-2 text-gray-800'>{item.title}:</h2>
                  <p className='text-gray-600 text-base text-justify custom-content' dangerouslySetInnerHTML={{ __html: item.content }} />


                </div>
              );
            }
            return null;
          })}

          <h3 className="text-3xl lg:text-4xl font-bold leading-9 text-gray-800 pt-3 pb-2">
            Game Rules
          </h3>
          {queryGetAllContent?.data?.data?.data.map((item, index) => {
            if (item.title !== "Introducing the Dynamo Chess Game" 
              && item.title !== "History & Preamble of Dynamo Chess" 
              && item.title !== "En-passant" 
              && item.title !== "About Us" 
              && item.title !== "Our Story"
            && item.title !== "Indian Council For Cultural Relation"
            && item.title !== "Chess Tournaments"
            && item.title !== "Section Of Tournaments"
          ) {
              return (
                <div key={index}>
                  <p className='flex flex-wrap'>
                    <h2 className='text-2xl pt-3 font-semibold '>{item.title}: </h2>
                  </p>
                  <p className='pt-1 font-normal text-base leading-6 text-gray-800 text-justify custom-content ' dangerouslySetInnerHTML={{ __html: item.content }} />


                </div>
              );
            }
            return null;
          })}


        </div>
        {/* <div className="flex lg:flex-row flex-col justify-between gap-8 pt-12">
          <div className="w-full lg:w-5/12 flex flex-col justify-center">
            <h1 className="text-3xl lg:text-4xl font-bold leading-9 text-gray-800  pb-4">
              Our Story
            </h1>
            <p className="font-normal text-base leading-6 text-gray-600 ">
            It is a long-established fact that a reader will be distracted by the readable content of a page
             when looking at its layout. The point of using Lorem Ipsum. In the first place we have granted to
              God, and by this our present charter confirmed for us and our heirs forever that the English 
              Church shall be free and shall have her rights entire, and her liberties inviolate, and we will
               that it be thus observed; which is apparent from
            </p>
          </div>
          <div className="w-full lg:w-8/12 lg:pt-8">
            <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 lg:gap-4 shadow-lg rounded-md">
              <div className="p-4 flex flex-wrap md:flex-nowrap justify-between flex-col items-center">
                <img
                  className="md:block "
                  src={img2}
                  alt="Alexa featured Image"
                />
              </div>
              <div className="p-4 pb-6 flex justify-center flex-col items-center">
                <img
                  className="md:block hidden"
                  src={img2}
                  alt="Olivia featured Image"
                />
               
              </div>
              <div className="p-4 pb-6 flex justify-center flex-col items-center">
                <img
                  className="md:block"
                  src={img4}
                  alt="Liam featued Image"
                />
               
               
              </div>
              <div className="p-4 pb-6 flex justify-center flex-col items-center">
                <img
                  className="md:block "
                  src={img3}
                  alt="Elijah featured image"
                />
              
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}
const Modal = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex  justify-center items-center z-50 ">
      <div className="bg-white p-2 rounded-lg w-full max-h[80vh] mx-6 overflow-hidden ">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-xl font-bold">X</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
const Modal2 = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex  justify-center items-center z-50 ">
      <div className="bg-white p-2 rounded-lg w-full max-h[80vh] mx-6 overflow-hidden ">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-xl font-bold">X</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Games
