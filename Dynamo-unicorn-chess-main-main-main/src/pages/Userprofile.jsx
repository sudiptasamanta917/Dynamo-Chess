import React, { useCallback, useEffect, useRef, useState } from 'react'
import Banner from "../assets/profilebanner.jpg";
import Avatar from "../assets/Avatar.jpeg";
import { MdFacebook } from "react-icons/md";
import { FaTwitter } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io";
import LoadingBar from 'react-top-loading-bar';
import { useQuery } from 'react-query';
import { getApi, getApiWithToken, postApiWithFormdata } from '../utils/api';
import { useNavigate ,useParams} from "react-router-dom";
import { FaStar } from 'react-icons/fa6';
import { toastInfo, toastSuccess } from '../utils/notifyCustom';
import { getUserdata } from '../utils/getuserdata';
import { v4 as uuidv4 } from 'uuid';
const Userprofile = () => {
    const loadingBar = useRef(null);
    const navigate = useNavigate();
    const { userId } = useParams();
    // console.log(userId,"vvvvvvvvvvvvvvvvvvvvvvvgggggggggg");
    const url = `${import.meta.env.VITE_URL}${import.meta.env.VITE_GET_USER_BY_ID}/${userId}`;
    // const { data, error, isLoading } = useQuery('GETRULE', () => getApiwithtoken(url));
    // console.log(data?.data?.data, "hhhhhhhhhhhhhhh");

    const queryGET_USER_PROFILE = useQuery("GET_USER_PROFILE", () => getApi(url),);


    console.log(queryGET_USER_PROFILE.data?.data?.data?.name, "hhhhhhhhhhhhhhhvvvvvvvv");

    // loading
    const startLoading = () => {
        loadingBar.current.continuousStart();
    };
    const finishLoading = () => {
        loadingBar.current.complete();
    };
    useEffect(() => {
        if (queryGET_USER_PROFILE.isLoading) {
            startLoading();
        } else {
            finishLoading();
        }
    }, [queryGET_USER_PROFILE.isLoading]);

    const [isExecuting, setIsExecuting] = useState(false);
    const inputId = uuidv4();
    const hendelChallenge = useCallback(async (e, toid) => {
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
            const url = `${import.meta.env.VITE_URL}${import.meta.env.VITE_CHALLENGE}`;
            // console.log(toid, user._id, url, uniqueIdurl, "gggggggg");
    
            if (toid !== user._id) {
              const raw = {
                "fromUserId": user._id,
                "toUserId": toid,
                "url": uniqueIdurl,
                "challengeId": inputId,
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
          console.log("CHALLENGE", error);
        } finally {
          setTimeout(() => {
            setIsExecuting(false);
          }, 120000); // 120,000 milliseconds = 2 minutes
          // 2000ms delay before resetting the flag
        }
      }, [isExecuting, inputId]);
      console.log(queryGET_USER_PROFILE.data,"profileInf");
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

                <div className="relative flex flex-col flex-auto min-w-0 p-4 mx-6 -mt-16 overflow-hidden break-words border-0 shadow-xl rounded-md bg-gray-200 bg-clip-border backdrop-blur-2xl backdrop-saturate-200">
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
                                <h5 className="mb-1 font-bold  text-lg  text-[#16884d]">{queryGET_USER_PROFILE.data?.data?.data?.name}</h5>
                                <p className="mb-0 font-semibold leading-normal text-sm">
                                    {queryGET_USER_PROFILE.data?.data?.data?.username}
                                </p>
                            </div>
                        </div>
                        <div className="w-full max-w-full px-3 mx-auto mt-4 sm:my-auto sm:mr-0 md:w-1/2 md:flex-none lg:w-4/12">
                            <div className="relative right-0">
                                <ul
                                    className="relative flex flex-wrap justify-end p-1 list-none bg-transparent rounded-xl"
                                >
                                    {queryGET_USER_PROFILE.data?.data &&
                                        <li className="z-30 ">
                                            <button
                                            onClick={(e) => hendelChallenge(e, queryGET_USER_PROFILE.data?.data?.data?._id)}
                                               
                                                className="z-30 block w-full bg-green-600 px-2 py-1 mb-0 transition-all border-0 rounded-lg ease-in-out text-white "

                                            >
                                                Challenge
                                            </button>

                                        </li>
                                    }

                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-wrap -mx-3 '>
                    {/* card col-1 */}
                    <div className='w-full max-w-full px-3 mt-6'>
                        <div className="relative flex flex-col h-full min-w-0 break-words bg-gray-200 border-0 shadow-xl rounded-md bg-clip-border">
                            <div className="p-4 pb-0 mb-0  border-b-0 rounded-t-2xl">
                                <div className="flex flex-wrap -mx-3">
                                    <div className="flex items-center w-full max-w-full px-3 shrink-0 md:w-8/12 md:flex-none">
                                        <h6 className="mb-0 text-2xl ">Profile Information</h6>
                                    </div>
                                    <div className="w-full max-w-full px-3 text-right shrink-0 md:w-4/12 md:flex-none">
                                        <a
                                            href="javascript:;"
                                            data-target="tooltip_trigger"
                                            data-placement="top"
                                        >
                                            <i className="leading-normal fas fa-user-edit text-sm text-green-600" />
                                        </a>
                                        <div
                                            data-target="tooltip"
                                            className="hidden px-2 py-1 text-center text-white bg-black rounded-lg text-sm"
                                            role="tooltip"
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
                                    {queryGET_USER_PROFILE.data?.data?.data?.profileInf===""?queryGET_USER_PROFILE.data?.data?.data?.profileInf:" Hi, I’m User, Decisions: If you can’t decide, the answer is no.If two equally difficult paths, choose the one more painful in the shortterm (pain avoidance is creating an illusion of equality)."
                                    }
                           
                                </p>
                                <hr className="h-px my-6 bg-transparent bg-gradient-to-r from-transparent via-white to-transparent" />
                                <ul className="flex flex-col pl-0 mb-0 rounded-lg">
                                    <li className="relative block px-4 py-2 pt-0 pl-0 leading-normal  border-0 rounded-t-lg text-base text-inherit">
                                        <strong className="text-slate-700">User Name:</strong> &nbsp;
                                        {queryGET_USER_PROFILE.data?.data?.data.name}
                                    </li>
                                    <li className="relative block px-4 py-2 pl-0 leading-normal  border-0 border-t-0 text-base text-inherit">
                                        <strong className="text-slate-700">Email:</strong> &nbsp;
                                        {queryGET_USER_PROFILE.data?.data?.data.email}

                                    </li>
                                    <li className="relative block px-4 py-2 pl-0 leading-normal  border-0 border-t-0 text-base text-inherit">
                                        <strong className="text-slate-700">Location:</strong> &nbsp; INDIA
                                    </li>
                                    <li className="relative flex  px-4 py-2 pl-0 leading-normal  border-0 border-t-0 text-base text-inherit">
                                        <strong className="text-slate-700">Rating:</strong> &nbsp;
                                        <p className='pt-1 gap-1 flex text-lg text-yellow-500'>
                                            <FaStar />
                                            <FaStar />
                                            <FaStar />
                                            <FaStar />
                                            <FaStar />

                                        </p>

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
                    {/* <div className='w-full max-w-full px-3 mt-6 max-md:mt-2 xl:w-6/12'>
                        <div className="relative flex flex-col h-full min-w-0 break-words bg-gray-200 border-0 shadow-xl rounded-md bg-clip-border">
                            <div className="p-4 pb-0 mb-0 border-b-0 rounded-t-2xl">
                                <h6 className="mb-0 text-xl ">Conversations</h6>
                            </div>
                            <div className="flex-auto p-4">
                                <ul className="flex flex-col pl-0 mb-0 rounded-lg">
                                    <li className="relative flex items-center  p-2 mb-2 bg-white border-0 rounded-md text-inherit">
                                        <div className="inline-flex items-center justify-center w-12 h-12 mr-4 text-white transition-all duration-200 text-base ease-in-out rounded-xl">
                                            <img
                                                src={Avatar}
                                                alt="kal"
                                                className="w-full shadow-2xl rounded-md"
                                            />
                                        </div>
                                        <div className="flex flex-col items-start justify-center">
                                            <h6 className="mb-0 leading-normal text-md">User1</h6>
                                            <p className="mb-0 leading-tight text-sm">
                                                Hi! I need more information..
                                            </p>
                                        </div>
                                        <a
                                            className="inline-block py-3 pl-0 pr-4 mb-0 ml-auto font-bold text-center uppercase align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-pro text-xs ease-in hover:scale-102 hover:active:scale-102 active:opacity-85 text-[#16884d] hover:text-[#168846] hover:shadow-none active:scale-100"
                                            href="javascript:;"
                                        >
                                            Reply
                                        </a>
                                    </li>
                                    <li className="relative flex items-center  p-2 mb-2 bg-white rounded-md border-0 border-t-0 text-inherit">
                                        <div className="inline-flex items-center justify-center w-12 h-12 mr-4 text-white transition-all duration-200 text-base ease-in-out rounded-xl">
                                            <img
                                                src={Avatar}
                                                alt="kal"
                                                className="w-full shadow-2xl rounded-md"
                                            />
                                        </div>
                                        <div className="flex flex-col items-start justify-center">
                                            <h6 className="mb-0 leading-normal text-md">User2</h6>
                                            <p className="mb-0 leading-tight text-sm">Awesome work, can you..</p>
                                        </div>
                                        <a
                                            className="inline-block py-3 pl-0 pr-4 mb-0 ml-auto font-bold text-center uppercase align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-pro text-xs ease-in hover:scale-102 hover:active:scale-102 active:opacity-85 text-[#16884d] hover:text-[#168846] hover:shadow-none active:scale-100"
                                            href="javascript:;"
                                        >
                                            Reply
                                        </a>
                                    </li>
                                    <li className="relative flex items-center  p-2 mb-2 bg-white rounded-md border-0 border-t-0 text-inherit">
                                        <div className="inline-flex items-center justify-center w-12 h-12 mr-4 text-white transition-all duration-200 text-base ease-in-out rounded-xl">
                                            <img
                                                src={Avatar}
                                                alt="kal"
                                                className="w-full shadow-2xl rounded-md"
                                            />
                                        </div>
                                        <div className="flex flex-col items-start justify-center">
                                            <h6 className="mb-0 leading-normal text-md">User3</h6>
                                            <p className="mb-0 leading-tight text-sm">About files I can..</p>
                                        </div>
                                        <a
                                            className="inline-block py-3 pl-0 pr-4 mb-0 ml-auto font-bold text-center uppercase align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-pro text-xs ease-in hover:scale-102 hover:active:scale-102 active:opacity-85 text-[#16884d] hover:text-[#168846] hover:shadow-none active:scale-100"
                                            href="javascript:;"
                                        >
                                            Reply
                                        </a>
                                    </li>
                                    <li className="relative flex items-center  p-2 mb-2 bg-white rounded-md border-0 border-t-0 text-inherit">
                                        <div className="inline-flex items-center justify-center w-12 h-12 mr-4 text-white transition-all duration-200 text-base ease-in-out rounded-xl">
                                            <img
                                                src={Avatar}
                                                alt="kal"
                                                className="w-full shadow-2xl rounded-md"
                                            />
                                        </div>
                                        <div className="flex flex-col items-start justify-center">
                                            <h6 className="mb-0 leading-normal text-md">User4</h6>
                                            <p className="mb-0 leading-tight text-sm">Have a great afternoon..</p>
                                        </div>
                                        <a
                                            className="inline-block py-3 pl-0 pr-4 mb-0 ml-auto font-bold text-center uppercase align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-pro text-xs ease-in hover:scale-102 hover:active:scale-102 active:opacity-85 text-[#16884d] hover:text-[#168846] hover:shadow-none active:scale-100"
                                            href="javascript:;"
                                        >
                                            Reply
                                        </a>
                                    </li>
                                    <li className="relative flex items-center  p-2 bg-white rounded-md border-0 border-t-0 rounded-b-lg text-inherit">
                                        <div className="inline-flex items-center justify-center w-12 h-12 mr-4 text-white transition-all duration-200 text-base ease-in-out rounded-md">
                                            <img
                                                src={Avatar}
                                                alt="kal"
                                                className="w-full shadow-2xl rounded-md"
                                            />
                                        </div>
                                        <div className="flex flex-col items-start justify-center">
                                            <h6 className="mb-0 leading-normal text-md">User5</h6>
                                            <p className="mb-0 leading-tight text-sm">
                                                Hi! I need more information..
                                            </p>
                                        </div>
                                        <a
                                            className="inline-block py-3 pl-0 pr-4 mb-0 ml-auto font-bold text-center uppercase align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-pro text-xs ease-in hover:scale-102 hover:active:scale-102 active:opacity-85 text-[#16884d] hover:text-[#168846] hover:shadow-none active:scale-100"
                                            href="javascript:;"
                                        >
                                            Reply
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div> */}
                    {/* card col-2 end */}
                </div>
            </div>
        </div>
    )
}

export default Userprofile

