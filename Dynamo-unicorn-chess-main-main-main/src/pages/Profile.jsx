import React, { useEffect, useRef, useState } from 'react'
import Banner from "../assets/profilebanner.jpg";
import Avatar from "../assets/Avatar.jpeg";
import Coinicon from "../assets/coin-icon.png";
import { MdFacebook } from "react-icons/md";
import { FaTwitter } from "react-icons/fa";
import { FaStar } from 'react-icons/fa';
import { IoLogoInstagram } from "react-icons/io";
import LoadingBar from 'react-top-loading-bar';
import { useQuery } from 'react-query';
import { deleteApiWithToken, getApi, getApiWithToken, postApi, postApiWithToken, postNoDataWithTokenApi } from '../utils/api';
import { Link, useNavigate } from "react-router-dom";
import { formatDate, formatTime, getNotificationdata, getUserdata } from '../utils/getuserdata';
import { PiHandDepositDuotone } from "react-icons/pi";
import { TiUpload, TiDownload } from "react-icons/ti";
import { checkoutHandler } from '../utils/razorpay'
import { toastError, toastInfo, toastSuccess } from '../utils/notifyCustom';
import axios from 'axios';
import { FaFlag } from "react-icons/fa";
const UserDetail = JSON.parse(localStorage.getItem("User Detail"));
const userId = UserDetail?._id;

