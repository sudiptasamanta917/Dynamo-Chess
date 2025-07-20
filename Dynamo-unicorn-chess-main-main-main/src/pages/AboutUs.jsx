import React, {useState, useEffect, useRef} from 'react'
import img1 from '../assets/about/aboutimg1.jpeg'
import img2 from '../assets/about/aboutimg2.jpeg'
import img3 from '../assets/about/aboutimg3.jpeg'
import img4 from '../assets/about/aboutimg4.jpeg'
import { getApi, postApiWithFormdata } from '../utils/api';
import { useQuery } from 'react-query';
import "../styles.css"
import LoadingBar from 'react-top-loading-bar';
const AboutUs = () => {
   
  const loadingBar = useRef(null);
  const url = `${import.meta.env.VITE_URL}${import.meta.env.VITE_GETABOUTUS}`;
  const getSelected = {
    "title": [
        "About Us",
        "Our Story",
    ]
}
// console.log(url,"kkkkkkkkkk");
      const queryGetselectedContent = useQuery("getselectedContent", () => postApiWithFormdata(url,getSelected),);
      // console.log(queryGetselectedContent,"lllllllllllllll");

      const startLoading = () => {
        loadingBar.current.continuousStart();
      };
      const finishLoading = () => {
        loadingBar.current.complete();
      };
      useEffect(() => {
        if (queryGetselectedContent.isLoading) {
          startLoading();
        } else {
          finishLoading();
        }
      }, [queryGetselectedContent.isLoading]);
  return (
    <>
      <div className="2xl:container 2xl:mx-auto lg:py-16 lg:px-20 md:py-12 md:px-6 py-9 px-4">
      <LoadingBar color="#F11946" ref={loadingBar} />
      {queryGetselectedContent.data?.data?.data.map((content, index)=>(
        <div key={index} className="flex flex-col lg:flex-row justify-between gap-8">
          <div className="w-full w-full flex flex-col justify-center">
            <h1 className="text-3xl lg:text-4xl font-bold leading-9 text-gray-800 pb-4">
            {content.title}
            </h1>
            <p className="font-normal text-base leading-6 text-gray-600 "  dangerouslySetInnerHTML={{ __html:content.content  }} >
            {/* Chess takes a novel, 'dynamic' turn. In guidance of GM Dibyendu Barua & AGM Sk Shahid Ahmed, Kolkata-based realtor Mr.
             Pradeep Sadani created a new innovative mind game of advanced chess introducing a new piece called 'Dynamo/Missile'
             :rocket: which will have the combined power of a knight and a bishop. In New Millennium, the new strategic mind game
              starts with two dynamos/missiles on each side along with an addition of two extra pawns, making 20 pieces for each 
             side White and Black on a 100 squares board, instead of the traditional format of 64 squares on an 8x8 checkerboard:stars: The first Dynamo Chess Tournament 
             will be held on Friday 20th May, at Dhanuka Dhunseri Dibyendu Barua Chess Academy where the top three winners will get
              the Genius Award prize.:handshake: */}
            </p>
          </div>
          {/* <div className="w-full lg:w-7/12">
            <img
              className="h-[400px] w-full rounded-lg"
              src={content?.images ? content.images[0] : ''}
              alt="A group of People"
            />
          </div> */}
        </div>
        ))}
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
          <div className="w-full lg:w-7/12 lg:pt-8">
            <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 lg:gap-4 shadow-lg rounded-md">
              <div className="p-4 flex flex-wrap md:flex-nowrap justify-between flex-col items-center">
                <img
                  className="md:block h-44 w-full "
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
                  className="md:block h-44 w-full"
                  src={img4}
                  alt="Liam featued Image"
                />
               
               
              </div>
              <div className="p-4 pb-6 flex justify-center flex-col items-center">
                <img
                  className="md:block h-44 w-full"
                  src={img3}
                  alt="Elijah featured image"
                />
              
              </div>
            </div>
          </div>
        </div> */}
      </div>

    </>
  )
}

export default AboutUs
