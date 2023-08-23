import { configureStore } from "@reduxjs/toolkit";
import {
  allUsersReducer,
  postOfFollowingReducer,
  userReducer,
} from "./Reducers/user";
import { likeReducer } from "./Reducers/post";
// const initializeState = {};
const store = configureStore({
  reducer: {
    user: userReducer,
    postofFollowing: postOfFollowingReducer,
    allUsers: allUsersReducer,
    like: likeReducer,
  },
});
export default store;
