import React, { useEffect } from "react";
import "./Account.css";
import { useDispatch, useSelector } from "react-redux";
import { getmyposts } from "../../Actions/User";
import Loader from "../Loader/Loader";
import Post from "../Post/Post";
import { toast } from "react-toastify";
import { Avatar, Button, Dialog, Typography } from "@mui/material";

const Account = () => {
  const dispatch = useDispatch();
  const { loading, error, posts } = useSelector((state) => state.myPosts);
  const { user, loading: userLoading } = useSelector((state) => state.user);

  console.log(posts);
  const { error: likeError, message } = useSelector((state) => state.like);

  useEffect(() => {
    dispatch(getmyposts());
  }, [dispatch]);

  useEffect(() => {
    if (likeError) {
      toast.error(likeError);
      dispatch({ type: "clearErrors" });
    }
    if (message) {
      toast.success(message);
      dispatch({ type: "clearMessages" });
    }
  }, [toast, likeError, message, error, dispatch]);

  return loading === true || userLoading === true ? (
    <Loader />
  ) : (
    <div className="account">
      <div className="accountleft">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post._id}
              postId={post._id}
              caption={post.caption}
              postImage={post.image.url}
              likes={post.likes}
              comments={post.comments}
              ownerImage={post.owner.avatar.url}
              ownerName={post.owner.name}
              ownerId={post.owner._id}
              isAccount={true}
              isDelete={true}
            />
          ))
        ) : (
          <Typography variant="h6">No posts yet</Typography>
        )}
      </div>
      <div className="accountright">
        <Avatar
          src={user.avatar.url}
          sx={{ height: "8vmax", width: "8vmax" }}
        />

        <Typography variant="h5">{user.name}</Typography>
        <div>
          <button onClick={() => setFollowersToggle(!followersToggle)}>
            <Typography>Followers</Typography>
          </button>
          <Typography>{user.followers.length}</Typography>
        </div>

        <div>
          <button onClick={() => setFollowingToggle(!followingToggle)}>
            <Typography>Following</Typography>
          </button>
          <Typography>{user.following.length}</Typography>
        </div>
        <div>
          <Typography>Posts</Typography>
          <Typography>{user.posts.length}</Typography>
        </div>

        <Button variant="contained" onClick={logoutHandler}>
          Logout
        </Button>

        <Link to="/update/profile">Edit Profile</Link>
      </div>
    </div>
  );
};

export default Account;
