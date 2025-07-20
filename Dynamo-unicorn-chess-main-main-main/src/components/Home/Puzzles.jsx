import React from "react";
import banner from "../../assets/banner_special.png";

function Puzzles() {
    return (
        <>
            <div className="rounded py-5 px-2 my-5 bg-[#262522] grid md:grid-cols-2 grid-cols-1">
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-white lg:text-3xl text-xl font-bold">
                        New Chess Piece
                    </h1>
                    <div
                        className="lg:h-28 h-20 lg:w-44 w-40 my-10 rounded-2xl bg-[#6ca732] shadow-md 
                          shadow-green-400/40
                          px-4 py-3 flex flex-col items-center justify-center"
                    >
                        <h1 className="text-white lg:text-2xl text-xl font-bold">
                            Missile
                        </h1>
                        <p className="text-white font-semibold">
                            Bishop + Knight
                        </p>
                    </div>
                    <div className="lg:w-96 sm:w-72 w-48 lg:font-semibold lg:text-xl text-md text-[#c5c5c4]">
                        Best way to improve pattern recognition also new
                        experience with 10x10 chess Board and new piece
                        Missile(Bishop + Knight).
                    </div>
                </div>
                <div
                    className="bg-contain bg-center mx-auto bg-no-repeat aspect-[3/4] lg:h-[400px] h-[250px]"
                    style={{
                        backgroundImage: `url(${banner})`,
                    }}
                ></div>
            </div>
        </>
    );
}

export default Puzzles;
