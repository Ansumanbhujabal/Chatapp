import React, { useEffect } from "react";
import "./Account.css";
import { useDispatch, useSelector } from "react-redux";
import { getmyposts } from "../../Actions/User";
import Loader from "../Loader/Loader";
import Post from "../Post/Post";
import { toast } from "react-toastify";
import { Typography } from "@mui/material";

const Account = () => {
  const dispatch = useDispatch();
  const { loading, error, posts } = useSelector((state) => state.myPosts);

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

  return loading ? (
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
            />
          ))
        ) : (
          <Typography variant="h6">No posts yet</Typography>
        )}
      </div>
      <div className="accountright"></div>
    </div>
  );
};

export default Account;
