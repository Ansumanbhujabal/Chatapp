import { configureStore } from "@reduxjs/toolkit";
import { postOfFollowingReducer, userReducer } from "./Reducers/user";
// const initializeState = {};
const store = configureStore({
  reducer: {
    user: userReducer,
    postofFollowing: postOfFollowingReducer,
  },
});
export default store;
