import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import authReducer from "./authSlice";
import postReducer from "./postSlice";
import socketSlice from './socketSlice'
import chatSlice from './chatSlice'
import rtnSlice from "./rtnSlice";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  auth: persistReducer(persistConfig, authReducer),
  post: postReducer,
  socketio:socketSlice,
  chat:chatSlice,
  realTimeNotification:rtnSlice
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export default store;
