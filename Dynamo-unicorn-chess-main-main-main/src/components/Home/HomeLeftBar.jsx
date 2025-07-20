import React, { useEffect, useState } from "react";
import { AiFillThunderbolt } from "react-icons/ai";
import { FaPlusCircle } from "react-icons/fa";
import { IoIosRocket } from "react-icons/io";
import { MdOutlineTimer } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { minutesToSeconds } from "../../utils/getuserdata";

function HomeLeftBar() {
    const [customClick, setCustomClicked] = useState(false);
    const [rangeClick, setRangeClicked] = useState(10);
    const [time, setTime] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedTitle, setSelectedTitle] = useState("");
    const [customTime, setCustomTime] = useState(null);
    const navigate = useNavigate();

    const customeHandler = () => {
        setCustomClicked(!customClick);
        setSelectedTime(null); // Reset selected time when switching to custom
        setSelectedTitle(""); // Reset selected title when switching to custom
    };

    const rangeFunc = (value) => {
        setRangeClicked(value);
        setCustomTime(value);
    };

    const handleTimeClick = async (time, title) => {
        setSelectedTime(time);
        setSelectedTitle(title);
        const timeinSeconds = await minutesToSeconds(time);
        // console.log(finalSelectedTime,"ffffff=...",timeinSeconds);
        // alert(`Selected time: ${finalSelectedTime}`);
        navigate(`/multiplayer/randomMultiplayer/${timeinSeconds}`);
        setCustomTime(null); // Reset custom time selection when selecting predefined time
        // console.log("lll",customClick);
        if (customClick === true) {
            // console.log("customClick",customClick);
            setCustomClicked(!customClick);
        }
    };

    const handlePlayClick = async () => {
        const finalSelectedTime = selectedTime || customTime;

        if (finalSelectedTime) {
            const timeinSeconds = await minutesToSeconds(finalSelectedTime);
            // console.log(finalSelectedTime,"ffffff=...",timeinSeconds);
            // alert(`Selected time: ${finalSelectedTime}`);
            window.location.href = `/multiplayer/randomMultiplayer/${timeinSeconds}`;
            // navigate(`/multiplayer/randomMultiplayer/${timeinSeconds}`);
            // navigate(`/multiplayer/${finalSelectedTime}`);
        } else {
            alert("Please select a time.");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `${import.meta.env.VITE_URL}${
                    import.meta.env.VITE_GET_TIME
                }`;
                const response = await axios.get(url);
                if (response) {
                    setTime(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <div className="mx-2 w-80">
                <div className="">
                    {Array.isArray(time) &&
                        [...time]
                            .sort((a, b) => {
                                const order = ["Bullet", "Blitz", "Rapid"];
                                return (
                                    order.indexOf(a.title) -
                                    order.indexOf(b.title)
                                );
                            })
                            .map((currentTime, index) => (
                                <div key={index} className="my-2">
                                    {/* Title Section */}
                                    <div
                                        className={`py-1 flex justify-between cursor-pointer rounded-md bg-gray-600 bg-opacity-80 ${
                                            selectedTitle === currentTime.title
                                                ? "bg-gray-800"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleTimeClick(
                                                currentTime.time1,
                                                currentTime.title
                                            )
                                        } // Set initial time selection
                                    >
                                        <div className="flex gap-1 px-2">
                                            <div className="flex items-center text-yellow-400 text-xl">
                                                {currentTime.title ===
                                                "Blitz" ? (
                                                    <AiFillThunderbolt />
                                                ) : currentTime.title ===
                                                  "Rapid" ? (
                                                    <MdOutlineTimer />
                                                ) : (
                                                    <IoIosRocket />
                                                )}
                                            </div>
                                            <h1 className="text-yellow-300 text-xl">
                                                {currentTime.title}
                                            </h1>
                                        </div>
                                    </div>

                                    {/* Times Section */}
                                    <div className="grid grid-cols-3 gap-2 my-2 text-green-400">
                                        {[
                                            currentTime.time1,
                                            currentTime.time2,
                                            currentTime.time3,
                                        ].map((timeValue, idx) => (
                                            <p
                                                key={idx}
                                                className={`bg-gray-600 text-center rounded-md py-3 cursor-pointer ${
                                                    selectedTime ===
                                                        timeValue &&
                                                    selectedTitle ===
                                                        currentTime.title
                                                        ? "bg-gray-800"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    handleTimeClick(
                                                        timeValue,
                                                        currentTime.title
                                                    )
                                                }
                                            >
                                                {timeValue} min
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            ))}

                    <div className="">
                        <div
                            onClick={customeHandler}
                            className="py-1 flex justify-center cursor-pointer rounded-md bg-gray-600"
                        >
                            <div className="flex justify-center gap-1 px-2">
                                <div className="flex items-center justify-center mr-1 text-xl text-[#FFD700]">
                                    <FaPlusCircle />
                                </div>
                                <h1 className="text-yellow-300 text-center text-xl">
                                    Custom
                                </h1>
                            </div>
                        </div>
                        {customClick && (
                            <div className="relative mb-6">
                                <label
                                    htmlFor="labels-range-input"
                                    className="sr-only"
                                >
                                    Labels range
                                </label>
                                <input
                                    onChange={(e) => rangeFunc(e.target.value)}
                                    id="labels-range-input"
                                    type="range"
                                    defaultValue={10}
                                    value={rangeClick}
                                    min={10}
                                    step={20}
                                    max={120}
                                    className="w-full accent-green-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                />
                                <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-0 -translate-x-1/3 rtl:translate-x-1/3 -bottom-6">
                                    10min
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-1/4 -translate-x-2/3 rtl:translate-x-2/3 -bottom-6">
                                    30min
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-1/3 -translate-x-1/6 rtl:translate-x-1/6 -bottom-6">
                                    50min
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-1/2 -translate-x-1/6 rtl:translate-x-1/6 -bottom-6">
                                    70min
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400 absolute end-1/4 translate-x-1/3 rtl:translate-x-1/6 -bottom-6">
                                    90min
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6">
                                    110min
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="text-center">
                        <button
                            onClick={handlePlayClick}
                            className="bg-green-600 border-none text-white font-bold text-2xl p-2 rounded-md w-full h-14"
                        >
                            Play
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeLeftBar;
