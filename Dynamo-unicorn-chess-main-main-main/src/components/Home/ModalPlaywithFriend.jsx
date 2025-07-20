import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import bk from "../../assets/ducpices/BLACK/bk2.png"
import wk from "../../assets/ducpices/WHITE/wk2.png"
import { minutesToSeconds } from '../../utils/getuserdata';
import { useNavigate } from "react-router-dom";
import { toastSuccess } from '../../utils/notifyCustom';
function ModalPlaywithFriend({ open, close }) {
  const navigate = useNavigate();
  const [selectedCar, setSelectedCar] = useState('');
  const [selectedCarSecond, setSelectedCarSecond] = useState(600); // Default is 600 seconds (10 minutes)

  const handleChange = (event) => {
    const valueInMinutes = Number(event.target.value);
    setSelectedCarSecond(valueInMinutes * 60); // Convert to seconds
    setSelectedCar(valueInMinutes); // Assuming `setSelectedCar` is also required
  };


  const handleClick = () => {
    if (selectedCarSecond == '') {
      toastSuccess("Select a time")
      open
    } else {
      navigate(`/playwithfriend/${selectedCarSecond}`)
      close
    }

  }

  // console.log(selectedCarSecond, "cccccc");

  return (
    <>
      {open && (
        <div
          id="popup-modal"
          tabIndex={-1}
          className=" overflow-hidden fixed top-0  right-0 left-0 z-50 flex justify-center items-center w-full  h-screen bg-gray-700 bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-md max-h-full ">
            <div className="relative bg-white rounded-lg shadow ">
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400  hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center "
                onClick={close}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-4 md:p-5 text-center">
                <h1 className='text-black'>Play with a friend</h1>

                <div className="mt-3 relative">
                  <div className="relative mb-6">
                    <label htmlFor="labels-range-input" className="sr-only">
                      Labels range
                    </label>
                    <input
                      onChange={(e) => handleChange(e)}
                      id="labels-range-input"
                      type="range"
                      value={selectedCarSecond / 60} // Convert seconds to minutes for display
                      min={10}
                      step={20}
                      max={120}
                      className="w-full accent-green-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                  </div>

                  {/* Labels outside the card */}
                  <div className="absolute top-full left-0 w-full flex justify-between mt-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">10min</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">30min</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">50min</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">70min</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">90min</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">110min</span>
                  </div>
                </div>


                <div className=' flex gap-2 justify-center mt-12'>
                  <a onClick={handleClick} className='bg-green-700 p-1 rounded-md shadow-md '>
                    <button className='px-2 '>Submit</button>
                  </a>

                  {/* <Link to={"/playwithfriend"}  onClick={close} className='bg-slate-500 p-1 rounded-md shadow-md '>
                  <img src={wk} alt="" className=' h-16 w-16'/>
                </Link> */}

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ModalPlaywithFriend