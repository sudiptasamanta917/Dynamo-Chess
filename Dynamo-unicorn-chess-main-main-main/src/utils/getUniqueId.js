const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const characters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'o', 'p', 'u', 'r', 's', 't', 'x', 'y', 'z'];

const getRandomElement=(arr)=> {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

export const createUniqueId=(length)=> {
  let uniqueId = '';
  const allChars = [...numbers, ...characters];
  
  for (let i = 0; i < length; i++) {
    uniqueId += getRandomElement(allChars);
  }
  
  return uniqueId;
}