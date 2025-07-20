import React from "react";
import Slider from "../Slider";
import chessBoard from "../../assets/chess_board.jpg";
import { LazyLoadImage } from "react-lazy-load-image-component";
import img from "../../assets/slider4.jpg";
import slider2 from "../../assets/slider2.jpg";
import slider3 from "../../assets/slider3.jpg";

function HomeMiddleBar() {
    const sliderHeight = "250px";
    const images = [
        { img: img, content: "kjhsg sdgkjsdgh skdfg" },
        { img: slider2, content: "kjhsg sdgkjsdgh skdfg" },
        { img: slider3, content: "kjhsg sdgkjsdgh skdfg" },
    ];
    return (
        <div className="">
            <div className="flex justify-center mb-5">
                <div>
                    {/* chess img */}
                    <div className="flex justify-center">
                        <LazyLoadImage
                            src={chessBoard}
                            alt=""
                            className="md:w-[600px] w-[500px] aspect-1/1 h-auto"
                            effect="blur"
                        />
                    </div>
                </div>
            </div>

            {/* carousel */}
            {/* <div className='rounded-lg overflow-hidden'>
            <Slider height={sliderHeight} images={images} className="h-[100px] md-[300px]"/>
          </div>
          <div>
            <marquee behavior="smooth" className='text-yellow-300'>We intend to start a competition for our new game of Dynamic Chess</marquee>
          </div> */}
        </div>
    );
}

export default HomeMiddleBar;
