const post = require("../models/post");

exports.createPost = async (req, res) => {
  try {
    const newPostData = {
      caption: req.body.caption,
      image: {
        public_id: "String",
        url: "String",
      },
      owner: req.user._id,
    };
    const newPost = await post.create(newPostData);
    res.status(200).json({
      success: false,
      post: newPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
