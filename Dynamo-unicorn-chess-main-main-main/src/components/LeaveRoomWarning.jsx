import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import socket from '../pages/multiplayer/socket';
import { useSelector } from 'react-redux';

const LeaveRoomWarning = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const prevLocationRef = useRef(location.pathname);
  const nextLocationRef = useRef(null);
  const [isRedirectPrevented, setIsRedirectPrevented] = useState(false);
  const [uniqueId, setUniqueId] = useState('');

  const UserDetail = JSON.parse(localStorage.getItem("User Detail"));
  const roomId = localStorage.getItem("RoomId");


  const gameStatus = useSelector((state) => state?.gameData?.GameStatus);

  // console.log(gameStatus,"data fetch gamstatus");



  useEffect(() => {
    const prevLocation = prevLocationRef.current;
    const currentLocation = location.pathname;

    const wasMultiplayer = prevLocation.includes("/multiplayer");
    const isMultiplayer = currentLocation.includes("/multiplayer");
    const tournament = currentLocation.includes("tournament:");

    if (isMultiplayer && currentLocation) {
      if (tournament) {
        // Set uniqueId based on the tournament condition
        setUniqueId(currentLocation.split("tournament:")[1].split(':')[0]);
      } else {
        // Set uniqueId based on the regular multiplayer path
        setUniqueId(currentLocation.split("/")[2]);
      }
    }

    if (!isRedirectPrevented && wasMultiplayer && !isMultiplayer && !gameStatus) {
      nextLocationRef.current = currentLocation;
      setIsRedirectPrevented(true);
      navigate(prevLocation, { replace: true });

      Swal.fire({
        title: "Do you want to leave this game?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Leave",
        cancelButtonText: "Stay",
        customClass: {
          popup: 'bg-green-100 border-2 border-yellow-500', // Popup background and border
          title: 'text-green-700', // Title text color
          content: 'text-yellow-600', // Content text color
          confirmButton: 'bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded', // Confirm button style
          cancelButton: 'bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded', // Cancel button style
        }
      }).then((result) => {
        if (result.isConfirmed) {
          socket.emit("leaveRoom", { roomId, playerId: UserDetail._id, challengeId: uniqueId });
          navigate(nextLocationRef.current); // Navigate without reloading
          // window.location.reload();
        } else {
          setIsRedirectPrevented(false);
          prevLocationRef.current = currentLocation; // Reset previous location to prevent re-navigation
        }
      });
    }

    prevLocationRef.current = currentLocation;
  }, [
    location.pathname,
    navigate,
    isRedirectPrevented,
    roomId,
    UserDetail?._id,
    uniqueId,
    gameStatus

  ]);

  return null;
};

export default LeaveRoomWarning;
