import React from 'react'
import { FaRegClipboard } from "react-icons/fa";
import { toastError, toastSuccess } from '../utils/notifyCustom';
import { v4 as uuidv4 } from 'uuid';
import {  useParams } from "react-router-dom";
const Playwithfriend = () => {
    const inputId = uuidv4();
    const { time } = useParams();
    // const uniqueId = createUniqueId(20);

    // Construct the URL
    const protocol = window.location.protocol;
    const host = window.location.host;
    const url = `${protocol}//${host}/multiplayer/${inputId}/${time}`;
  
    // Log the URL to the console
    // console.log(url);

    const handleClipboardCopy = (textToCopy) => {
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                toastSuccess("URL copied to clipboard")
                // console.log('Text copied to clipboard');
                // Optionally, you can show a success message or perform other actions
            })
            .catch(err => {
                toastError('Unable to copy text to clipboard: ', err)
                console.error('Unable to copy text to clipboard: ', err);
                // Handle errors, such as permissions or other failures
            });
    };

    return (
        <div className=' w-full px-20 max-sm:px-4 my-4'>
            <div className=' bg-gray-300 p-8 rounded-md'>
                <div>
                    <h1 className=' text-3xl'>Challenge to a game</h1>
                    <div className="bg-[#252a24] mt-4 border border-[#a8c66c] rounded-md p-4 flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="text-[#a8c66c] mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 8V8m18 8V8M5 16h14" />
                                </svg>
                            </div>
                            <div className="text-white">
                                <div className="text-blue-400">Correspondence</div>
                                <div className="text-gray-300">Unlimited</div>
                            </div>
                        </div>
                        <div className="text-right text-[#a8c66c]">
                            <div>White</div>
                            <div>Casual</div>
                        </div>
                    </div>
                    {/* <div className=' flex justify-center gap-3'>
                        <div className='bg-slate-500 p-6 rounded-md shadow-md mt-5'>
                            <h1>To invite someone to play, give this URL</h1>
                            <div className='
                            flex my-2 border border-black rounded-md overflow-hidden'>
                                <p className='p-2 text-gray-800 w-[90%]  '>
                                    https://www.google.com
                                </p>

                                <button className='w-[10%] bg-slate-800 flex justify-center items-center hover:bg-slate-600 '>
                                    <FaRegClipboard className=' text-white' />
                                </button>
                            </div>
                            <h1>The first person to come to this URL will play with you.</h1>
                        </div>

                    </div> */}

                    <div className="bg-[#252a24] p-6 rounded-md flex flex-wrap justify-between items-center">
                        <div className="flex flex-col items-start">
                            <label className="text-gray-300 mb-2">To invite someone to play, give this URL:<span className='text-2xl text-red-600'>(Both player should join the game)</span></label>
                            <div className="bg-gray-800 p-2 rounded-md flex items-center w-full">
                                <input
                                    type="text"
                                    value={url}
                                    className="bg-transparent text-gray-300 w-full outline-none"
                                    readOnly
                                />
                                <button onClick={() => handleClipboardCopy(url)} className=" ml-2">
                                    <FaRegClipboard className=' text-white' />
                                </button>
                            </div>
                            <p className="text-gray-500 mt-2">The first person to come to this URL will play with you.</p>
                        </div>
                        {/* <div className="flex flex-col max-sm:pt-3 items-center">
                            <label className="text-gray-300 mb-2">Or let your opponent scan this QR code</label>
                            <div className="bg-white p-2 rounded-md">
                                <img src="https://www.qr-code-generator.com/wp-content/themes/qr/img/vCard_china_vCard_china_4.png" alt="QR Code" className="h-32 w-32" />
                            </div>
                        </div> */}

                    </div>
                    <div className='flex justify-center items-center'>

                        <button className="bg-red-600 text-white rounded-md px-4 py-2 mt-4 ">CANCEL</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Playwithfriend
