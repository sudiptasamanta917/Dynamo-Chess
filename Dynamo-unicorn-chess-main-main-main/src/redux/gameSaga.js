import axios from "axios";
import { takeEvery, put } from "redux-saga/effects";
import {  GET_ERROR, GET_LOADING, Get_Game, Set_Game, } from "../redux/constant";
import { setLoading } from "./action";

function* getGame(action) {
  // console.log("up game saga call");
  yield put(setLoading(true)); // Dispatch loading action
  
  // try {
  //   const res = yield axios.get(
  //     `${import.meta.env.VITE_URL}${import.meta.env.VITE_GET_CONTEST}?page=${action.page}&matchTypes=${action.gameType}&limit=${action.limit}&sportsType=${action.sportType}`,
  //     {
  //       headers: {
  //         Authorization: JSON.parse(localStorage.getItem('dream11-admin-tokin')),
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );

  //   yield put({ type: "Set_Game_List", data: [res.data] });
  // } catch (e) {
  //   console.error("Error in getGame saga:", e);
  //   yield put({ type: GET_ERROR, data: e });
  // } finally {
  //   yield put(setLoading(false)); // Dispatch loading action
  // }
}




function* productSaga() {
  yield takeEvery(Set_Game, getGame);
}

export default productSaga;
