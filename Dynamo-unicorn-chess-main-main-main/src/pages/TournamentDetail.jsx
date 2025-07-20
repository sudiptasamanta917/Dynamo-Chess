import React, { useState, useEffect, useRef } from 'react';
import Slider from '../components/Slider';
import tBanner from "../assets/tBanner.jpg";
import tBanner2 from "../assets/tBanner2.jpg";
import { postApiWithFormdata } from '../utils/api';
import { useQuery } from 'react-query';
import "../styles.css";
import LoadingBar from 'react-top-loading-bar';
import t1 from "../assets/t1.jpg"
const TournamentDetail = () => {
  const sliderHeight = '380px'; // Set the desired height here
  const eventDetails = "Our 14th Annual Tournament\n May 24-May 27, 2024\nIndian Council For Cultural Relation";
  const images = [
    { img: tBanner, content: "Our 14th Annual Tournament" },
    { img: tBanner2, content: "Indian Council For Cultural Relation" },
  ];

  const loadingBar = useRef(null);
  const url = `${import.meta.env.VITE_URL}${import.meta.env.VITE_GETTOURNAMENT}`;
  const getDetails = {
    "title": [
      "Indian Council For Cultural Relation",
      "Chess Tournaments",
      "Section Of Tournaments",
    ]
  };

  const queryGetselectedContent = useQuery("getselectedContent", () => postApiWithFormdata(url, getDetails));

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
      <Slider height={sliderHeight} eventDetails={eventDetails} images={images} />
      <div className="container mx-auto p-6 max-w-screen-xl text-justify">
        <LoadingBar color="#F11946" ref={loadingBar} />
        
        {/* Heading Section */}
        <div className="text-center mb-6">
          <p className="text-4xl font-semibold text-black">CHESS FOR YOUTH</p>
        </div>

        {/* Tournament Content */}
        {queryGetselectedContent.data?.data?.data.map((content, index) => (
          <div key={index} className="p-4 mb-6 bg-gray-100 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center text-gray-800">{content.title}</h1>
            <div className="content mt-4 p-4 md:flex md:justify-between gap-6">
              <p className="text-lg text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: content.content }}></p>
            </div>
          </div>
        ))}

        {/* Additional Content Section (Optional) */}
        {/* 
        <div className="bg-gray-100 p-6 rounded-lg mt-8 shadow-md">
          <p className="text-3xl font-bold text-center text-gray-800">Chess Tournaments</p>
          <div className="flex gap-8 justify-between mt-4">
            <div className="text-lg text-gray-700">
              <p>The <span className="text-green-600">Premier Section</span> is for players below 25 years of age.</p>
              <p>The <span className="text-green-600">Junior Section</span> is for local players in age categories.</p>
              <p>Expected Number of Participants: One Thousand</p>
            </div>
            <img className="w-48 h-48 rounded-full" src={t1} alt="Tournament" />
          </div>
        </div>
        */}
      </div>
    </>
  );
};

export default TournamentDetail;
