import { configureStore } from "@reduxjs/toolkit";
import {
  allUsersReducer,
  postOfFollowingReducer,
  userReducer,
} from "./Reducers/user";
// const initializeState = {};
const store = configureStore({
  reducer: {
    user: userReducer,
    postofFollowing: postOfFollowingReducer,
    allUsers: allUsersReducer,
  },
});
export default store;
