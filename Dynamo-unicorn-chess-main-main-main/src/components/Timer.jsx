import React, { useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import moment from 'moment-timezone';
import { useQuery } from 'react-query';

const Timer = ({ data }) => {
  const [remainingTime, setRemainingTime] = useState(null);

  const { data: serverTime, refetch } = useQuery(
    'datetimeQuery',
    async () => {
      const response = await fetch('https://chess.dynamochess.in/getCurrentTime');
      const { time } = await response.json();
      // console.log(time, "response.json()");
      return time; // assuming the response is in JSON format
    },
    {
      // enabled: false, // Disable automatic fetching
      refetchInterval: 1000, // refetch every 2 seconds
    }
  );

  // Fetch the server time after the component mounts
  // useEffect(() => {
  //   refetch(); // Manually refetch the server time after the component mounts
  // }, []);

  // Update remaining time when serverTime or data changes
  useEffect(() => {
    const calculateRemainingTime = () => {
      if (!serverTime || !data) return;

      // Parse server time and set to Asia/Kolkata timezone
      const currentServerTime = moment(serverTime).tz('Asia/Kolkata');

      // Assuming data is in "HH:mm" format, e.g., "13:39"
      const [hours, minutes] = data.split(':').map(Number);

      // Set the target time in Asia/Kolkata timezone using server-synchronized time
      const targetTimeInKolkata = currentServerTime.clone().set({
        hour: hours,
        minute: minutes,
        second: 0,
        millisecond: 0
      });

      // Calculate the difference between the target time and server time
      const timeDifference = targetTimeInKolkata.diff(currentServerTime);

      // Set the remaining time in milliseconds
      setRemainingTime(timeDifference > 0 ? timeDifference : 0); // Prevent negative values
    };

    calculateRemainingTime();
  }, [data, serverTime]); // Recalculate remaining time when data or server time changes

  // Renderer function to format the countdown
  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span className='text-2xl text-green-600'>00:00:00</span>; // Display when countdown is completed
    } else {
      return (
        <span className='text-2xl text-green-600'>
          {hours.toString().padStart(2, '0')}:
          {minutes.toString().padStart(2, '0')}:
          {seconds.toString().padStart(2, '0')}
        </span>
      );
    }
  };

  return (
    <span>
      {remainingTime !== null ? (
        <Countdown date={Date.now() + remainingTime} renderer={renderer} />
      ) : (
        <span className='text-2xl text-green-600'>00:00:00</span>
      )}
    </span>
  );
};

export default Timer;
