import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
// import { createNewPost } from "../../Actions/Post";
import { loadUser } from "../../Actions/User";
import "./NewPost.css";

const NewPost = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
  };

  const { loading, error, message } = useSelector((state) => state.like);
  const dispatch = useDispatch();

  return (
    <div className="newPost">
      <form className="newPostForm">
        <Typography variant="h3">New Post</Typography>
        {image && <img src={image} alt="post" />}
        <input type="file" accept="image/" onChange={handleImageChange} />
        <input
          type="text"
          placeholder="Caption.."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <Button type="submit">Post</Button>
      </form>
    </div>
  );
};

export default NewPost;