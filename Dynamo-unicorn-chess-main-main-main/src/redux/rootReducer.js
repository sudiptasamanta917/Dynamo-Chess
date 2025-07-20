import { combineReducers } from "redux";
import { gameData,gamenavigation,gamesound} from "./gameReducer";
export default combineReducers({
    gameData,
    gamenavigation,
    gamesound  
});