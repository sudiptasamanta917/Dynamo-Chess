import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaGooglePlay, FaHandshake } from "react-icons/fa";
import { FaEarthAfrica } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
// import { RiRobot2Fill } from 'react-icons/ri'
import { Link, useNavigate } from "react-router-dom";
import playingLogo from "../../assets/playing_chess.png";
import Avatar from "../../assets/Avatar.jpeg";
import { LazyLoadImage } from "react-lazy-load-image-component";

import ModalPlaywithFriend from "./ModalPlaywithFriend";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { getApi, postApiWithFormdata } from "../../utils/api";
import { useQuery } from "react-query";
import LoadingBar from "react-top-loading-bar";
import { getUserdata } from "../../utils/getuserdata";
import { toastInfo, toastSuccess } from "../../utils/notifyCustom";
import { v4 as uuidv4 } from "uuid";
import HomeLeftBar from "./HomeLeftBar";

function HomeRightBar() {
    const [showOptions, setShowOptions] = useState(false); // for open or close play online button..............
    const inputId = uuidv4();
    const loadingBar = useRef(null);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const url = `${import.meta.env.VITE_URL}${import.meta.env.VITE_GET_ONLINE}`;
    // console.log(url, "vvvv");
    const queryGetonline = useQuery("getONLINE", () => getApi(url));

    // console.log(queryGetonline?.data?.data, "ffffffffff");
    const startLoading = () => {
        loadingBar.current.continuousStart();
    };
    const finishLoading = () => {
        loadingBar.current.complete();
    };
    useEffect(() => {
        if (queryGetonline.isLoading) {
            startLoading();
        } else {
            finishLoading();
        }
    }, [queryGetonline.isLoading]);
    const itemsdata = Array.isArray(queryGetonline?.data?.data)
        ? queryGetonline.data.data
        : [];

    const user = getUserdata();

    const hendelChallenge = useCallback(
        async (e, toid) => {
            try {
                e.preventDefault();
                if (isExecuting) {
                    toastInfo("notification already sent Successfully");
                } else {
                    setIsExecuting(true);

                    const protocol = window.location.protocol;
                    const host = window.location.host;
                    const uniqueIdurl = `${protocol}//${host}/multiplayer/${inputId}/1200`;
                    const user = await getUserdata();
                    const url = `${import.meta.env.VITE_URL}${
                        import.meta.env.VITE_CHALLENGE
                    }`;
                    // console.log(toid, user._id, url, uniqueIdurl, "gggggggg");

                    if (toid !== user._id) {
                        const raw = {
                            fromUserId: user._id,
                            toUserId: toid,
                            url: uniqueIdurl,
                            challengeId: inputId,
                        };

                        const response = await postApiWithFormdata(url, raw);

                        if (response.data.success) {
                            toastSuccess("Successfully sent notification");
                            // window.open(uniqueIdurl, '_blank');
                            window.location.href = uniqueIdurl;
                        }
                    } else {
                        toastInfo("Notification not sent");
                    }
                }
            } catch (error) {
                // console.log("CHALLENGE", error);
            } finally {
                setTimeout(() => {
                    setIsExecuting(false);
                }, 120000); // 120,000 milliseconds = 2 minutes
                // 2000ms delay before resetting the flag
            }
        },
        [isExecuting, inputId]
    );
    // console.log(isExecuting, "vvvvvvvvvvvv");
    const hendelOnlineGame = () => {
        // /multiplayer/randomMultiplayer/1500
        const protocol = window.location.protocol;
        const host = window.location.host;
        const uniqueIdurl = `${protocol}//${host}/multiplayer/randomMultiplayer/1500`;
        window.location.href = uniqueIdurl;
    };
    return (
        <div className="">
            <LoadingBar color="#F11946" ref={loadingBar} />
            <div className="flex flex-col items-center font-bold lg:pt-10">
                <div className="text-center lg:w-80 w-60 lg:text-4xl text-2xl lg:mb-5 mb-3 text-[#fade47]">
                    Play Chess
                </div>
                <div className="">
                    <div className="flex justify-center">
                        <button
                            onClick={() => setShowOptions(!showOptions)}
                            className={`lg:h-16 h-12 lg:w-80 w-60 mb-2 rounded-2xl ${
                                showOptions ? "bg-gray-500" : "bg-[#6ca732]"
                            } hover:bg-[#a3d160] shadow-md shadow-green-400/40 hover:shadow-green-500/50 hover:ring-inset px-4 py-2 transition-all duration-300`}
                        >
                            <div className="flex gap-2 h-full items-center justify-center lg:text-[25px] text-[15px]">
                                <LazyLoadImage
                                    src={playingLogo}
                                    alt=""
                                    className="w-10 h-10"
                                />
                                <div className="text-white text-center font-sans">
                                    Play Online
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* ▼ Animated dropdown */}
                    <div
                        className={`transition-all duration-500 ease-in-out overflow-hidden mb-4 ${
                            showOptions
                                ? "max-h-[1000px] opacity-100 scale-100"
                                : "max-h-0 opacity-0 scale-95"
                        }`}
                    >
                        {showOptions && (
                            <div className="w-full flex flex-col items-center">
                                <div className="flex justify-center">
                                    <button
                                        onClick={hendelOnlineGame}
                                        className="h-14 lg:w-80 w-60 mb-4 rounded-md bg-[#6ca732] hover:bg-[#a3d160] px-4 py-3 transition-all duration-300"
                                    >
                                        <div className="flex gap-2 h-full items-center justify-center lg:text-[25px] text-[15px] text-white">
                                            ▶ Play Now
                                        </div>
                                    </button>
                                </div>
                                <HomeLeftBar />
                            </div>
                        )}
                    </div>
                    <div className="flex justify-center">
                        <Link
                            to="/chess10by10"
                            className="lg:h-16 h-12 lg:w-80 w-60 mb-6 rounded-2xl bg-[#4d4b49] hover:bg-[#6F6D6B] shadow-md 
                          shadow-gray-600/60
                          hover:shadow-md 
                          hover:shadow-gray-500/50         
                          hover:ring-inset 
                          px-4 py-3
                          transition-all duration-300"
                        >
                            <div className="flex gap-2 h-full items-center justify-center lg:text-[25px] text-[15px]">
                                <div>
                                    <FaEarthAfrica className="text-white w-7 h-7" />
                                </div>
                                <div className="font-sans text-white text-center">
                                    Play Offline
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="flex justify-center">
                        <div
                            className="lg:h-16 h-12 lg:w-80 w-60 mb-6 rounded-2xl bg-[#6ca732] hover:bg-[#a3d160] cursor-pointer shadow-md 
                          shadow-green-400/40
                          hover:shadow-md 
                          hover:shadow-green-500/50        
                          hover:ring-inset 
                          px-4 py-3
                          transition-all duration-300"
                        >
                            <div
                                onClick={openModal}
                                className="flex gap-2 h-full items-center justify-center lg:text-[25px] text-[15px]"
                            >
                                <div className="text-3xl">
                                    <FaHandshake className="text-white" />
                                </div>
                                <div className="font-sans text-white text-center m-0">
                                    Play with Friend
                                </div>
                            </div>

                            <ModalPlaywithFriend
                                open={isModalOpen}
                                close={closeModal}
                            />
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <Link
                            to="/trainer"
                            className="lg:h-16 h-12 lg:w-80 w-60 lg:mb-4 mb-3 rounded-2xl bg-[#4d4b49] hover:bg-[#6F6D6B] shadow-md 
                          shadow-gray-600/60
                          hover:shadow-md 
                          hover:shadow-gray-500/50        
                          hover:ring-inset 
                          px-4 py-3
                          transition-all duration-300"
                        >
                            <div className="flex gap-1 h-full items-center justify-center lg:text-[25px] text-[15px]">
                                <div className="ms-2">
                                    <LiaChalkboardTeacherSolid className="text-white text-3xl" />
                                </div>
                                <div className="font-sans text-white text-center">
                                    Learn from Trainer
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="mx-3 mt-2">
                <h2 className="lg:text-xl text-md text-center font-semibold text-[#fade47]">
                    Active Players (
                    {`${
                        itemsdata.length == 0
                            ? itemsdata.length
                            : itemsdata.length - 1
                    }`}
                    )
                </h2>
                <div className="w-full lg:mt-6 mt-3 rounded-md lg:h-32 h-20 overflow-y-auto">
                    {itemsdata &&
                        itemsdata.map((item, index) => (
                            <div
                                key={index}
                                className="flex pt-2 justify-between"
                            >
                                {item && user && item._id !== user._id ? (
                                    <>
                                        <div
                                            className="flex cursor-pointer"
                                            onClick={() =>
                                                navigate(
                                                    `/userprofile/${item._id}`
                                                )
                                            }
                                        >
                                            <GoDotFill className="mt-4 text-green-700 mr-2" />
                                            <img
                                                src={Avatar}
                                                alt="Avatar"
                                                className="mt-2 h-10 w-10 rounded-full object-cover"
                                            />
                                            <span className="text-xs p-2">
                                                <p>{item.username}</p>
                                            </span>
                                        </div>
                                        <a
                                            onClick={(e) =>
                                                hendelChallenge(e, item._id)
                                            }
                                            className="px-3 pt-2 text-green-600 font-semibold cursor-pointer"
                                        >
                                            Challenge
                                        </a>
                                    </>
                                ) : (
                                    ""
                                )}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

export default HomeRightBar;
