import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Slider from '../components/Slider';
import tBanner from "../assets/tBanner.jpg";
import tBanner2 from "../assets/tBanner2.jpg";
import Avatar from "../assets/Avatar.jpeg";
import Avatar2 from "../assets/Avatar2.jpeg";
import Avatar3 from "../assets/Avatar3.jpeg";
import Avatar4 from "../assets/Avatar4.jpeg";
import { useQuery } from 'react-query';
import { getApi, postApiWithToken } from '../utils/api';
import "../styles.css"
import { toastError, toastSuccess } from '../utils/notifyCustom';
// import DTourmnt from "../assets/DTourmnt.jpg"

const Trainer = () => {
  const sliderHeight = '280px'; // Set the desired height here
  const eventDetails = "Play with our Trainer DynamoChess";
  const images = [
    // { img: img, content: "kjhsg sdgkjsdgh skdfg" },
    { img: tBanner, content: "kjhsg sdgkjsdgh skdfg" },
    { img: tBanner2, content: "kjhsg sdgkjsdgh skdfg" },
  ];
  const [showModal, setShowModal] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState('');

  const handleOpenModal = (item) => {
    // console.log(item);
    setSelectedPiece(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPiece('');
  };
  // const closeDropdown = () => {
  //     console.log("+++")
  //     setDropdown(false);
  // };
  // const [dropdown, setDropdown] = useState(false);
  // const dropdownRef = useRef(null);
  // const toggleDropdown = () => setDropdown(!dropdown);

  const [selectedOption, setSelectedOption] = useState("");

  const handleSelect = (event) => {
    setSelectedOption(event.target.value);
  };
  const getBackgroundColor = () => {
    if (selectedOption === "online") return "bg-green-500";
    if (selectedOption === "offline") return "bg-gray-500";
    return "bg-white";
  };
  const getTextColor = () => {
    if (selectedOption === "online" || selectedOption === "offline") return "text-white";
    return "text-gray-700";
  };

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const modalContent = {
    Trainer1: {
      name: 'Trainer1',
      description: '',
      city: 'Kolkata',
      language: 'Bangali/English/Hindi',
      img: Avatar
    },
    Trainer2: {
      name: 'Trainer2',
      description: '',
      city: 'Kolkata',
      language: 'Bangali/English/Hindi',
      img: Avatar2
    },
    Trainer3: {
      name: 'Trainer3',
      description: '',
      city: 'Kolkata',
      language: 'Bangali/English/Hindi',
      img: Avatar3
    },
    Trainer4: {
      name: 'Trainer4',
      description: '',
      city: 'Kolkata',
      language: 'Bangali/English/Hindi',
      img: Avatar4
    },
  };

  const url = `${import.meta.env.VITE_URL}${import.meta.env.VITE_GET_TRAINER}/get-all`;
  const { data, error, isLoading } = useQuery('GET_Trainer_LIST', () => getApi(url));

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading data</p>;
  }

  if (!data?.data?.trainerData || data.data.trainerData.length === 0) {
    return <p>No ratings available</p>;
  }

  console.log(data, "hhhhhhhhhhhhhhhkkkkkkkkkkk=================>>>>", selectedPiece?.name);


      const handleWithdrawal = async (amount) => {
  
          try {
              const url = `${import.meta.env.VITE_URL}${import.meta.env.VITE_GET_WALLET_WITHDRAW}`;
              const raw = {
                  dynamoCoin: amount,
                  type:"plan"
              }
              const walletWithdraw = await postApiWithToken(url, raw)
              if (walletWithdraw?.status == 200) {
                  toastSuccess(walletWithdraw?.data?.message)
          
              } else {
                  toastError(walletWithdraw)
                 
              }
              // console.log(walletWithdraw, "walletWithdraw=>>>>>>><<<")
          } catch (error) {
              // console.log(error, "walletWithdraw")
          }
  
  
  }


  return (
    <>
      <Modal show={showModal} onClose={handleCloseModal}>
        <div className="rounded-lg shadow-lg mx-auto sm:my-0 p-4">
          {/* Image Section */}
          <div className="flex justify-center mb-4">
            <img
              src={selectedPiece?.image || '/path/to/placeholder.jpg'}
              alt={selectedPiece?.name || 'Trainer Image'}
              className="h-60 w-60 rounded-md object-cover max-sm:h-48 max-sm:w-48"
            />
          </div>

          {/* Name */}
          <p className="text-2xl font-bold text-green-900 text-center mb-4">
            {selectedPiece?.name || 'Trainer Name'}
          </p>

          {/* City and Language Section */}
          <div className="flex flex-wrap justify-between mb-4">
            <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
              <p className="font-semibold text-gray-700">
                City: <span className="text-green-700">{selectedPiece?.address || 'N/A'}</span>
              </p>
              <p className="font-semibold text-gray-700">
                Language: <span className="text-green-700">{selectedPiece?.language || 'N/A'}</span>
              </p>
            </div>

            {/* Mode Selection and Date/Time */}
            <div className="w-full sm:w-1/2">
              {/* <select
                id="options"
                name="options"
                className="mt-2 block w-full px-3 py-2 font-semibold text-xl border border-gray-300 rounded-md focus:outline-none max-sm:text-sm mb-4"
                value={selectedOption}
                onChange={handleSelect}
              >
                <option value="" disabled>
                  Mode to Play
                </option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select> */}

              <input
                type="date"
                className="border border-black my-2 w-full px-3 py-2 rounded-md max-sm:text-xs"
              />

              <input
                type="time"
                className="border border-black my-2 w-full px-3 py-2 rounded-md max-sm:text-xs"
              />
            </div>
          </div>

          {/* Payment Button */}
          <div className="flex justify-center mt-4">
          {/* onClick={()=>handleWithdrawal(selectedPiece.feesPerHour)} */}
            <button onClick={()=>handleWithdrawal(selectedPiece.feesPerHour)} className="bg-green-600 px-6 py-3 text-white font-bold rounded-md hover:bg-green-700 transition-colors duration-200 w-full sm:w-auto">
              Pay to Learn
            </button>
          </div>
        </div>
      </Modal>

      <Slider height={sliderHeight} eventDetails={eventDetails} images={images} />

      <div>
        <p className="text-center font-bold text-4xl m-3 max-sm:text-xl">
          Play with Our Respected Trainers
        </p>
        <div className="w-full flex flex-wrap py-4">
          {data?.data?.trainerData?.map((item, index) => (
            <div key={index} className="w-full lg:w-1/4 md:w-1/2 text-center p-4">
              <div
                className="bg-white shadow-lg rounded-lg p-6 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl cursor-pointer"
                onClick={() => handleOpenModal(item)}
                role="button"
                aria-label={`View details about ${item.name}`}
              >
                <img
                  src={item.image || '/path/to/placeholder.jpg'}
                  alt={item.name || 'Trainer Image'}
                  className="w-3/4 mx-auto rounded-full border-4 border-gray-200 mb-4 transition-transform duration-300 ease-in-out hover:scale-110"
                  onError={(e) => (e.target.src = '/path/to/placeholder.jpg')}
                />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {item.name || 'Trainer Name'}
                </h3>
                <div className="font-normal text-sm leading-5 text-gray-600 mb-4 text-justify line-clamp-3">
                  <div
                    className="custom-content text-black"
                    dangerouslySetInnerHTML={{ __html: item.content || '' }}
                  />
                </div>

                {/* Experience */}
                <div className="mb-3">
                  <p className="text-base font-semibold text-gray-700">
                    Experience:
                    <span className="text-green-700"> {item.experience || 'N/A'}</span>
                  </p>
                </div>

                {/* Fees per hour */}
                <div className="mb-3">
                  <p className="text-base font-semibold text-gray-700">
                    Fees per hour:
                    <span className="text-green-700"> ₹ {item.feesPerHour || 'N/A'}</span>
                  </p>
                </div>

                {/* City */}
                <div className="mb-3">
                  <p className="text-base font-semibold text-gray-700">
                    City:
                    <span className="text-green-700"> {item.address || 'N/A'}</span>
                  </p>
                </div>

                {/* Age */}
                <div>
                  <p className="text-base font-semibold text-gray-700">
                    Age:
                    <span className="text-green-700"> {item.age || 'N/A'}</span>
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </>
  );

}

const Modal = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex  justify-center items-center z-50">
      <div className="  max-w-lg p-4 bg-white rounded-lg max-sm:w-full max-sm:mx-3">
        <div className="flex  justify-end">
          <button onClick={onClose} className="text-xl font-bold">X</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
export default Trainer
