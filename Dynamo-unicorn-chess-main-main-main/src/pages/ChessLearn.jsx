import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import king1 from "../assets/learnChess/king1.jpg";
import missile1 from "../assets/learnChess/missile1.jpg";
import bishop1 from "../assets/learnChess/bishop1.jpg";
import rook1 from "../assets/learnChess/rook1.jpg";
import pawn1 from "../assets/learnChess/pawn1.jpg";
import queen1 from "../assets/learnChess/queen1.jpg";
import knight1 from "../assets/learnChess/knight1.jpg";
import wr2 from "../assets/ducpices/WHITE/wr2.png"
import wn from "../assets/ducpices/WHITE/wn.png"
import wb from "../assets/ducpices/WHITE/wb.png"
import wk2 from "../assets/ducpices/WHITE/wk2.png"
import wq2 from "../assets/ducpices/WHITE/wq2.png"
import wp2 from "../assets/ducpices/WHITE/wp2.png"
import wm from "../assets/ducpices/WHITE/wm.png"
import banner2 from "../assets/banner2.jpg"
import t1 from "../assets/t1.jpg"
import t2 from "../assets/t2.jpg"
import t10 from "../assets/t10.jpg"
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { getApiWithToken } from '../utils/api';

const ChessLearn = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedPiece, setSelectedPiece] = useState('');

    const handleOpenModal = async (piece) => {
        if (piece) {
            const title = modalTitle[piece].title
            // console.log(typeof (title));
            const encodedTitle = encodeURIComponent(title);
            const url = `${import.meta.env.VITE_URL}${import.meta.env.VITE_GET_RULE}/${encodedTitle}`;
            // console.log(url);
            const data = await getApiWithToken(url)
            if (data.data.success) {
                // console.log(data?.data?.data[0], "ffffff",);
                setSelectedPiece(data?.data?.data[0]);
                setShowModal(true);

            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPiece('');
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
    const [showModal3, setShowModal3] = useState(false);
    // const [selectedPiece, setSelectedPiece] = useState('');

    const handleOpenModal3 = () => {
        // setSelectedPiece(piece);
        setShowModal3(true);
    };

    const handleCloseModal3 = () => {
        setShowModal3(false);
        // setSelectedPiece('');
    };

    // console.log(selectedPiece.images[0], "vvvvvvvv");

    const modalTitle = {
        Missile: {
            title: 'The Missile/Dynamo - Two Dynamos / Missiles per side at the beginning',
            img:missile1
        },
        Rook: {
            title: 'The Rook - Two Rooks per side at the beginning',
           
        },
        Knight: {
            title: 'The Knight - Two Knights per side at the beginning',
        },
        Bishop: {
            title: 'The Bishop - Two Bishops per side at the beginning',
        },
        King: {
            title: 'The King - One and Only per side',
        },
        Queen: {
            title: 'The Queen - One and Only per side at the beginning',
        },
        Pawn: {
            title: 'The Pawn - Ten Pawns per side',
        },
    }


    return (
        <>

            <Modal show={showModal} onClose={handleCloseModal} >

                <div className='max-h-[80vh] overflow-y-auto p-2'>
                    <LazyLoadImage src={selectedPiece?.images?.[0]} alt='' className="h-72 w-72 max-sm:h-56 max-sm:w-56  mx-auto mb-4 max-sm:mb-1" />
                    <div className='flex flex-wrap '>
                        <p className='text-2xl text-green-900 font-bold max-sm:leading-5'>{selectedPiece?.title}</p>
                        {/* <p className='text-lg pt-1 max-sm:leading-4'>{selectedPiece?.content}</p> */}
                    </div>
                    <p className='max-sm:leading-5'dangerouslySetInnerHTML={{ __html: selectedPiece?.content }}/>
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
            <Modal3 show={showModal3} onClose={handleCloseModal3}>
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
            </Modal3>

            <div className='grid grid-cols-4 max-md:grid-cols-1 gap-4 p-3'>
                <div className='leftPart col-span-1 max-md:flex justify-center hover:scale-105 hover:transition-all duration-500'>
                    <div className='flex justify-center mt-10'>
                        <LazyLoadImage src={banner2} alt="" className="w-full h-[500px]" />
                    </div>
                </div>
                <div className='rightPart md:w-[900px] m-3 col-span-3 max-md:col-span-1'>
                    <div>
                        <div className='text-center'>
                            <p className='text-5xl text-black font-bold'>Chess Pieces</p>
                        </div>
                        <div>
                            <p className='text-center text-2xl font-bold text-black'>
                                We are introducing Dynamo Chessmen…
                            </p>
                        </div>
                        <div className='flex justify-center my-3'>
                            <div
                                className='grid grid-cols-3 gap-1 text-white items-center rounded-lg bg-green-900 p-3 hover:scale-105 hover:transition-all w-[500px] duration-500 cursor-pointer'
                                onClick={() => handleOpenModal("Missile")}
                            >
                                <div className='flex justify-center items-center'>
                                    <LazyLoadImage src={wm} alt="" className="h-14" />
                                </div>
                                <div className='col-span-2'>
                                    <p className='font-bold text-2xl'>The Missile</p>
                                    <p className='text-xl'>Missile = Bishop + Knight</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-1 p-2 m-3">
                                <div className='p-1'>
                                    <div className='grid grid-cols-3 gap-2 w-full text-white items-center rounded-lg bg-green-900 p-3 hover:scale-105 hover:transition-all duration-500 cursor-pointer' onClick={() => handleOpenModal("King")}>
                                        <div className='flex justify-center items-center'>
                                            <LazyLoadImage src={wk2} alt="" className="h-12" />
                                        </div>
                                        <div className='col-span-2'>
                                            <p className='font-bold text-2xl'>The King</p>
                                            <p className='text-xl'>It moves one step</p>
                                        </div>
                                    </div>

                                </div>
                                <div className='p-1'>
                                    <div className='grid grid-cols-3 gap-1 w-full text-white items-center rounded-lg bg-green-900 p-3 hover:scale-105 hover:transition-all duration-500 cursor-pointer' onClick={() => handleOpenModal("Queen")}>
                                        <div className='flex justify-center items-center'>
                                            <LazyLoadImage src={wq2} alt="" className="h-12" />
                                        </div>
                                        <div className='col-span-2'>
                                            <p className='font-bold text-2xl'>The Queen</p>
                                            <p className='text-xl'>Queen = Rook + Bishop</p>
                                        </div>
                                    </div>

                                </div>
                                <div className='p-1'>
                                    <div className='grid grid-cols-3 gap-2 w-full text-white items-center rounded-lg bg-green-900 p-3 hover:scale-105 hover:transition-all duration-500 cursor-pointer' onClick={() => handleOpenModal("Bishop")}>
                                        <div className='flex justify-center items-center'>
                                            <LazyLoadImage src={wb} alt="" className="h-12" />
                                        </div>
                                        <div className='col-span-2'>
                                            <p className='font-bold text-2xl'>The Bishop</p>
                                            <p className='text-xl'>It moves diagonally</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='p-1'>
                                    <div className='grid grid-cols-3 gap-2 w-full text-white items-center rounded-lg bg-green-900 p-3 hover:scale-105 hover:transition-all duration-500 cursor-pointer' onClick={() => handleOpenModal("Rook")}>
                                        <div className='flex justify-center items-center'>
                                            <LazyLoadImage src={wr2} alt="" className="h-12" />
                                        </div>
                                        <div className='col-span-2'>
                                            <p className='font-bold text-2xl'>The Rook</p>
                                            <p className='text-xl'>It moves straight</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='p-1'>
                                    <div className='grid grid-cols-3 gap-2 w-full text-white items-center rounded-lg bg-green-900 p-3 hover:scale-105 hover:transition-all duration-500 cursor-pointer' onClick={() => handleOpenModal("Knight")}>
                                        <div className='flex justify-center items-center'>
                                            <LazyLoadImage src={wn} alt="" className="h-12" />
                                        </div>
                                        <div className='col-span-2'>
                                            <p className='font-bold text-2xl'>The Knight</p>
                                            <p className='text-xl'>It moves in L direction</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='p-1'>
                                    <div className='grid grid-cols-3 gap-1 w-full text-white items-center rounded-lg bg-green-900 p-3 hover:scale-105 hover:transition-all duration-500 cursor-pointer' onClick={() => handleOpenModal("Pawn")}>
                                        <div className='flex justify-center items-center'>
                                            <LazyLoadImage src={wp2} alt="" className="h-12" />
                                        </div>
                                        <div className='col-span-2'>
                                            <p className='font-bold text-2xl'>The Pawn</p>
                                            <p className='text-xl'>It moves forward only</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Dynamo chess Rule  */}
            <div className='grid grid-cols-4 max-md:grid-cols-1 gap-4 p-3'>

                <div className='col-span-3 max-md:col-span-1 px-5'>
                    <div className='text-start'>
                        <p className='text-3xl text-black font-bold'>Rules of Dynamo Chess 2020</p>
                    </div>
                    <div className='mt-4'>
                        {/* <p className='text-start text-xl font-bold text-black'>1. The game is played on a 10x10 chessboard.</p> */}
                        <p className='text-start'>1. The chessboard is composed of a 10x10 grid of 100 equal squares alternately light  squares and dark squares. The chessboard is placed between the players in such a way that the near corner square to the right of the player is light (yellow).</p>
                        <a href="https://youtu.be/f0KKo7zud50" target="_blank" rel="noopener noreferrer">
                            <p className='font-bold text-blue-600'>watch to learn</p>
                        </a>
                    </div>
                    <div className='mt-4'>
                        {/* <p className='text-start text-xl font-bold text-black'>2. Setup</p> */}
                        <p className='text-start'>2. This is a Dynamo Chess 2020 . at the beginning of the game White has 20 light ChessMan(10 piece & 10 pawn) Black has 20 dark ChessMan(10 piece & 10 pawn).</p>
                        <a href="https://youtu.be/hvg_4Z8tszI" target="_blank" rel="noopener noreferrer">
                            <p className='font-bold text-blue-600'>watch to learn</p>
                        </a>
                    </div>
                    <div className='mt-4'>
                        {/* <p className='text-start text-xl font-bold text-black'>3. Movement</p> */}
                        <p className='text-start'>3. In Dynamo Chess, a new piece is introduced which is called 'Dynamo/Missile'. It is situated next to the king and queen. Both sides have two missiles at the beginning of the game. At any point of time the "Missile" can move either like a Knight or a Bishop.</p>
                        <a href="https://youtu.be/d13XzMZtSlI" target="_blank" rel="noopener noreferrer">
                            <p className='font-bold text-blue-600'>watch to learn</p>
                        </a>
                    </div>
                    <div className='mt-4'>
                        {/* <p className='text-start text-xl font-bold text-black'>4. Special Rules</p> */}
                        {/* <p className='text-start'>Pawns can promote to Dynamo pieces in addition to the traditional pieces when they reach the farthest rank.</p> */}
                        <p className='text-start'>4. The pieces are as follows: A white king, a white queen, two white missiles, two white rooks, two white bishops, two white knights, ten white pawns a black king, a black queen, two black missiles, two black rooks, two black bishops, two black knights & ten black pawns.</p>
                        <a href="https://youtu.be/d13XzMZtSlI" target="_blank" rel="noopener noreferrer">
                            <p className='font-bold text-blue-600'>watch to learn</p>
                        </a>
                    </div>
                    <div className='mt-4'>
                        {/* <p className='text-start text-xl font-bold text-black'>5. Check and checkmate</p> */}
                        <p className='text-start'>5. Instead of having eight files & eight ranks, Dynamo Chess will have ten files & ten ranks.</p>
                        <a href="https://youtu.be/hvg_4Z8tszI" target="_blank" rel="noopener noreferrer">
                            <p className='font-bold text-blue-600'>watch to learn</p>
                        </a>
                        {/* <p className='text-start'>Castling involves the king and the nearest Dynamo piece instead of a rook.</p> */}
                    </div>
                    <div className='mt-4'>
                        {/* <p className='text-start text-xl font-bold text-black'>6. Castling</p> */}
                        <p className='text-start'>6. light(White) King resides light  square and dark(black) King resides on the dark square.</p>
                        <a href="https://youtu.be/hvg_4Z8tszI" target="_blank" rel="noopener noreferrer">
                            <p className='font-bold text-blue-600'>watch to learn</p>
                        </a>
                        {/* <p className='text-start'>Castling is permissible if the following conditions are met:[2]

                            Neither the king nor the rook has previously moved during the game.
                            There are no pieces between the king and the rook.
                            The king is not in check and does not pass through or finish on a square attacked by an enemy piece.
                            Castling is still permitted if the rook is under attack, or if the rook crosses an attacked square.</p> */}
                    </div>
                    <div className='mt-4'>
                        {/* <p className='text-start text-xl font-bold text-black'>6. En passant</p> */}
                        <p className='text-start'>7. Each pawn for the first time( for initial position) can move one, two or three squares.
                            A pawn occupying a square on the same file as and on an adjacent file to an opponent's pawn which has just advanced two or three squares in one move from its original square may capture this opponent's pawn even though the former had been moved only one square. This capture is only legal on the move following this advance and is called an <a href='#' onClick={() => handleOpenModal2("")} className='text-blue-600 font-semibold underline underline-offset-2'>En-passant</a>   capture. Unlike regular chess, two types of 'en passant' is possible in Dynamo Chess.</p>
                        <a href="https://youtu.be/k0Dig7oEtSQ" target="_blank" rel="noopener noreferrer">
                            <p className='font-bold text-blue-600'>watch to learn</p>
                        </a>
                    </div>
                    <div className='mt-4'>
                        {/* <p className='text-start text-xl font-bold text-black'>6. Promotion</p> */}
                        <p className='text-start'> 8.Unlike the conventional Chess both long and short <a href='#' onClick={() => handleOpenModal3("")} className='text-blue-600 font-semibold underline underline-offset-2'>Castling</a> king should move three square towards the rook and rook goes over the king and places besides the king</p>
                        <a href="https://youtu.be/lC8d5DHlfhM" target="_blank" rel="noopener noreferrer">
                            <p className='font-bold text-blue-600'>watch to learn</p>
                        </a>
                    </div>
                    <div className='mt-4'>
                        {/* <p className='text-start text-xl font-bold text-black'>5. Winning the Game</p> */}
                        <p className='text-start'>9. when a pawn reaches on its furthest rank from its starting position a "Missile" can be promoted along with all other regular pieces</p>
                        <p className='text-start'>Additionally, capturing both of the opponent's Dynamo pieces also results in a win.</p>
                        <a href="https://youtu.be/sWpfQuxDjjU" target="_blank" rel="noopener noreferrer">
                            <p className='font-bold text-blue-600'>watch to learn</p>
                        </a>
                    </div>
                    <div className='mt-4'>
                        {/* <p className='text-start text-xl font-bold text-black'>5. Winning the Game</p> */}
                        <p className='text-start'>10. Missile/Dynamo alone can checkmate a cornered king. Something no other piece can do on its own without the help of another piece.</p>
                        <a href="https://youtu.be/hfx84WYocNo" target="_blank" rel="noopener noreferrer">
                            <p className='font-bold text-blue-600'>watch to learn</p>
                        </a>
                        {/* <p className='text-start'>Additionally, capturing both of the opponent's Dynamo pieces also results in a win.</p> */}
                    </div>
                    <div className='mt-4'>
                        {/* <p className='text-start text-xl font-bold text-black'>5. Winning the Game</p> */}
                        <p className='text-start'>11. The value of the 'Missile' is 7 points.</p>
                        {/* <a href="https://www.facebook.com/BaruaDibyendu/photos" target="_blank" rel="noopener noreferrer">
                            <p className='font-bold text-blue-600'>watch to learn</p>
                        </a> */}
                        {/* <p className='text-start'>Additionally, capturing both of the opponent's Dynamo pieces also results in a win.</p> */}
                    </div>
                    <div className='mt-4'>
                        {/* <p className='text-start text-xl font-bold text-black'>5. Winning the Game</p> */}
                        <p className='text-start'>12. All other normal chess rules are followed.</p>
                        {/* <a href="https://www.facebook.com/BaruaDibyendu/photos" target="_blank" rel="noopener noreferrer">
                            <p className='font-bold text-blue-600'>watch to learn</p>
                        </a> */}
                        {/* <p className='text-start'>Additionally, capturing both of the opponent's Dynamo pieces also results in a win.</p> */}
                    </div>
                    <div className='mt-4'>
                        {/* <p className='text-start text-xl font-bold text-black'>5. Winning the Game</p> */}
                        <p className='text-start'>13. <span className='text-xl font-bold'>Do You Know</span></p>
                        <p className='text-start'>A Missile alone can checkmate a king when it is situated at a corner of a Dynamo chessboard </p>
                        <p>in a single game of Dynamo Chess a Pawn can do <a href='#' onClick={() => handleOpenModal2("")} className='text-blue-600 font-semibold underline underline-offset-2'>En-passant</a>  twice</p>
                        {/* <a href="https://www.facebook.com/BaruaDibyendu/photos" target="_blank" rel="noopener noreferrer">
                            <p className='font-bold text-blue-600'>watch to learn</p>
                        </a> */}
                    </div>
                </div>

                <div className='col-span-1'>

                    <div className='leftPart  col-span-1 hover:scale-105 hover:transition-all  duration-500  '>
                        <div className='flex justify-center  mt-5' >
                            <LazyLoadImage src={t10} alt="" className="w-full h-[350px]  rounded-md  " />
                        </div>
                    </div>
                    <div className='leftPart  col-span-1 hover:scale-105 hover:transition-all  duration-500  '>
                        <div className='flex justify-center  mt-5' >
                            <LazyLoadImage src={t1} alt="" className="w-full h-[350px]  rounded-md  " />
                        </div>
                    </div>
                    <div className='leftPart  col-span-1 hover:scale-105 hover:transition-all  duration-500  '>
                        <div className='flex justify-center  mt-5' >
                            <LazyLoadImage src={t2} alt="" className="w-full h-[350px]  rounded-md  " />
                        </div>
                    </div>

                </div>
            </div>

        </>
    )
}

const Modal = ({ show, onClose, children }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-2 rounded-lg w-2/3 md:w-1/2 max-sm:w-full max-h[80vh] max-sm:mx-6 overflow-hidden ">
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
const Modal3 = ({ show, onClose, children }) => {
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

export default ChessLearn
