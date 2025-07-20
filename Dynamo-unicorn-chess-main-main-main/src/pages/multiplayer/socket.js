import io from 'socket.io-client';

// const socket = io.connect('https://chess-8kfd.onrender.com',);
const socket = io.connect('https://chess.dynamochess.in');
// const socket = io.connect('http://localhost:8080',);
// Listen for the 'connect' event
socket.on('connect', () => {
    console.log('Socket connected');
  });
  
  // Listen for the 'disconnect' event
  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });
  

export default socket;