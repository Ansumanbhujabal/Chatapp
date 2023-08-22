import React, { useEffect } from "react";
import "./Home.css";
import User from "../User/User";
import Post from "../Post/Post";
import { useDispatch, useSelector } from "react-redux";
import { getFollowingPosts } from "../../Actions/User";
import Loader from "../Loader/Loader";
import { Typography } from "@mui/material";

const Home = () => {
  const { loading, posts, error } = useSelector(
    (state) => state.postofFollowing
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getFollowingPosts());
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="home">
      <div className="homeleft">
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
      <div className="homeright">
        <User
          userId={"user._id"}
          name={"God"}
          avatar={
            "data:image/jpeg;base64,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"
          }
        />
      </div>
    </div>
  );
};

export default Home;
