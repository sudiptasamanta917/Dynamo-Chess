import React, { useState, useEffect } from 'react';
import Countdown from 'react-countdown';
import Swal from 'sweetalert2';
import ReactDOM from 'react-dom';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GameStatus } from '../../redux/action';
import moment from 'moment-timezone';
import { useQuery } from 'react-query';

const JoinTournament = ({Url,targetTimes}) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const location = useLocation();
  const isMultiplayerPresent = location.pathname.includes('multiplayer');
  const url = window.location.href;
  const isTournament = url && url.includes('multiplayer/tournament:');
  const { TargetTime, joinUrl,ShowPopup } = useSelector((state) => state?.gameData?.TournamentPopupData);
  const gameStatus = useSelector((state) => state?.gameData?.GameStatus) || null;
  const [initialTimeRemaining, setInitialTimeRemaining] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const datetimeQuery = useQuery(
    'datetimeQuery6',
    async () => {
      const response = await fetch('https://chess.dynamochess.in/getCurrentTime');
      const { time } = await response.json();
      return time;; // assuming the response is in JSON format
    },
    {
      enabled: isMounted,
      refetchInterval: 2000, // refetch every 2 seconds
    }
  );

  useEffect(() => {
    setIsMounted(true);
  }, [gameStatus]);

  useEffect(() => {
    // console.log(initialTimeRemaining,"initialTimeRemaining",datetimeQuery?.data)
    const initialize = async () => {
      // Fetch the server time and calculate the remaining time
    if(datetimeQuery?.data){
      const serverTime = moment(datetimeQuery?.data).tz('Asia/Kolkata');

      if (TargetTime && serverTime) {
        const targetTimeMoment = moment(TargetTime).tz('Asia/Kolkata');
        const timeRemaining = targetTimeMoment.diff(serverTime, 'milliseconds');
        setInitialTimeRemaining(timeRemaining);
        // console.log(timeRemaining,"timeRemaining",datetimeQuery?.data,TargetTime);

      }
    }
    };

    initialize();
  }, [TargetTime, datetimeQuery?.data, gameStatus]);


  // Conditionally render the component only if TargetTime is valid
  useEffect(() => {
   ;
    if (
      !isMultiplayerPresent &&
      !isTournament &&
      initialTimeRemaining <=60000 &&
      initialTimeRemaining >=55000 &&
      !gameStatus &&
      joinUrl
    ) {
      window.location.href = joinUrl;
    }
  }, [initialTimeRemaining, isMultiplayerPresent, gameStatus, joinUrl, Url]);
  
  

  // Handler to show the SweetAlert2 popup
  const showPopup = () => {
    Swal.fire({
      title: 'Time is almost up!',
      html: `
        <div id="countdown-container"></div>
        <p>Would you like to join now?</p>   
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Join',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'bg-yellow-50 text-green-800',
        confirmButton: 'bg-green-600 text-white',
        cancelButton: 'bg-yellow-200 text-green-600',
      },
      didOpen: () => {
        const countdownContainer = document.getElementById('countdown-container');
        if (countdownContainer) {
          countdownContainer.innerHTML = ''; // Clear any previous content

          const countdown = (
            <Countdown
              date={Date.now() + initialTimeRemaining}
              onComplete={() => {
                Swal.close(); // Close the popup when countdown completes
              }}
              renderer={({ minutes, seconds, completed }) => {
                if (completed) {
                  return <p>Time is up!</p>;
                } else {
                  return (
                    <p>
                      Time remaining: {minutes}m {seconds}s
                    </p>
                  );
                }
              }}
            />
          );

          // Render the countdown component into the container
          ReactDOM.render(countdown, countdownContainer);
        }
      },
      willClose: () => {
        // Clean up the countdown component when the popup closes
        const countdownContainer = document.getElementById('countdown-container');
        if (countdownContainer) {
          ReactDOM.unmountComponentAtNode(countdownContainer);
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = joinUrl; // Redirect to join URL
      }
    });
  };

  if (!TargetTime || initialTimeRemaining <= 0) {
    return null; // If TargetTime is invalid or time is up, render nothing
  }

  return null;
};

export default JoinTournament;
