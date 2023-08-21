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

exports.getPostOfFollowing = async (req, res) => {
  try {
    const posttoUpdate = await user.findById(req.user._id);
    const theirPost = await post.find({
      owner: {
        $in: posttoUpdate.following,
      },
    });
    res.status(200).json({
      success: true,
      posts: theirPost.reverse(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateCaption = async (req, res) => {
  try {
    const posttoUpdate = await post.findById(req.params.id);
    if (!posttoUpdate) {
      return res.status(404).json({
        success: false,
        message: "post not found",
      });
    }
    if (posttoUpdate.owner.toString() !== req.user._id.toString()) {
      return res.status(404).json({
        success: false,
        message: "UnAuthorized access",
      });
    }
    posttoUpdate.caption = req.body.caption;
    await posttoUpdate.save();
    res.status(200).json({
      success: true,
      message: "Caption  Updated ",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.addComment = async (req, res) => {
  try {
    const userPost = await post.findById(req.params.id);
    if (!userPost) {
      return res.status(404).json({
        success: false,
        message: "Post not Found",
      });
    }

    //Checking If Comment Already exists
    let commentIndex = -1;
    userPost.comments.forEach((item, index) => {
      if (item.user.toString() === req.user._id.toString()) {
        commentIndex = index;
        return;
      }
    });

    if (commentIndex !== -1) {
      userPost.comments[commentIndex].comment = req.body.comment;

      await userPost.save();
      return res.status(200).json({
        success: true,
        message: "comment Updated",
      });
    } else {
      userPost.comments.push({
        user: req.user._id,
        comment: req.body.comment,
      });
    }

    await userPost.save();
    return res.status(200).json({
      success: true,
      message: "comment added",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const userPost = await post.findById(req.params.id);
    if (!userPost) {
      return res.status(404).json({
        success: false,
        message: "Post not Found",
      });
    }
    //Checking if owner wants to delete
    if (userPost.owner.toString() === req.user._id.toString()) {
      if (req.body.commentId == undefined) {
        res.status(400).json({
          success: false,
          message: "comment Id is required",
        });
      }

      userPost.comments.forEach((item, index) => {
        if (item._id.toString() === req.body.commentId.toString()) {
          return userPost.comments.splice(index, 1);
        }
      });
      await userPost.save();

      return res.status(200).json({
        success: true,
        message: "Selected comment has deleted",
      });
    } else {
      userPost.comments.forEach((item, index) => {
        if (item.user.toString() === req.user._id.toString()) {
          return userPost.comments.splice(index, 1);
        }
      });
    }

    await userPost.save();
    return res.status(200).json({
      success: true,
      message: "Your comment deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
