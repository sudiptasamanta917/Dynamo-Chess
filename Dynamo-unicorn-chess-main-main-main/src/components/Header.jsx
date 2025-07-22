import React, { useEffect, useState } from "react";

import logo from "../assets/dynamo logo psd[1].png";
import { MdOutlinePlayCircleFilled } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { FaBell } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { SiChessdotcom } from "react-icons/si";
import { IoExtensionPuzzleSharp } from "react-icons/io5";
import { MdGroups } from "react-icons/md";
import { IoGameController } from "react-icons/io5";
import { FaTrophy } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoMdMenu } from "react-icons/io";
import { FaXmark } from "react-icons/fa6";
import ModalPlaywithFriend from "./Home/ModalPlaywithFriend";
import { FaRegUserCircle } from "react-icons/fa";
import "./googleTranslate.css"
import { useQuery } from "react-query";
import { getApi, getApiWithToken } from "../utils/api";
import { getUserdata } from "../utils/getuserdata";
import NotificationMp3 from '../assets/sound/notification.mp3'
import JoinTournament from "./joinTournament/JoinTournament";
import { useDispatch, useSelector } from "react-redux";
import { GameStatus, TournamentStartPopup, TournamentStatus } from "../redux/action";
import axios from "axios";
import HeaderNote from "./HeaderNote";
const NotificationSound = new Audio(NotificationMp3)
function Header({ isSidebarOpen, setIsSidebarOpen }) {
    const location = useLocation();
    const isMultiplayerPresent = location.pathname.includes("/multiplayer");
    // console.log(isMultiplayerPresent, "isMultiplayerPresent");
    const [search, setSearch] = useState("");
    const token = localStorage.getItem("chess-user-token");
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const [searchInut, setSearchInput] = useState(false);
    const [menu, setMenu] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModal1Open, setIsModal1Open] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [remainingTime, setRemainingTime] = useState(null);
    const [joinUrl, setJoinUrl] = useState(null);
    // const [redirect, setRedirect] = useState(false);
    // var redirect=false;
    // const [pairedMatches,setPairedMatches]=useState([])

    function timeToMs(time, addMinutes = 0) {
        // Get current date
        const now = new Date();

        // Split the time string into hours and minutes
        const [hours, minutes] = time?.split(":").map(Number);

        // Create a date object for today at the specified time
        const targetTime = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            hours,
            minutes
        );

        // Convert the target time to milliseconds and add extra minutes
        const ms = targetTime.getTime();
        const addedMs = addMinutes * 60 * 1000;

        return ms + addedMs;
    }
    const userdata = getUserdata();
    const notificationUrl = `${import.meta.env.VITE_URL}${
        import.meta.env.VITE_NOTIFICATION
    }/${userdata?._id}`;

    const queryNOTIFICATION = useQuery(
        ["getNOTIFICATION", notificationUrl], // Query key
        () => getApi(notificationUrl), // Query function
        {
            refetchOnWindowFocus: false,
            refetchInterval: 2000,
            enabled: !!notificationUrl,
        }
    );

    const upcomingTournmentUrl = userdata?._id
        ? `${import.meta.env.VITE_URL}${
              import.meta.env.VITE_GET_UPCOMING_TOURNAMENT
          }`
        : null;

    // console.log(notificationUrl1);

    const queryNOTIFICATION1 = useQuery(
        ["getNOTIFICATION12", upcomingTournmentUrl], // Query key
        () => getApiWithToken(upcomingTournmentUrl), // Query function
        {
            refetchOnWindowFocus: false,
            refetchInterval: 4000,
            enabled: !!upcomingTournmentUrl, // Only run if the URL is valid
        }
    );

    // let joinUrl=queryNOTIFICATION1?.data?.data?.pairedMatches?.[0]?.matchUrl || null

    // let remainingTime=queryNOTIFICATION1?.data?.data?.tournaments?.[0]?.time || null
    const UserDetail = JSON.parse(localStorage.getItem("User Detail"));
    const userId = UserDetail?._id;
    // console.log(joinUrl,remainingTime,queryNOTIFICATION1,showPopup,"queryNOTIFICATION1");

    const redirect = async (userId, roundId) => {
        try {
            const closeredirecturl = `${
                import.meta.env.VITE_URL
            }/redirectUrl/${roundId}/${userId}`;
            const response = await axios(closeredirecturl, {
                method: "GET",
                headers: {
                    // Authorization: JSON.parse(token),
                    "Content-Type": "application/json",
                },
            });
            if (response.status == 200) {
                // console.log(response.status, "call ho raha redirect stop");
                return true;
            } else {
                // console.log(response.status, "call ho raha nhi ho raha");

                return false;
            }
        } catch (error) {
            // console.log("redirect error", error);
            return false;
        }
    };
    useEffect(() => {
        // Extract time from the first tournament's data
        const fetch = async () => {
            const pairedMatches =
                queryNOTIFICATION1?.data?.data?.pairedMatches || [];
            const time = queryNOTIFICATION1?.data?.data?.tournaments?.[0]?.time;
            // console.log(pairedMatches, time, "pairedmatches time");
            if (time) {
                setRemainingTime(timeToMs(time));
            } else {
                setRemainingTime(null);
            }
            // console.log(pairedMatches,"");
            // Find the first match where both user1 and user2 are present
            const match = pairedMatches.find(
                (match) =>
                    (match.user1 === userId || match.user2 === userId) &&
                    match.user1 &&
                    match.user2
            );
            // console.log(match?.user1,match?.user2,"match by user id",pairedMatches);
            // If both user1 and user2 exist, set the join URL and show popup
            if (match?.user1 && match?.user2) {
                const userColor =
                    match.user1 === userId
                        ? match.user1Color
                        : match.user2 === userId
                        ? match.user2Color
                        : "null";
                const url = match.url;
                localStorage.setItem("userColour", userColor);
                if (url) {
                    const roundId = url.split("tournament:")[1].split(":")[1];
                    setJoinUrl(url);
                    if (match?.user1 == userId && !match?.user1Joined) {
                        const testredirect = await redirect(userId, roundId);
                        // console.log(testredirect);

                        if (testredirect) {
                            window.location.href = url;
                        }
                    } else if (match?.user2 == userId && !match?.user2Joined) {
                        const testredirect = await redirect(userId, roundId);
                        // console.log(testredirect);
                        if (testredirect) {
                            window.location.href = url;
                        }
                    }
                }

                // if (url && !redirect) {
                //   const path = url.split('/multiplayer/')[1];
                // navigate(`/multiplayer/${path}`);
                // setRedirect(true)
                // }

                // console.log(time,userColor,match?.user1,match?.user2,"usercolor---",url);

                // dispatch(TournamentStatus(false))
                // dispatch(TournamentStartPopup(remainingTime, url,true))
                // // Show popup if the current user is involved in any match
                // setShowPopup(true);
            } else {
                // Hide the popup and reset the join URL if the conditions aren't met
                setShowPopup(false);
                setJoinUrl(null);
                dispatch(TournamentStartPopup(null, null, false));
                // setRedirect(false)
            }
        };

        fetch();

        // console.log(pairedMatches,remainingTime,"pairedMatches remaining time");
    }, [
        queryNOTIFICATION1?.data?.data?.pairedMatches,
        queryNOTIFICATION1?.data?.data?.tournaments,
        userId,
        remainingTime,
    ]);

    useEffect(() => {
        if (queryNOTIFICATION?.data?.data?.notifications?.length > 0) {
            // console.log("notification sound play ho gaya");
            NotificationSound.play();
        }
    }, [queryNOTIFICATION?.data?.data?.notifications?.length]);

    localStorage.setItem(
        "notification",
        JSON.stringify(queryNOTIFICATION?.data?.data?.notifications)
    );

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const userDetails = token;

    const googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
            {
                pageLanguage: "en",
                autoDisplay: false,
            },
            "google_translate_element"
        );
    };
    useEffect(() => {
        var addScript = document.createElement("script");
        addScript.setAttribute(
            "src",
            "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        );
        document.body.appendChild(addScript);
        window.googleTranslateElementInit = googleTranslateElementInit;
    }, []);

    const handleChange = (value) => {
        setSearch(value);
    };

    const url = `${import.meta.env.VITE_URL}${
        import.meta.env.VITE_GET_USER_BY_NAME
    }${search}`;

    const queryGetSearch = useQuery("getSearch", () => getApi(url), {
        enabled: false,
    });

    const handleSearch = () => {
        // Only refetch if search is not empty
        if (search.trim() !== "") {
            // console.log("ggggggggg=>>>>>>>>>>>>");
            queryGetSearch.refetch();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
        }
    };

    const handleClick = () => {
        handleSearch(); // Call your search function on mouse click
    };

    const handleSearchClick = (e, item) => {
        // console.log("ggggggggg=>>>>>>>>>>>>");
        e.preventDefault();
        navigate(`/userprofile/${item._id}`);
        setIsModal1Open(false);
        setSearch("");
    };
    // console.log(queryGetSearch.isSuccess && queryGetSearch.data?.data?.success,"=>>>>>>>>>>>ttt",queryGetSearch.data?.data,"=========",url);
    // Check if the API call was successful and set modal state
    React.useEffect(() => {
        // console.log('useEffect triggered:', {
        //   isSuccess: queryGetSearch.isSuccess,
        //   successData: queryGetSearch.data?.data?.success,
        // });

        if (queryGetSearch.isSuccess && queryGetSearch.data?.data?.success) {
            // console.log('Success and data are true:', queryGetSearch.data?.data);
            setIsModal1Open(true);
            // console.log('Modal should be open now.');
        } else {
            setIsModal1Open(false);
        }
    }, [
        queryGetSearch.isSuccess,
        queryGetSearch.data?.data?.success,
        queryGetSearch.data?.data,
    ]);

    const hendelOnlineGame = () => {
        // /multiplayer/randomMultiplayer/1500
        const protocol = window.location.protocol;
        const host = window.location.host;
        const uniqueIdurl = `${protocol}//${host}/multiplayer/randomMultiplayer/600`;
        // window.open(uniqueIdurl, '_blank');
        window.location.href = uniqueIdurl;

        setMenu(false);
    };

    const handleOfline = () => {
        navigate("/chess10by10");
        setMenu(false);
    };

    // console.log("===============>>>>>isModal1Open",isModal1Open);

    return (
        <div className="text-white">
            {/* first header */}
            <JoinTournament Url={joinUrl} targetTimes={remainingTime} />
            <div className="w-[90vw] rounded-lg fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
                <nav className="shadow-md rounded-lg w-full sm:h-16 h-12 gap-1 flex justify-between px-3 bg-[#96fff649] text-white backdrop-blur-md">
                    <div
                        onClick={() => {
                            setMenu(false);
                            setIsSidebarOpen(false);
                        }}
                        className=" flex items-center relative gap-3 "
                    >
                        <Link to="/" className="py-1 flex items-center">
                            <img
                                src={logo}
                                alt=""
                                className="sm:w-24 w-20 sm:h-24 h-20"
                            />
                        </Link>
                        <div className="sm:text-3xl text-xl text-yellow-300 font-bold">
                            Dynamo Chess
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 items-center">
                        {/* <div id="google_translate_element"></div> */}
                        <div className="relative pt-2 pr-2 lg:hidden">
                            <Link to="/profile">
                                {" "}
                                <FaBell className="w-6 h-6 text-amber-950" />
                            </Link>
                            <div className="absolute top-[1px] left-3 right-0 inline-flex items-center justify-center text-sm bg-red-500 p-[3px] font-bold leading-none text-white rounded-full">
                                {queryNOTIFICATION?.data?.data?.notifications
                                    ?.length || 0}
                            </div>
                        </div>
                        <div
                            className="lg:hidden"
                            onClick={() => setMenu(!menu)}
                        >
                            <IoMdMenu
                                className={`text-amber-950 text-3xl font-bold ${
                                    menu && "hidden"
                                }`}
                            />
                            <FaXmark
                                className={`text-amber-950 text-2xl font-bold ${
                                    !menu && "hidden"
                                }`}
                            />
                        </div>
                        {userDetails ? (
                            <div className="flex md:gap-5 gap-2 justify-end max-lg:hidden">
                                <div className="pt-1">
                                    <div className="flex items-center bg-[#b2c8ba9a] shadow-2xl rounded-3xl  overflow-hidden h-10">
                                        <input
                                            type="text"
                                            className="focus:outline-none h-10 w-44 bg-transparent border border-none text-amber-950 placeholder:text-green-800 placeholder:font-semibold pl-4 pr-2"
                                            placeholder="Search"
                                            value={search}
                                            onChange={(e) =>
                                                handleChange(e.target.value)
                                            }
                                            onKeyDown={handleKeyDown}
                                        />
                                        <label
                                            onClick={handleClick}
                                            className="bg-[#d2f7fca4] rounded-full p-2 text-base m-1 mr-2"
                                        >
                                            <FaSearch className="p-0.5 text-green-700" />
                                        </label>

                                        {isModal1Open && (
                                            <div
                                                className="absolute right-0 z-10 mt-[121px] mr-[42px] w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                                role="menu"
                                                aria-orientation="vertical"
                                                aria-labelledby="menu-button"
                                                tabIndex="-1"
                                            >
                                                <div
                                                    className="py-1"
                                                    role="none"
                                                >
                                                    {queryGetSearch.data?.data?.data?.map(
                                                        (item, index) => (
                                                            <a
                                                                onClick={(e) =>
                                                                    handleSearchClick(
                                                                        e,
                                                                        item
                                                                    )
                                                                }
                                                                key={index}
                                                                className=" cursor-pointer block px-4 py-2 text-sm text-gray-700"
                                                                role="menuitem"
                                                                tabIndex="-1"
                                                                id="menu-item-0"
                                                            >
                                                                {item.username}{" "}
                                                            </a>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="relative pt-3 pb-2">
                                    <Link to="/profile">
                                        {" "}
                                        <FaBell className="w-7 h-7 amber-950" />
                                    </Link>
                                    <div className="absolute top-1 left-3 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                                        {queryNOTIFICATION?.data?.data
                                            ?.notifications?.length || 0}
                                    </div>
                                </div>
                                <div className="flex items-center text-3xl">
                                    <Link to="/profile">
                                        <FaRegUserCircle className="text-amber-950" />
                                    </Link>
                                </div>
                                {/* <p onClick={Logout} className="py-1 px-3 cursor-pointer">Logout</p> */}
                            </div>
                        ) : (
                            <ul className="flex justify-end gap-2 max-lg:hidden">
                                <li
                                    onClick={() => setSearchInput(!searchInut)}
                                    className="px-2 py-3"
                                >
                                    <div className="flex items-center">
                                        <FaSearch className="mt-1" />
                                    </div>
                                </li>
                                {searchInut && (
                                    <li className="px-2 py-3">
                                        <div className="flex items-center">
                                            <input
                                                type="text"
                                                className="focus:outline-none px-2 bg-black"
                                                placeholder="Search"
                                            />
                                        </div>
                                    </li>
                                )}
                                <li className="px-2 py-3">
                                    {" "}
                                    <Link
                                        to="/register"
                                        className="text-white uppercase"
                                    >
                                        sign up{" "}
                                    </Link>
                                </li>
                                <li className="px-2 py-3">
                                    {" "}
                                    <Link
                                        to="/login"
                                        className="text-white uppercase text-md"
                                    >
                                        Log in{" "}
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </div>
                </nav>
            </div>

            {/* sideBar header */}
            <div
                className={`fixed top-28 left-0 h-[calc(100vh-6rem)] ${
                    isSidebarOpen ? "w-40" : "w-14"
                } transition-all duration-200 ease-in-out bg-[#262522] backdrop-blur-md h-screen rounded-r-md pt-5`}
            >
                {/* Toggle Button */}
                <div className="flex justify-center mb-5 mr-1">
                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-[#4E342E] p-[0px] rounded-full bg-[#262522] hover:bg-gray-600"
                    >
                        <MdOutlinePlayCircleFilled
                            className={`transition-transform duration-300 ${
                                isSidebarOpen ? "rotate-180" : ""
                            }`}
                            size={30}
                        />
                    </button>
                </div>

                {/*sideBar content*/}
                <ul className="text-[#E3C78A] text-[14px] font-bold">
                    <li className="relative group/item hover:bg-gray-600 hover:text-white mb-4 py-1 px-2 uppercase hover:">
                        {" "}
                        <Link
                            to="/"
                            className={`flex items-center gap-3 transition-all duration-500`}
                        >
                            <FaHome className="md:text-[25px] text-[20px] text-[#4E342E]" />
                            {isSidebarOpen && "Home"}
                        </Link>
                    </li>
                    <li className="relative group/item hover:bg-gray-600 hover:text-white mb-4 py-1 px-2 uppercase hover:">
                        {" "}
                        <span
                            className={`flex items-center gap-3 transition-all duration-500`}
                        >
                            <SiChessdotcom className="md:text-[25px] text-[20px] text-[#4E342E]" />
                            {isSidebarOpen && "Play"}
                        </span>
                        <ul className="absolute z-50 left-0 w-40 px-2 hidden bg-gray-600 text-white rounded-md  group-hover/item:block capitalize   ">
                            <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                                <Link onClick={hendelOnlineGame}>
                                    Play Online
                                </Link>
                            </li>
                            <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                                <Link to="/chess10by10">Play Offline</Link>
                            </li>
                            <li
                                onClick={openModal}
                                className="hover:bg-gray-500 text-nowrap p-1 my-2"
                            >
                                <a>Play with friend</a>
                            </li>
                            <li className="hover:bg-gray-500 text-nowrap pl-1 py-1 my-1">
                                <Link to="/trainer">Learn from Trainer</Link>
                            </li>
                        </ul>
                    </li>
                    <li className="relative group/item hover:bg-gray-600 hover:text-white mb-4 py-1 px-2 uppercase hover:">
                        {" "}
                        <span
                            className={`flex items-center gap-3 transition-all duration-500`}
                        >
                            <IoExtensionPuzzleSharp className="md:text-[25px] text-[20px] text-[#4E342E]" />
                            {isSidebarOpen && "puzzles"}
                        </span>
                        <ul className="absolute left-0 z-50 w-40 px-2 hidden bg-gray-600 rounded-md text-white  group-hover/item:block capitalize  ">
                            <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                                <Link to={"/puzzle"}>puzzle rush</Link>
                            </li>
                            <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                                <Link to="/">puzzle battle</Link>
                            </li>
                            <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                                <Link to="/">puzzle storm</Link>
                            </li>
                            <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                                <Link to="/">puzzle racer</Link>
                            </li>
                        </ul>
                    </li>
                    {/* <li className="relative group/item hover:bg-gray-600 hover:text-white py-1 px-2 uppercase hover:">
            {" "}
            <a className="">learn</a>
            <ul className="absolute z-50 left-0 hidden bg-gray-600 text-white  group-hover/item:block capitalize  ">
              <li className="hover:bg-gray-500 text-nowrap p-1 my-2 pe-12">
                <Link to="/chessLearn">Chess basics</Link>

              </li>
              <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                <Link to="/chess8by8">Practice</Link>
              </li> */}
                    {/* <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                 <a href="">Analysis</a>
               </li>
               <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                 <a href="">Lessons</a>
               </li>
               <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                 <a href="">endgame</a>
               </li> */}
                    {/* </ul>
          </li> */}
                    {/* <li className="relative  group/item hover:bg-gray-600 hover:text-green-400 py-1 px-2 uppercase hover:">
             {" "}
             <a>watch</a>
             <ul className="absolute z-50 left-0 hidden bg-gray-600 text-green-400  group-hover/item:block capitalize  ">
               <li className="hover:bg-gray-500 text-nowrap p-1 my-2 pe-16">
                 <a href="">Broadcasts</a>
               </li>
              
               <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                 <a href="">current games</a>
               </li>
               <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                 <a href="">streamers</a>
               </li>
               <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                 <a href="">video library</a>
               </li>
             </ul>
           </li> */}
                    <li className="relative   group/item hover:bg-gray-600 hover:text-white mb-4 py-1 px-2 uppercase">
                        {" "}
                        <span
                            className={`flex items-center gap-3 transition-all duration-500`}
                        >
                            <MdGroups className="md:text-[25px] text-[20px] text-[#4E342E]" />
                            {isSidebarOpen && "community"}
                        </span>
                        <ul className="absolute z-50 left-0 w-40 px-2 hidden bg-gray-600 text-white rounded-md group-hover/item:block capitalize  ">
                            <li className="hover:bg-gray-500 text-nowrap p-1 my-2 ">
                                <Link to={"/player"}>Players</Link>
                            </li>
                            {/* <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                 <a href="">Teams</a>
               </li>
               <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                 <a href="">form</a>
               </li> */}
                            {/* <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                                <Link to={'/blog'} href="">Blog</Link>
                            </li> */}
                        </ul>
                    </li>
                    {/* <li className="relative  hover: group/item  hover:bg-gray-600 hover:text-green-400 py-1 px-2 uppercase">
             {" "}
             <a >tools</a>
             <ul className="absolute z-50 left-0 hidden bg-gray-600 text-green-400  group-hover/item:block capitalize  ">
               <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                 <a href="">Analysis board</a>
               </li>
               <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                 <a href="">Openings</a>
               </li>
               <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                 <a href="">Boards editor</a>
               </li>
               <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                 <a href="">Import game</a>
               </li>
               <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                 <a href="">advance search</a>
               </li>
             </ul>
           </li> */}
                    <li className="relative  hover: group/item  hover:bg-gray-600 hover:text-white mb-4 py-1 px-2 uppercase">
                        {" "}
                        <span
                            className={`flex items-center gap-3 transition-all duration-500`}
                        >
                            <FaTrophy className="md:text-[25px] text-[20px] text-[#4E342E]" />
                            {isSidebarOpen && "Tournaments"}
                        </span>
                        <ul className="absolute z-50 lg:left-0 w-40 px-2 pt-2 hidden bg-gray-600 text-white rounded-md group-hover/item:block capitalize ">
                            <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                                <Link to="/TournamentDetail">
                                    About Tournament
                                </Link>
                            </li>
                            <li className="hover:bg-gray-500 text-nowrap p-1 mb-3">
                                <Link to="/tournaments">Tournament List</Link>
                            </li>
                        </ul>
                    </li>

                    <li className="relative  hover: group/item  hover:bg-gray-600 hover:text-white mb-4 py-1 px-2 uppercase">
                        {" "}
                        <Link
                            to="/chessLearn"
                            className={`flex items-center gap-3 transition-all duration-500`}
                        >
                            <FaBookOpen className="md:text-[25px] text-[20px] text-[#4E342E]" />
                            {isSidebarOpen && "Rules"}
                        </Link>
                    </li>

                    <li className="relative  hover: group/item  hover:bg-gray-600 hover:text-white mb-4 py-1 px-2 uppercase">
                        {" "}
                        <Link
                            to="/aboutUs"
                            className={`flex items-center gap-3 transition-all duration-500`}
                        >
                            <FaUserFriends className="md:text-[25px] text-[20px] text-[#4E342E]" />
                            {isSidebarOpen && "About Us"}
                        </Link>
                    </li>

                    <li className="relative  hover: group/item  hover:bg-gray-600 hover:text-white mb-4 py-1 px-2 uppercase">
                        {" "}
                        <Link
                            to="/Games"
                            className={`flex items-center gap-3 transition-all duration-500`}
                        >
                            <IoGameController className="md:text-[25px] text-[20px] text-[#4E342E]" />
                            {isSidebarOpen && "Games"}
                        </Link>
                    </li>

                    {/* <li className="relative  hover: group/item  hover:bg-gray-600 hover:text-white mb-4 py-1 px-2 uppercase">
                        {" "}
                        <Link
                            to={"/productList"}
                            className={`flex items-center gap-3 transition-all duration-500 ${
                                isSidebarOpen ? "opacity-100" : "opacity-0"
                            }`}
                        >
                            <IoGameController className="md:text-[25px] text-[20px] text-[#4E342E]" />
                            {isSidebarOpen && "Product"}
                        </Link>
                    </li>
                    <li className="relative  hover: group/item  hover:bg-gray-600 hover:text-white py-1 px-2 uppercase">
                        {" "}
                        <Link
                            to="/deleteAccount"
                            className={`flex items-center gap-3 transition-all duration-500 ${
                                isSidebarOpen ? "opacity-100" : "opacity-0"
                            }`}
                        >
                            <IoGameController className="md:text-[25px] text-[20px] text-[#4E342E]" />
                            {isSidebarOpen && "Account Delete Request"}
                        </Link>
                    </li> */}

                    {/* <li className="text-yellow-300 hover:text-green-500 py-3 px-2 uppercase">
             {" "}
             <a href="" className=" ">
               Donate
             </a>
           </li>  */}
                </ul>
            </div>

            {/* mobile and tab device header */}
            {menu && (
                <div className="relative overscroll-contain overflow-hidden h-screen w-full md:hidden text-white">
                    <div className=" h-screen fixed top-15 bg-gray-700 w-full">
                        {/* first heading */}
                        <div className="">
                            <ul className="flex justify-between">
                                {userDetails ? (
                                    <div className="text-white capitalize  mt-3 px-3">
                                        <Link
                                            onClick={() => setMenu(false)}
                                            to="/profile"
                                        >
                                            <FaRegUserCircle className="text-2xl" />
                                        </Link>
                                    </div>
                                ) : (
                                    <ul className="flex justify-between">
                                        <li
                                            onClick={() => setMenu(false)}
                                            className="px-2 py-3"
                                        >
                                            {" "}
                                            <Link
                                                to="/register"
                                                className="text-green-400 uppercase"
                                            >
                                                sign up{" "}
                                            </Link>
                                        </li>
                                        <li
                                            onClick={() => setMenu(false)}
                                            className="px-2 py-3"
                                        >
                                            {" "}
                                            <Link
                                                to="/login"
                                                className="text-green-400 uppercase text-md"
                                            >
                                                Log in{" "}
                                            </Link>
                                        </li>
                                        {/* <li onClick={() => setMenu(false)} className="px-2 py-3">
                      {" "}
                      <Link to="/deleteAccount" className="text-green-400 uppercase text-md">
                         deleteAccount{" "}
                      </Link>
                    </li> */}
                                    </ul>
                                )}

                                <li
                                    onClick={() => setSearchInput(!searchInut)}
                                    className="px-2 py-3"
                                >
                                    <div className="flex items-center">
                                        <FaSearch className="mt-1" />
                                    </div>
                                </li>
                            </ul>
                            {searchInut && (
                                <div className="flex items-center ">
                                    <input
                                        type="text"
                                        className="focus:outline-none p-2 bg-black w-full"
                                        placeholder="Search"
                                    />
                                </div>
                            )}
                        </div>
                        {/* second header */}
                        <div className="">
                            <ul className="block  gap-4   text-black font-bold ">
                                <li
                                    onClick={() => setMenu(false)}
                                    className="relative group/item hover:bg-gray-600 hover:text-green-400 py-1 px-2 uppercase text-white "
                                >
                                    {" "}
                                    <Link to="/" className="">
                                        Home
                                    </Link>
                                </li>
                                <li className="relative group/item hover:bg-gray-600 hover:text-white py-1 px-2 uppercase text-white">
                                    {" "}
                                    <a className="">Play</a>
                                    <ul className=" z-50 lg:left-0  hidden bg-gray-600 text-white  group-hover/item:block capitalize  ">
                                        <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                                            <Link onClick={hendelOnlineGame}>
                                                Play Online
                                            </Link>
                                        </li>
                                        <li
                                            onClick={handleOfline}
                                            className="hover:bg-gray-500 text-nowrap p-1 my-2"
                                        >
                                            <Link to="/chess10by10">
                                                Play Offline
                                            </Link>
                                        </li>
                                        <li
                                            onClick={openModal}
                                            className="hover:bg-gray-500 text-nowrap p-1 my-2 cursor-pointer"
                                        >
                                            <a>Play with friend</a>
                                        </li>
                                        <li
                                            onClick={() => setMenu(false)}
                                            className="hover:bg-gray-500 text-nowrap p-1 my-2"
                                        >
                                            <Link
                                                to="/trainer"
                                                className="hover:bg-gray-500 text-nowrap p-1 my-2"
                                            >
                                                Learn from Trainer
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className="relative group/item hover:bg-gray-600 hover:text-white py-1 px-2 uppercase text-white">
                                    {" "}
                                    <a>puzzles</a>
                                    <ul className=" hidden bg-gray-600 text-white  group-hover/item:block capitalize  ">
                                        <li
                                            onClick={() => setMenu(false)}
                                            className="hover:bg-gray-500 text-nowrap p-1 my-2 pe-8"
                                        >
                                            <Link to={"/puzzle"}>
                                                puzzle rush
                                            </Link>
                                        </li>
                                        <li
                                            onClick={() => setMenu(false)}
                                            className="hover:bg-gray-500 text-nowrap p-1 my-2"
                                        >
                                            <a href="">puzzle battle</a>
                                        </li>
                                        <li
                                            onClick={() => setMenu(false)}
                                            className="hover:bg-gray-500 text-nowrap p-1 my-2"
                                        >
                                            <a href="">puzzle storm</a>
                                        </li>
                                        <li
                                            onClick={() => setMenu(false)}
                                            className="hover:bg-gray-500 text-nowrap p-1 my-2"
                                        >
                                            <a href="">puzzle racer</a>
                                        </li>
                                    </ul>
                                </li>
                                {/* <li className="relative group/item hover:bg-gray-600 hover:text-white py-1 px-2 uppercase text-white ">
                  {" "}
                  <a className="">learn</a>
                  <ul className=" hidden bg-gray-600 text-white  group-hover/item:block capitalize ">
                    <li onClick={() => setMenu(false)} className="hover:bg-gray-500 text-nowrap p-1 my-2 pe-12">
                      <Link to="/chessLearn">Chess basics</Link>

                    </li>
                    <li onClick={() => setMenu(false)} className="hover:bg-gray-500 text-nowrap p-1 my-2">
                      <a href="">Practice</a>
                    </li>
                    {/* <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                 <a href="">Analysis</a>
               </li>
               <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                 <a href="">Lessons</a>
               </li>
               <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                 <a href="">endgame</a>
               </li> */}
                                {/* </ul>
                {/* <li className="relative  group/item hover:bg-gray-600 hover:text-white py-1 px-2 uppercase hover:">
             {" "}
             <a>watch</a>
             <ul className="absolute z-50 left-0 hidden bg-gray-600 text-white  group-hover/item:block capitalize  ">
               <li className="hover:bg-gray-500 text-nowrap p-1 my-2 pe-16">
                 <a href="">Broadcasts</a>
               </li>
              
               <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                 <a href="">current games</a>
               </li>
               <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                 <a href="">streamers</a>
               </li>
               <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                 <a href="">video library</a>
               </li>
             </ul>
           </li> */}
                                <li className="relative   group/item hover:bg-gray-600 hover:text-white py-1 px-2 uppercase text-white">
                                    {" "}
                                    <a>community</a>
                                    <ul className=" hidden bg-gray-600 text-white  group-hover/item:block capitalize">
                                        <li
                                            onClick={() => setMenu(false)}
                                            className="hover:bg-gray-500 text-nowrap p-1 pe-16 my-2 "
                                        >
                                            <Link to={"/player"} href>
                                                Players
                                            </Link>
                                        </li>
                                        {/* <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                 <a href="">Teams</a>
               </li>
               <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                 <a href="">form</a>
               </li> */}
                                        <li
                                            onClick={() => setMenu(false)}
                                            className="hover:bg-gray-500 text-nowrap p-1 my-2"
                                        >
                                            {/* <Link to={'/blog'} href="">Blog</Link> */}
                                        </li>
                                    </ul>
                                </li>
                                {/* <li className="relative  hover: group/item  hover:bg-gray-600 hover:text-white py-1 px-2 uppercase">
             {" "}
             <a >tools</a>
             <ul className="absolute z-50 left-0 hidden bg-gray-600 text-white  group-hover/item:block capitalize  ">
               <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                 <a href="">Analysis board</a>
               </li>
               <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                 <a href="">Openings</a>
               </li>
               <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                 <a href="">Boards editor</a>
               </li>
               <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                 <a href="">Import game</a>
               </li>
               <li className="hover:bg-gray-500 text-nowrap p-1 my-2">
                 <a href="">advance search</a>
               </li>
             </ul>
           </li> */}
                                <li className="relative text-white   group/item  hover:bg-gray-600 hover:text-white py-1 px-2 uppercase">
                                    {" "}
                                    <a>Tournaments</a>
                                    <ul className="hidden bg-gray-600 text-white  group-hover/item:block capitalize ">
                                        <li
                                            onClick={() => setMenu(false)}
                                            className="hover:bg-gray-500 text-nowrap p-1 my-2"
                                        >
                                            <Link to="/TournamentDetail">
                                                About Tournament
                                            </Link>
                                        </li>
                                        <li
                                            onClick={() => setMenu(false)}
                                            className="hover:bg-gray-500 text-nowrap p-1 my-2"
                                        >
                                            <Link to="/tournaments">
                                                Tournament List
                                            </Link>
                                        </li>
                                    </ul>
                                </li>

                                <li
                                    onClick={() => setMenu(false)}
                                    className="relative text-white   group/item  hover:bg-gray-600 hover:text-white py-1 px-2 uppercase"
                                >
                                    {" "}
                                    <Link to="/chessLearn">Rules</Link>
                                </li>
                                <li
                                    onClick={() => setMenu(false)}
                                    className="relative text-white   group/item  hover:bg-gray-600 hover:text-white py-1 px-2 uppercase"
                                >
                                    {" "}
                                    <Link to="/aboutUs">About us</Link>
                                </li>
                                <li
                                    onClick={() => setMenu(false)}
                                    className="relative text-white   group/item  hover:bg-gray-600 hover:text-white py-1 px-2 uppercase"
                                >
                                    {" "}
                                    <Link to={"/productList"} className=" ">
                                        Product
                                    </Link>
                                </li>

                                <li
                                    onClick={() => setMenu(false)}
                                    className="relative text-white   group/item  hover:bg-gray-600 hover:text-white py-1 px-2 uppercase"
                                >
                                    {" "}
                                    <Link to="/Games">Games</Link>
                                </li>
                                <li
                                    onClick={() => setMenu(false)}
                                    className="relative text-white   group/item  hover:bg-gray-600 hover:text-white py-1 px-2 uppercase"
                                >
                                    {" "}
                                    <Link to="/privacy">Privacy & Policy</Link>
                                </li>
                                <li
                                    onClick={() => setMenu(false)}
                                    className="relative text-white   group/item  hover:bg-gray-600 hover:text-white py-1 px-2 uppercase"
                                >
                                    {" "}
                                    <Link to="/termsCondition">
                                        Terms & Conditions
                                    </Link>
                                </li>
                                <li
                                    onClick={() => setMenu(false)}
                                    className="relative text-white   group/item  hover:bg-gray-600 hover:text-white py-1 px-2 uppercase"
                                >
                                    {" "}
                                    <Link to="/refundCancelationPolicy">
                                        Refund & Cancelation Policy
                                    </Link>
                                </li>
                                <li
                                    onClick={() => setMenu(false)}
                                    className="relative text-white   group/item  hover:bg-gray-600 hover:text-white py-1 px-2 uppercase"
                                >
                                    {" "}
                                    <Link to="/deleteAccount">
                                        Account Delete Request
                                    </Link>
                                </li>

                                {/* <li className="text-yellow-300 hover:text-green-500 py-3 px-2 uppercase">
             {" "}
             <a href="" className=" ">
               Donate
             </a>
           </li>  */}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
            <ModalPlaywithFriend open={isModalOpen} close={closeModal} />
            {/* <HeaderNote className="mt-40"/> */}
        </div>
    );
}

export default Header;
