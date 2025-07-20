import React, { useState } from "react";
import { GiLoincloth, GiRabbit } from "react-icons/gi";
import { HiFire } from "react-icons/hi";
import { LuAtom } from "react-icons/lu";
import img1 from "../assets/img1.jpeg";
import img2 from "../assets/img2.jpeg";
import img3 from "../assets/img3.jpeg";
import { BiSolidVideoRecording } from "react-icons/bi";
import { FaChess, FaGooglePlay, FaPlusCircle, FaTrophy } from "react-icons/fa";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import Slider from "../components/Slider"
import board from '../assets/board2.png'
import banner from '../assets/banner2.jpg'
import dynamo from '../assets/hmsl2.png'
import { AiFillThunderbolt } from "react-icons/ai";
import { MdOutlineTimer } from "react-icons/md";
import { IoIosRocket } from "react-icons/io";
import { FaEarthAfrica } from "react-icons/fa6";
import { FaHandshake } from "react-icons/fa6";
import { RiRobot2Fill } from "react-icons/ri";
import Testimonial from "../components/Home/Testimonial";
import HomeLeftBar from "../components/Home/HomeLeftBar";
import HomeRightBar from "../components/Home/HomeRightBar";
import HomeMiddleBar from "../components/Home/HomeMiddleBar";
import Pricing from "../components/Home/Pricing";
import Sponsors from "../components/Home/Sponsors";
import { getUserdata } from "../utils/getuserdata";
import { useQuery } from "react-query";
import { getApi, getApiWithToken } from "../utils/api";




function Home() {
  const [bullet, setBullet] = useState(false);
  const [rapid, setRapid] = useState(false);
  const [blitz, setBlitz] = useState(false);
 
  const handleBullet = () => {
    setBullet(!bullet);

  };
  const handleRapid = () => {
    setRapid(!rapid)
  };
  const handleBlitz = () => {
    setBlitz(!blitz)

  };

//   const url = `${import.meta.env.VITE_URL}${import.meta.env.VITE_PROFILE}`;
//   const queryGetPROFILE = useQuery("getPROFILE1", () => getApiWithToken(url),);

//   if (queryGetPROFILE.data) {
//     localStorage.setItem("User Detail", JSON.stringify(queryGetPROFILE.data?.data));
// }


  // const userdata =  getUserdata()

  // if (userdata) {
  //   const url = `${import.meta.env.VITE_URL}${import.meta.env.VITE_GET_ACTIVITY}/${userdata.username}`;
  //   console.log(url, "jjjjjjjjjjjvvv",userdata);
  //   const queryGetActivity = useQuery(["getActivity",url], () => getApi(url),{
  //     refetchOnWindowFocus: false,
  //     refetchInterval: 120000,
  //     enabled: !!url, // Only run the query if the URL is not empty
  //   });
  //   console.log(queryGetActivity,"ffffffffvvvvvvvvvv");
    
  // }

  return (
      <div className=" ">
          <div className=" grid md:grid-cols-2 grid-cols-1 gap-3">
              {/* left column */}
              <div className="col-span-1 max-lg:col-span-1">
                  <HomeMiddleBar />
              </div>
              {/* right column */}
              <div className="col-span-1">
                  <HomeRightBar />
              </div>

              {/* mobile view only s bar */}
              <div className="col-span-1 sm:hidden">
                  <HomeLeftBar />
              </div>
          </div>
          <Testimonial />
          <Pricing />
          <Sponsors />
      </div>
  );
}

export default Home;
