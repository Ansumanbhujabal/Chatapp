const post = require("../models/post");
const user = require("../models/user");
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
    const newuser = await user.findById(req.user._id);
    newuser.posts.push(newPost._id);
    await newuser.save();

    res.status(200).json({
      success: true,
      post: newPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const newPost = await post.findById(req.params.id);
    if (!newPost) {
      return res.status(404).json({
        success: false,
        message: "post not Found",
      });
    }

    if (newPost.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "UnAuthorized Action",
      });
    }
    // await newPost.remove();
    await post.deleteOne({ _id: req.params.id });

    const newuser = await user.findById(req.user._id);
    const index = newuser.posts.indexOf(req.params._id);
    newuser.posts.splice(index, 1);
    await newuser.save();
    return res.status(200).json({
      success: true,
      message: "Post  Deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.likeAndUnlikePost = async (req, res) => {
  try {
    const newPost = await post.findById(req.params.id);
    if (!newPost) {
      return res.status(404).json({
        success: false,
        message: "post not Found",
      });
    }

    if (newPost.likes.includes(req.user._id)) {
      const index = newPost.likes.indexOf(req.user._id);
      newPost.likes.splice(index, 1);
      await newPost.save();
      return res.status(200).json({
        success: true,
        message: "post Unliked",
      });
    } else {
      newPost.likes.push(req.user._id);
      await newPost.save();
      return res.status(200).json({
        success: true,
        message: "post Liked",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
