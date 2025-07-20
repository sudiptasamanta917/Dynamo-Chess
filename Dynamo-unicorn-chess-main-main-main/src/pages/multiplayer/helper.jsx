// import { InitialPosition } from "./pages/multiplayer/Utils/getLocalStorageData";
import captureSound from "../../assets/sound/capture.mp3";
import pieceSound from "../../assets/sound/move.mp3";
// import arbiter from "./arbiter/arbiter";
// import { getKingPosition } from "./arbiter/getMoves";
import '../.././globalInit';
// import socket from "./pages/multiplayer/socket";
const pieceS = new Audio(pieceSound);
const captureS = new Audio(captureSound);

export const getCharacter = (file) => String.fromCharCode(file + 96);
export const createPosition = () => {
  const position = new Array(10).fill("").map((x) => new Array(10).fill(""));
  // const initialPosition = InitialPosition();
  for (let i = 0; i < 10; i++) {
    position[8][i] = "bp";
    position[1][i] = "wp";
    // if(position[1][9]){
    //   position[1][9] = ""
    // }
  }

  position[0][0] = "wr";
  position[0][1] = "wn";
  position[0][2] = "wb";
  position[0][3] = "wm";
  position[0][4] = "wq";
  position[0][5] = "wk";
  position[0][6] = "wm";
  position[0][7] = "wb";
  position[0][8] = "wn";
  position[0][9] = "wr";

  position[9][0] = "br";
  position[9][1] = "bn";
  position[9][2] = "bb";
  position[9][3] = "bm";
  position[9][4] = "bq";
  position[9][5] = "bk";
  position[9][6] = "bm";
  position[9][7] = "bb";
  position[9][8] = "bn";
  position[9][9] = "br";


  // for (let i = 0; i < 10; i++) {
  //   position[1][i] = "bp";
  //   position[8][i] = "wp";
  // }

  // position[9][0] = "wr";
  // position[9][1] = "wn";
  // position[9][2] = "wb";
  // position[9][3] = "wm";
  // position[9][4] = "wq";
  // position[9][5] = "wk";
  // position[9][6] = "wm";
  // position[9][7] = "wb";
  // position[9][8] = "wn";
  // position[9][9] = "wr";

  // position[0][0] = "br";
  // position[0][1] = "bn";
  // position[0][2] = "bb";
  // position[0][3] = "bm";
  // position[0][4] = "bq";
  // position[0][5] = "bk";
  // position[0][6] = "bm";
  // position[0][7] = "bb";
  // position[0][8] = "bn";
  // position[0][9] = "br";


  return position;
};

export const copyPosition = (position) => {
  const newPosition = new Array(10).fill("").map((x) => new Array(10).fill(""));

  for (let rank = 0; rank < position.length; rank++) {
    for (let file = 0; file < position[0].length; file++) {
      newPosition[rank][file] = position[rank][file];
    }
  }

  return newPosition;
};

export const areSameColorTiles = (coords1, coords2) =>
  (coords1.x + coords1.y) % 2 === coords2.x + coords2.y;

export const findPieceCoords = (position, type) => {
  let results = [];
  position.forEach((rank, i) => {
    rank.forEach((pos, j) => {
      if (pos === type) results.push({ x: i, y: j });
    });
  });
  return results;
};


export const getNewMoveNotation = ({
  piece,
  rank,
  file,
  x,
  y,
  a,
  b,
  position,
  promotesTo,
  isPlayerInCheck,
  isplayerIncheckMate,
}) => {

  // console.log(x,y,a,b,"isplayer is check");
  let note = "";
  const sound=localStorage.getItem("Sound")
  rank = Number(rank);
  file = Number(file);
  // console.log(piece?.[1],Math.abs(file-y),"hhhhhhhhh'............");
  if (piece[1] === "k" && Math.abs(file - y) >= 2) {
    if (file < y){
      
    // if(sound=="true"){
    //   pieceS.play()
    // }
      return "O-O";
    } 
    else {
      
    // if(sound=="true"){
    //   pieceS.play()
    // }

      return "O-O-O";
    }
  }

  if (piece[1] !== "p") {
   
    note += piece[1].toUpperCase();
    if (position[x][y]) {
      note += "x";
      // if(sound=="true"){
      //   captureS.play()
      // }
    }
    else{
      // if(sound=="true"){
      //   pieceS.play()
      // }
    }
  } else if (rank !== x && file !== y) {
    note += getCharacter(file + 1) + "x";

    // if(sound=="true"){
    //   captureS.play()
    // }
  }
  else{
   
    // if(sound=="true"){
    //   pieceS.play()
    // }
  }



  note += getCharacter(b + 1) + (a + 1);
  // console.log(isPlayerInCheck,"ttttttthgggggggggggddddddddddd");

  if (promotesTo) note += "=" + promotesTo.toUpperCase();
  if (isPlayerInCheck && !isplayerIncheckMate){
    note += "+";
  }
  else if(isPlayerInCheck && isplayerIncheckMate){
    note += "#";
  }

  return note;
};
