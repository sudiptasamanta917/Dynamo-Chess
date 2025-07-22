import io from 'socket.io-client';

const socket = io.connect(`${import.meta.env.VITE_SOCKET_URL}`);
socket.on('connect', () => {
    console.log("Connected to socket:", socket.id);
  });
  
  // Listen for the 'disconnect' event
  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });
  

export default socket;