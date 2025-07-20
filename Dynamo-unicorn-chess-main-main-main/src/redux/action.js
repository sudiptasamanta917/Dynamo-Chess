import { GET_LOADING, Set_Game, Get_Navigation, Get_Sound, Game_Status, Tournament_Start_Popup, TOURNAMENT_STATUS } from "./constant"
export const getGame = () => {
  // console.log("set game action call");
  return {
    type: Set_Game,
  };
};
export const setLoading = (loading) => ({
  type: GET_LOADING,
  payload: loading
});


export const setNavigation = (navigation) => ({
  type: Get_Navigation,
  payload: navigation
});

export const setSound = (sound) => ({
  type: Get_Sound,
  payload: sound
});

export const GameStatus = (status) => {
  // console.log("GameStatus action called",status);
  return {
      type:Game_Status,
      payload: status
  }
}
export const TournamentStatus = (status) => {
  // console.log("GameStatus action called",status);
  return {
      type:TOURNAMENT_STATUS,
      payload: status
  }
}
export const TournamentStartPopup = (TargetTime, joinUrl,ShowPopup) => {
  // console.log("TournamentStartPopup action called",joinUrl,ShowPopup);
  return {
      type:Tournament_Start_Popup,
      payload:{
        TargetTime, joinUrl,ShowPopup
      }
  }
}



