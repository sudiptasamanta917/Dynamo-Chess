const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const characters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'o', 'p', 'u', 'r', 's', 't', 'x', 'y', 'z'];

function getRandomElement(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

function createUniqueId(length) {
  let uniqueId = '';
  const allChars = [...numbers, ...characters];
  
  for (let i = 0; i < length; i++) {
    uniqueId += getRandomElement(allChars);
  }
  
  return uniqueId;

  
}

// Example usage:
const uniqueId = createUniqueId(20); // Generate a unique ID of length 10
// console.log(uniqueId);

const currentLocation="https://dynamo-unicorn-chess.vercel.app/multiplayer/tournament:67343b20372036db3e969053:67343b74372036db3e96b0fa:320814bf-446b-48fc-93d1-d46ef3681811/60"
console.log(currentLocation.split("tournament:")[1].split(':')[0]);
