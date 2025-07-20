import { GET_LOADING, Game_Status, Get_Game, Get_Navigation,Get_Sound, TOURNAMENT_STATUS, Tournament_Start_Popup } from "./constant";

export const gameData = (state = { loading: false, data: [],TournamentPopupData:{initialTimeRemaining:null, joinUrl:'null',ShowPopup:false} }, action) => {
  // console.log("gamestatus reducer",action.payload);
  switch (action.type) {
    case Get_Game:
      return { ...state, data: action.data };
    case GET_LOADING:
      return { ...state, loading: action.payload };
    case Game_Status:
      return { ...state, GameStatus: action.payload };
    case TOURNAMENT_STATUS:
      return { ...state, TournamentStatus: action.payload };
    case Tournament_Start_Popup:
      return { ...state, TournamentPopupData: action.payload };
    default:
      return state;
  }
};



export const gamenavigation = (state = { loading: false, data: true }, action) => {
  // console.log("gamenavigation");
  switch (action.type) {
    case Get_Navigation:
      return { ...state, data: action.payload };
    case GET_LOADING:
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};


export const gamesound = (state = { loading: false, data: true }, action) => {
  // console.log("gamesound");
  switch (action.type) {
    case Get_Sound:
      return { ...state, data: action.payload };
    case GET_LOADING:
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};
