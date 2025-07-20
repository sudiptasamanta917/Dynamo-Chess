import io from 'socket.io-client';

// const socket = io.connect('https://chess-8kfd.onrender.com',);
// const socket = io.connect('https://chess.dynamo.gs3solution.us');
// const socket = io.connect('http://localhost:8080',);
// Listen for the 'connect' event

const socket = io.connect('http://localhost:5000');
socket.on('connect', () => {
    console.log('Socket connected');
  });
  
  // Listen for the 'disconnect' event
  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });
  

export default socket;