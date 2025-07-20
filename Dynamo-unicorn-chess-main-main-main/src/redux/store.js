import { configureStore } from "@reduxjs/toolkit";
import gameSaga from "./gameSaga";
import rootReducer from "./rootReducer";
import createSagaMiddleware from "redux-saga";

// Remove persistReducer and persistStore imports
// Remove redux-persist and storage import

// Remove persistConfig and persistedReducer
// const persistConfig = {
//   key: "dynamochess-root-store",
//   storage,
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

const sagaMiddleware = createSagaMiddleware();
const store = configureStore({
  reducer: rootReducer,  // Use rootReducer directly
  middleware: () => [sagaMiddleware],
});

sagaMiddleware.run(gameSaga);

export default store;