const Profile = () => {
    const loadingBar = useRef(null);
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [isOpen, setisOpen] = useState(false)
    const [isOpenWithdrawal, setisOpenWithdrawal] = useState(false)
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editInfo, setEditInfo] = useState({
        mobile: "",
        name: "",
        PersonalInfo: ""
    });


    // const [UserId,setUserId]=useState();


    const [amount, setAmount] = useState('');

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };

    const [amountWithdrawal, setAmountWithdrawal] = useState('');

    const handleAmountChangeWithdrawal = (event) => {
        setAmountWithdrawal(event.target.value);
    };



    const url = `${import.meta.env.VITE_URL}${import.meta.env.VITE_PROFILE}`;
    const historyurl = `${import.meta.env.VITE_URL}${import.meta.env.VITE_HISTORY}/${userId}`;
    // const getWalleturl = `${import.meta.env.VITE_URL}${import.meta.env.VITE_GET_WALLET}`;
    const getWalletHistoryUrl = `${import.meta.env.VITE_URL}${import.meta.env.VITE_GET_WALLET_HISTORY}?page=1&limit=4`;
    // const { data, error, isLoading } = useQuery('GETRULE', () => getApiwithtoken(url));

    const { data: queryGetPROFILE, isLoading, error, refetch } = useQuery(
        "getPROFILE",
        () => getApiWithToken(url)
    );

    useEffect(() => {
        if (queryGetPROFILE?.data) {
            setEditInfo({
                mobile: queryGetPROFILE?.data?.mobile || '',
                name: queryGetPROFILE?.data?.name || '',
                PersonalInfo: queryGetPROFILE?.data?.profileInf || '',
            });
        }
    }, [queryGetPROFILE]);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setEditInfo((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            const response = await axios.post(
                "https://chess.dynamochess.in/update-profile-user",
                {
                    mobile: editInfo.mobile,
                    name: editInfo.name,
                    profileInf: editInfo.PersonalInfo,
                },
                {
                    headers: {
                        Authorization: JSON.parse(localStorage.getItem("chess-user-token")),
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response?.data?.success) {
                toastSuccess("Profile updated successfully");
                refetch();
                setShowEditModal(false);
            } else {
                toastError(response?.data?.message || "Failed to save changes");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toastError("Error updating profile");
        }
    };

    //   // Debugging logs
    //   console.log("Loading:", isLoading);
    //   console.log("Error:", error);
    //   console.log("Data:", queryGetPROFILE?.data?.dynamoCoin);
    const GameHistory = useQuery("getGameHistory", () => getApi(historyurl),);
    // const queryGetWallet = useQuery("queryGetWallet", () => getApiWithToken(getWalleturl),);
    const queryGetWalletHistory = useQuery("GetWalletHistory", () => getApiWithToken(getWalletHistoryUrl),);

    // console.log(GameHistory?.data?.data?.data[0]?.analysisData[0]?._id , "gameHistory");
    // console.log(GameHistory?.data?.data?.data, "gameHistory");
    // console.log(queryGetPROFILE.data?.data, "hhhhhhhhhhhhhhh");


    // loading
    const startLoading = () => {
        loadingBar.current.continuousStart();
    };
    const finishLoading = () => {
        loadingBar.current.complete();
    };
    useEffect(() => {
        if (isLoading || GameHistory.isLoading || queryGetWalletHistory.isLoading) {
            startLoading();
        } else {
            finishLoading();
        }
    }, [GameHistory.isLoading, isLoading, queryGetWalletHistory.isLoading]);

    const Logout = () => {
        localStorage.removeItem("chess-user-token");
        localStorage.removeItem("User Detail");

        // localStorage.clear();
        window.location.reload();
        navigate("/")
    }
    const handlejoin = (e, url) => {
        e.preventDefault()
        // window.open(url, '_blank');
        window.location.href = url;

    }
    // console.log(queryGetWalletHistory?.data?.data?.data, "===========<<<<<<<<");
    // const handledeny = async (e, item) => {
    //     try {
    //         e.preventDefault()
    //         const url = `${import.meta.env.VITE_URL1}${import.meta.env.VITE_DELETE}/${item._id}`;
    //         console.log(url, "pppppppppppp")
    //         const res = await postNoDataWithTokenApi(url)
    //         console.log(res, "jjjjjjjj");
    //         //   toastSuccess(data.data.message)
    //     } catch (error) {
    //         console.error('Error fetching user data:', error);
    //     }
    // }

    // if (queryGetPROFILE.data) {
    //     localStorage.setItem("User Detail", JSON.stringify(queryGetPROFILE.data?.data));
    // }


    const handleWithdrawal = async (amount) => {

        try {
            const url = `${import.meta.env.VITE_URL}${import.meta.env.VITE_GET_WALLET_WITHDRAW}`;
            const raw = {
                dynamoCoin: amount,
                type: "withdraw"
            }
            const walletWithdraw = await postApiWithToken(url, raw)
            if (walletWithdraw?.status == 200) {
                toastSuccess(walletWithdraw?.data?.message)
                setisOpenWithdrawal(!isOpenWithdrawal)
                refetch()
                queryGetWalletHistory.refetch()
            } else {
                toastError(walletWithdraw)
                setisOpenWithdrawal(!isOpenWithdrawal)
            }
            // console.log(walletWithdraw, "walletWithdraw=>>>>>>><<<")
        } catch (error) {
            // console.log(error, "walletWithdraw")
        }


    }

    const rezpayBtnClick = async (amount) => {
        setIsButtonDisabled(true);
        try {
            await checkoutHandler(amount)
        } catch (error) {
            console.error("Withdrawal failed", error);
        } finally {
            setIsButtonDisabled(false);
        }
    }

    const [notificationFunData, setNotificationFunData] = useState([]);
    const [polling, setPolling] = useState(true);

    const fetchNotificationData = async () => {
        const notificationdata = await getNotificationdata();
        // console.log("bbbb", notificationdata);
        setNotificationFunData(notificationdata || []);
    };

    useEffect(() => {
        fetchNotificationData();

        let interval = 10000; // Start with 10 seconds
        const intervalId = setInterval(() => {
            if (polling) {
                fetchNotificationData();
                interval *= 1.5; // Increase interval by 50%
            }
        }, interval);

        return () => clearInterval(intervalId);
    }, [polling]);

    const tournamentsuUrl = `${import.meta.env.VITE_URL}${import.meta.env.VITE_GET_MY_TOURNAMENT}`;

    const queryGetTournaments = useQuery("GetTournaments", () => getApiWithToken(tournamentsuUrl),);
    // console.log(queryGetTournaments?.data?.data?.data, "ffff----------->");

    const FORUSERUrl = `${import.meta.env.VITE_URL}${import.meta.env.VITE_GET_ORDER_FORUSER}`;

    const queryGetFORUSER = useQuery("GetFORUSE", () => getApiWithToken(FORUSERUrl),);

    const orders = queryGetFORUSER?.data?.data?.orders

    const handleDelete = async () => {
        // navigate("/deleteAccount")
        try {
            const deleteUserUrl = `${import.meta.env.VITE_URL}${import.meta.env.VITE_DELETE_USER_BY_ID}${userId}`;
            const deleteres=await deleteApiWithToken(deleteUserUrl)
            if(deleteres?.status==200){
                toastSuccess(deleteres?.data?.message)
                localStorage.clear();
                window.location.reload();
                navigate("/")
            }
        } catch (error) {
            console.log(error,"delete user error");
            
        }
    }


console.log(queryGetPROFILE?.data,"llllll");

    return (
        <div>
            <LoadingBar color="#F11946" ref={loadingBar} />
            <div className='w-full px-6 max-sm:px-1 max-sm:mt-0 pb-8 mx-auto mt-2 '>
                <div
                    className="relative flex items-center p-0  overflow-hidden bg-center bg-cover min-h-75 w-full h-72 rounded-md"
                    style={{
                        backgroundImage: `url(${Banner})`,
                        backgroundPositionY: `50%`


                    }}
                >
                    <span className="absolute inset-y-0 w-full h-full bg-center bg-cover  opacity-60" />
                </div>

                <div className="relative flex flex-col flex-auto min-w-0 p-4 mx-6 -mt-16 overflow-hidden break-words shadow-xl rounded-md bg-gray-200 bg-clip-border backdrop-blur-2xl backdrop-saturate-200">
                    <div className="flex flex-wrap -mx-3">
                        <div className="flex-none w-auto max-w-full px-3">
                            <div className="text-base ease-in-out h-18.5 w-18.5 relative inline-flex items-center justify-center rounded-md text-white transition-all duration-300">
                                <img
                                    src={Avatar}
                                    alt="profile_image"
                                    className="w-20 h-20 shadow-sm rounded-md"
                                />
                            </div>
                        </div>
                        <div className="flex-none w-auto max-w-full px-3 my-auto">
                            <div className="h-full">
                                <h5 className="mb-1 font-bold  text-lg  text-[#16884d]">{queryGetPROFILE?.data?.name}</h5>
                                <p className="mb-0 font-semibold leading-normal text-sm">
                                    {queryGetPROFILE?.data?.role}
                                </p>
                            </div>
                        </div>
                        <div className="w-full max-w-full px-3 mx-auto mt-4 sm:my-auto sm:mr-0 md:w-1/2 md:flex-none lg:w-4/12">
                            <div className="relative right-0">
                                <ul
                                    className="relative flex flex-wrap justify-end p-1 list-none bg-transparent rounded-xl"
                                >
                                    {queryGetPROFILE?.data &&
                                        <li className="z-30 flex flex-wrap gap-2">
                                            <button
                                                onClick={Logout}
                                                className="z-30 border border-black w-full bg-black px-2 py-1 mb-0 transition-all border-0 rounded-lg ease-in-out bg-inherit text-white focus:bg-white"

                                            >
                                                Logout
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="z-30 border border-black w-full hover:text-red-500 bg-black px-2 py-1 mb-0 transition-all border-0 rounded-lg ease-in-out bg-inherit text-white focus:bg-red-800"

                                            >
                                                Account Delete
                                            </button>

                                        </li>
                                    }

                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-wrap '>
                    {/* card col-1 */}
                    <div className='w-full lg:w-1/2 max-w-full px-3 mt-6'>
                        <div className="relative flex flex-col h-full min-w-0 break-words bg-gray-200 border-0 shadow-xl rounded-md bg-clip-border">
                            <div className="p-4 pb-0 mb-0 border-b-0 rounded-t-2xl">
                                <div className="flex flex-wrap -mx-3">
                                    {/* Profile Information Title */}
                                    <div className="flex items-center w-full max-w-full px-3 shrink-0 md:w-8/12 md:flex-none">
                                        <h6 className="mb-0 text-2xl">Profile Information</h6>
                                    </div>

                                    {/* Buttons Section */}
                                    <div className="w-full max-w-full px-3 text-right shrink-0 md:w-4/12 md:flex-none relative">
                                        {/* Edit Button */}
                                        <button
                                            className="text-green-800 text-xl p-3"
                                            onClick={() => setShowEditModal(true)} // Open modal
                                        >
                                            Edit
                                        </button>

                                        {/* Flag Button with Tooltip */}
                                        {queryGetPROFILE?.data?.userStatus?.status === "flag" && (
                                            <div className="relative inline-block">
                                                <button
                                                    className="text-red-800 text-xl p-3"
                                                    onMouseEnter={() => setIsHovered(true)}
                                                    onMouseLeave={() => setIsHovered(false)}
                                                >
                                                    <FaFlag />
                                                </button>

                                                {isHovered && (
                                                    <div className="absolute top-full w-48 mt-2  right-0 bg-red-800 text-white text-sm px-4 py-2 rounded shadow-lg z-10">
                                                        {queryGetPROFILE?.data?.userStatus.message}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                    </div>

                                    {/* Edit Profile Tooltip */}
                                    <div className="w-full max-w-full px-3 text-right shrink-0 md:w-4/12 md:flex-none relative">
                                        <a
                                            href="javascript:;"
                                            className="leading-normal text-green-600"
                                            data-target="tooltip_trigger"
                                            data-placement="top"
                                        >
                                            <i className="fas fa-user-edit text-sm" />
                                        </a>

                                        {/* Tooltip */}
                                        <div
                                            className="hidden px-2 py-1 text-center text-white bg-black rounded-lg text-sm absolute top-full mt-2 left-1/2 transform -translate-x-1/2"
                                            role="tooltip"
                                            data-target="tooltip"
                                        >
                                            Edit Profile
                                            <div
                                                className="invisible absolute h-2 w-2 bg-inherit before:visible before:absolute before:h-2 before:w-2 before:rotate-45 before:bg-inherit before:content-['']"
                                                data-popper-arrow=""
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-auto p-4">
                                <p className="leading-normal text-base">
                                    {queryGetPROFILE?.data?.profileInf != "" ? queryGetPROFILE?.data?.profileInf : " Hi, I’m User, Decisions: If you can’t decide, the answer is no.If two equally difficult paths, choose the one more painful in the shortterm (pain avoidance is creating an illusion of equality)."
                                    }
                                </p>
                                <hr className="h-px my-6 bg-transparent bg-gradient-to-r from-transparent via-white to-transparent" />
                                <ul className="flex flex-col pl-0 mb-0 rounded-lg">
                                    <li className="relative block px-4 py-2 pt-0 pl-0 leading-normal  border-0 rounded-t-lg text-base text-inherit">
                                        <strong className="text-slate-700">User Name:</strong> &nbsp;
                                        {queryGetPROFILE?.data?.name}
                                    </li>
                                    {/* <li className="relative block px-4 py-2 pl-0 leading-normal  border-0 border-t-0 text-base text-inherit">
                                        <strong className="text-slate-700">Mobile:</strong> &nbsp;
                                        {queryGetPROFILE?.data?.mobile}
                                    </li> */}
                                    <li className="relative block px-4 py-2 pl-0 leading-normal  border-0 border-t-0 text-base text-inherit">
                                        <strong className="text-slate-700">Email:</strong> &nbsp;
                                        {queryGetPROFILE?.data?.email}

                                    </li>
                                    <li className="relative block px-4 py-2 pl-0 leading-normal  border-0 border-t-0 text-base text-inherit">
                                        <strong className="text-slate-700">Location:</strong> &nbsp; {queryGetPROFILE?.data?.country}
                                    </li>
                                    {/* <li className="relative flex block px-4 py-2 pl-0 leading-normal  border-0 border-t-0 text-base text-inherit">
                                        <strong className="text-slate-700">Rating:</strong> &nbsp;
                                        <p className='pt-1 gap-1 flex text-lg text-yellow-500'>
                                        {queryGetPROFILE?.data?.Rating}

                                        </p>

                                    </li> */}

                                    <li className="relative block px-4 py-2 pl-0 leading-normal border-0 border-t-0 text-base text-inherit">
                                        <strong className="text-slate-700">Rating:</strong> &nbsp;
                                        {queryGetPROFILE?.data?.Rating?.toFixed(2)}
                                    </li>


                                    {/* <li className="relative block px-4 py-2 pb-0 pl-0 border-0 border-t-0 rounded-b-lg text-inherit">
                                        <strong className="leading-normal text-base text-slate-700">
                                            Social:
                                        </strong>{" "}
                                        &nbsp;
                                        <a
                                            className="inline-block py-0 pl-1 pr-2 mb-0 font-bold text-center text-green-600 align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-pro text-xl ease-in bg-none"
                                            >
                                            <MdFacebook />
                                        </a>
                                        <a
                                            className="inline-block py-0 pl-1 pr-2 mb-0 font-bold text-center align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-pro text-xl ease-in bg-none text-green-600"
                                          
                                        >
                                          <FaTwitter />
                                        </a>
                                        <a
                                            className="inline-block py-0 pl-1 pr-2 mb-0 font-bold text-center align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-pro text-xl ease-in bg-none text-green-600"
                                           
                                        >
                                            <IoLogoInstagram />
                                        </a>
                                    </li> */}
                                </ul>
                            </div>
                        </div>

                    </div>
                    {/* card col-1 end */}
                    {/* card col-2 start */}
                    <div className='w-full max-w-full px-3 mt-6 max-md:mt-3 xl:w-1/2'>
                        <div className=" flex flex-col h-full min-w-0 break-words bg-gray-200 border-0 shadow-xl rounded-md bg-clip-border">
                            <div className="p-4 pb-0 mb-0 border-b-0 rounded-t-2xl">
                                <h6 className="mb-0 text-xl ">Notification</h6>
                            </div>
                            <div className=" p-4 w-full">
                                <ul className="overflow-y-auto  bg-white h-64  w-full pl-0  rounded-lg">
                                    {notificationFunData?.map((item, index) => (
                                        <li key={index} className="px-2 py-1 mb-2 w-full flex justify-between  border-0 rounded-md">
                                            <div className='p-2'>
                                                <p className='flex  bg-white'>
                                                    <label>Challenger Name: </label>
                                                    <a className="text-blue-600 pl-2">
                                                        {item.challengerPlayerName}
                                                    </a>
                                                </p>
                                                <p className='flex bg-white'>
                                                    <label>Date Time:</label>
                                                    <span className="text-blue-600 pl-2 text-sm">
                                                        {new Date(item.createdAt).toLocaleString()}
                                                    </span>
                                                </p>
                                            </div>
                                            <p className='p-3'>
                                                <button onClick={(e) => handlejoin(e, item.url)} className=" bg-green-600 text-white rounded-sm p-1 text-sm">
                                                    Join Room</button>
                                                {/* <button onClick={(e)=>handledeny(e,item)}  className=" max-sm:mt-2 ml-1 bg-red-600 text-white rounded-sm p-1 text-sm">                                
                                                   Deny</button> */}
                                            </p>
                                        </li>
                                    ))}
                                </ul>

                            </div>
                        </div>

                    </div>
                    {/* card col-2 end */}


                </div>


            </div>
            <div className='w-full max-w-full px-8 my-2 max-md:mt-3 mb-8'>
                <div className="flex flex-col h-full min-w-0 break-words bg-gray-200 border-0 shadow-xl rounded-md bg-clip-border">
                    <div className="p-4 pb-0 mb-0 border-b-0 rounded-t-2xl">
                        <h6 className="mb-0 text-xl">Tournaments</h6>
                    </div>
                    <div className="p-4 w-full">

                        <div className="bg-white rounded-lg p-4 shadow-md my-4 ">
                            <table className="table-auto w-full ">
                                <div className="bg-white text-gray-900 h-80 overflow-y-auto">

                                    <div className="space-y-4">
                                        {queryGetTournaments?.data?.data?.data.map((tournament, index) => (
                                            <div
                                                onClick={() => navigate(`/LiveTournamentDetail/${tournament._id}`)}

                                                key={index}
                                                className={`flex items-center p-4 rounded-md ${index % 2 === 0 ? 'bg-gray-200' : 'bg-gray-300'}`}
                                            >
                                                <div className="text-2xl mr-4">{tournament.icon}</div>
                                                <div className="flex-grow">
                                                    <h3 className="text-lg font-semibold">{tournament.tournamentName}</h3>
                                                    <p className="text-sm">
                                                        Entry Fees {tournament.entryFees} Coin
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm">Rounds {tournament.noOfRounds}</p>
                                                    <p className="text-xs text-gray-400">{formatDate(tournament.startDate, tournament.time)}, {formatTime(tournament.startDate, tournament.time)}</p>
                                                </div>
                                                <div className="ml-4 text-xl">
                                                    <span role="img" aria-label="players">👥</span>
                                                    <span className="ml-1">{tournament.JoinedPlayerList.length}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full max-w-full px-8 my-4">
                <div className="flex flex-col h-full min-w-0 bg-gray-100 border-0 shadow-xl rounded-md">
                    <div className="p-4 pb-0 border-b bg-white rounded-t-md">
                        <h6 className="text-xl font-bold text-gray-800">Order List</h6>
                    </div>
                    <div className="p-4">
                        <div className="bg-white rounded-lg shadow-md">
                            <div className="overflow-y-auto max-h-80">
                                <table className="table-auto w-full border-collapse">
                                    <thead className="bg-gray-200 sticky top-0 z-10">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-gray-700 font-semibold">Product Image</th>
                                            <th className="px-6 py-3 text-left text-gray-700 font-semibold">Product Name</th>
                                            <th className="px-6 py-3 text-left text-gray-700 font-semibold">Price</th>
                                            <th className="px-6 py-3 text-left text-gray-700 font-semibold">Status</th>
                                            <th className="px-6 py-3 text-left text-gray-700 font-semibold">Expected Delivery</th>
                                            <th className="px-6 py-3 text-left text-gray-700 font-semibold">Address</th>
                                            <th className="px-6 py-3 text-left text-gray-700 font-semibold">City</th>
                                            <th className="px-6 py-3 text-left text-gray-700 font-semibold">Postcode</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders?.map((order, index) => (
                                            <tr
                                                key={order._id}
                                                className={`cursor-pointer transition-all ${index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'
                                                    } hover:bg-gray-300`}
                                            >
                                                <td className="px-6 py-4 text-gray-800">
                                                    <img
                                                        src={order.items[0]?.img || "https://via.placeholder.com/50"}
                                                        alt="Product"
                                                        className="w-16 h-16 object-cover rounded shadow"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 font-medium text-gray-800">
                                                    {order.items[0]?.productName || "N/A"}
                                                </td>
                                                <td className="px-6 py-4 text-gray-800 font-semibold">
                                                    ₹{order.items[0]?.price || "0"}
                                                </td>
                                                <td className="px-6 py-4 text-gray-800">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === "Pending"
                                                            ? "bg-yellow-200 text-yellow-700"
                                                            : order.status === "Delivered"
                                                                ? "bg-green-200 text-green-700"
                                                                : "bg-red-200 text-red-700"
                                                            }`}
                                                    >
                                                        {order.status || "N/A"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-800">
                                                    {new Date(order.expectedDeliveryDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-gray-800">{order.billingDetails?.address || "N/A"}</td>
                                                <td className="px-6 py-4 text-gray-800">{order.billingDetails?.city || "N/A"}</td>
                                                <td className="px-6 py-4 text-gray-800">{order.billingDetails?.postcode || "N/A"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Game wallet */}
            <div className='w-full max-w-full px-8 my-2 max-md:mt-3'>
                <div className="flex flex-col h-full min-w-0 break-words bg-gray-200 border-0 shadow-xl rounded-md bg-clip-border">
                    <div className="p-4 pb-0 mb-0 border-b-0 rounded-t-2xl">
                        <h6 className="mb-0 text-xl">Wallet</h6>
                    </div>
                    <div className="p-4 w-full">
                        <div className="lg:flex gap-4 items-stretch">
                            <div className="bg-white md:p-2 p-6 rounded-lg border border-gray-200 mb-4 lg:mb-0 shadow-md lg:w-[35%]">
                                <div className="flex justify-center items-center space-x-5 h-full">
                                    <div>
                                        <p>Your Dynamo Coin</p>
                                        <h2 className="text-4xl font-bold text-gray-600 flex">{queryGetPROFILE?.data?.dynamoCoin} <span className='flex'><img className='w-12 h-10' src={Coinicon} alt="Coinicon" /></span></h2>


                                        {/* <p>25.365 ₹</p> */}
                                    </div>
                                    <img src="https://www.emprenderconactitud.com/img/Wallet.png" alt="wallet" className="h-24 md:h-20 w-38" />
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg xs:mb-4 max-w-full shadow-md lg:w-[65%]">
                                <div className="flex flex-wrap justify-between h-full">
                                    <div onClick={() => setisOpen(!isOpen)} className="flex-1 bg-gradient-to-r bg-green-600 rounded-lg flex flex-col items-center justify-center p-4 space-y-2 border border-gray-200 m-2">
                                        <TiDownload size={30} />
                                        <p className="text-white">Deposit</p>
                                    </div>
                                    <div onClick={() => setisOpenWithdrawal(!isOpenWithdrawal)} className="flex-1 bg-gradient-to-r bg-green-600 rounded-lg flex flex-col items-center justify-center p-4 space-y-2 border border-gray-200 m-2">

                                        <TiUpload size={30} />
                                        <p className="text-white">Withdrawal</p>
                                    </div>
                                    {/* <div className="flex-1 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-lg flex flex-col items-center justify-center p-4 space-y-2 border border-gray-200 m-2">
                                        <i className="fas fa-qrcode text-white text-4xl"></i>
                                        <p className="text-white">Canjear</p>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-md my-4" style={{
                            overflow: 'hidden',
                            overflowX: 'scroll',
                        }}>
                            <table className="table-auto w-full">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left border-b-2 w-full">
                                            <h2 className="text-ml font-bold text-gray-600">Transacciones</h2>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {queryGetWalletHistory?.data?.data?.data.map((transaction, index) => (
                                        <tr key={index} className="border-b w-full">
                                            <td className="px-4 py-2 text-left align-top w-1/2">
                                                <div>
                                                    <h2>{transaction.type}</h2>
                                                    <p>{new Date(transaction.date).toLocaleDateString()}</p>
                                                </div>
                                            </td>

                                            <td className={`px-4 py-2 text-right ${transaction.type === "deposit" ? "text-green-600" : "text-red-600"} w-1/2`}>
                                                <div>
                                                    <h2>dynamoCoin</h2>
                                                    <p className="flex justify-end items-center">
                                                        <span className="flex items-center">
                                                            {transaction.dynamoCoin}
                                                            <img className="w-7 h-6 ml-1" src={Coinicon} alt="Coinicon" />
                                                        </span>
                                                    </p>
                                                </div>

                                            </td>
                                            <td className={`px-4 py-2 text-right ${transaction.type === "deposit" ? "text-green-600" : "text-red-600"} w-1/2`}>
                                                <div>
                                                    <h2>Balance</h2>
                                                    <p className="flex justify-end items-center">
                                                        <span className="flex items-center">
                                                            {transaction.balance}
                                                            ₹
                                                            {/* <img className="w-7 h-6 ml-1" src={Coinicon} alt="Coinicon" /> */}
                                                        </span>
                                                    </p>
                                                </div>

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        {/* Content goes here */}
                                        <div className="mb-6">
                                            <label className="block mb-2 text-sm font-medium text-gray-900">Amount</label>
                                            <input
                                                onChange={handleAmountChange}
                                                type="number"
                                                id="amount"
                                                value={amount}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                placeholder=""
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button disabled={isButtonDisabled} onClick={() => rezpayBtnClick(amount)} type="button" className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto">
                                        {isButtonDisabled ? 'Submitting...' : 'Submit'}
                                    </button>
                                    <button onClick={() => setisOpen(!isOpen)} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isOpenWithdrawal && (
                <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        {/* Content goes here */}
                                        <div className="mb-6">
                                            <label className="block mb-2 text-sm font-medium text-gray-900">Dynamo Coin</label>
                                            <input
                                                onChange={handleAmountChangeWithdrawal}
                                                type="number"
                                                id="amount"
                                                value={amountWithdrawal}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                placeholder=""
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button onClick={() => handleWithdrawal(amountWithdrawal)} type="button" className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto">
                                        Submit
                                    </button>
                                    <button onClick={() => setisOpenWithdrawal(!isOpenWithdrawal)} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-md w-96">
                        <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 mb-1">User Name</label>
                                <input
                                    name='name' value={editInfo.name} onChange={handleOnChange}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"

                                />
                            </div>



                            <div >
                                <label className="block text-gray-700 mb-1">Mobile Number</label>
                                <input name='mobile' value={editInfo.mobile} onChange={handleOnChange}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"

                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1">PersonalInfo</label>
                                <textarea
                                    name='PersonalInfo' value={editInfo.PersonalInfo} onChange={handleOnChange}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"

                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button

                                className="px-4 py-2 bg-gray-300 rounded-md"
                                onClick={() => setShowEditModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-green-600 text-white rounded-md"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}




            {/* Game history */}
            <h1 className='mx-10 font-bold my-3 '>Game History</h1>
            <div className="w-full flex justify-center mb-4">
                <div className='w-full  mx-8 h-96 overflow-y-auto  text-black mt-2 overflow-x-auto bg-clip-border backdrop-blur-2xl backdrop-saturate-200 border-0 shadow-xl rounded-md'>

                    <table className="min-w-full">
                        <thead className='sticky top-0'>
                            <tr className="bg-gray-200 text-left">
                                {/* <th className="py-2 px-4">Name</th> */}
                                <th className="py-2 px-4">Date</th>
                                <th className="py-2 px-4">Opponent Name</th>
                                <th className="py-2 px-4">Game Status</th>
                                <th className="py-2 px-4">Score</th>
                                <th className="py-2 px-4">Analyses</th>
                                {/* <th className="py-2 px-4"></th> */}
                            </tr>
                        </thead>
                        <tbody className='bg-gray-400'>
                            {GameHistory?.data?.data?.data
                                ?.sort((a, b) => new Date(b.analysisData[0]?.createdAt) - new Date(a.analysisData[0]?.createdAt)) // Sort by date, descending order
                                .map((game, index) => (
                                    <tr key={index} className="border-b border-gray-800">
                                        <td className="py-3 px-4">{new Date(game.analysisData[0]?.createdAt).toDateString()}</td>
                                        <td className="py-3 px-4">
                                            {game.analysisData[0]?.players
                                                .filter(player => player.playerId !== userId) // Filter out the player with the current user ID
                                                .map(player => player.name) // Map to get the opponent's name
                                                .join(', ') || 'Opponent not found'}
                                        </td>
                                        <td className="py-3 px-4">
                                            {game.analysisData[0].DrawStatus ? "Draw" : game.analysisData[0].winner === userId ? "Win" : "Lose"}
                                        </td>
                                        <td className="py-3 px-4">
                                            {
                                                game.analysisData[0].DrawStatus ? "1/2 - 1/2" 
                                                :
                                             game.analysisData[0]?.players.filter(player => player.colour == "b").map(player => game.analysisData[0].winner === player.playerId ? "0-1" : "1-0")
                                            }
                                        </td>
                                        <td className="py-3 px-4">
                                            <span onClick={() => navigate(`/analysisBoard/${game.analysisData[0]._id}`)} className='cursor-pointer hover:text-gray-700'>Analyze</span>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    )
}

export default Profile

