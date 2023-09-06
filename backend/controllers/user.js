const user = require("../models/user");
const post = require("../models/post");
const { sendEmail } = require("../middlewares/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

exports.register = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;
    let existingUser = await user.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        success: false,
        message: "user already exist",
      });
    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "avatars",
    });

    const newUser = await user.create({
      name,
      email,
      password,
      avatar: { public_id: myCloud.public_id, url: myCloud.secure_url },
    });

    const token = await newUser.genrateToken();
    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(201).cookie("token", token, options).json({
      success: true,
      user: newUser,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await user
      .findOne({ email })
      .select("+password")
      .populate("posts followers following");
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }
    const isMatch = await existingUser.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Password",
      });
    }
    const token = await existingUser.genrateToken();
    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(200).cookie("token", token, options).json({
      success: true,
      user: existingUser,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
      .json({
        success: true,
        message: "Logged Out",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.followUser = async (req, res) => {
  try {
    const userToFollow = await user.findById(req.params.id);
    const loggedinUser = await user.findById(req.user._id);
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    if (loggedinUser.following.includes(userToFollow._id)) {
      const indexfollowing = loggedinUser.following.indexOf(userToFollow._id);
      const indexfollower = userToFollow.followers.indexOf(loggedinUser._id);
      loggedinUser.following.splice(indexfollowing, 1);
      userToFollow.followers.splice(indexfollower, 1);
      await loggedinUser.save();
      await userToFollow.save();
      return res.status(200).json({
        success: true,
        message: "User Unfollowed ",
      });
    } else {
      loggedinUser.following.push(userToFollow._id);
      userToFollow.followers.push(loggedinUser._id);
      await loggedinUser.save();
      await userToFollow.save();
      return res.status(200).json({
        success: true,
        message: "User Followed ",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const loggedinUser = await user.findById(req.user._id).select("+password");
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide Old and new Password",
      });
    }

    const isMatch = await loggedinUser.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(404).json({
        success: false,
        message: "Incorrect Old Password",
      });
    }
    loggedinUser.password = newPassword;
    await loggedinUser.save();
    res.status(200).json({
      success: true,
      message: "Password Updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const loggedinUser = await user.findById(req.user._id);
    const { name, email, avatar } = req.body;
    if (name) {
      loggedinUser.name = name;
    }
    if (email) {
      loggedinUser.email = email;
    }

    if (avatar) {
      await cloudinary.v2.uploader.destroy(loggedinUser.avatar.public_id);
      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
      });
      loggedinUser.avatar.public_id = myCloud.public_id;
      loggedinUser.avatar.url = myCloud.secure_url;
    }

    await loggedinUser.save();
    res.status(200).json({
      success: true,
      message: "Profile Updated ",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteMyProfile = async (req, res) => {
  try {
    const loggedinUser = await user.findById(req.user._id);
    const userPost = loggedinUser.posts;
    const followersOfuser = loggedinUser.followers;
    const userId = loggedinUser._id;
    const userFollowing = loggedinUser.following;
    await user.deleteOne({ _id: req.user._id });

    //logout user after delete

    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    //Al post delete

    for (let i = 0; i < userPost.length; i++) {
      const onePost = await post.findById(userPost[i]);
      await onePost.deleteOne();
    }

    //Removing user from followers following

    for (let i = 0; i < followersOfuser.length; i++) {
      const followerId = followersOfuser[i];
      const follower = await user.findById(followerId);
      if (follower) {
        const index = follower.following.indexOf(userId);
        if (index !== -1) {
          follower.following.splice(index, 1);
          await follower.save();
        }
      }
    }

    // Removing User from Following's Followers

    for (let i = 0; i < userFollowing.length; i++) {
      const followsId = userFollowing[i];
      const follows = await user.findById(followsId);
      if (follows) {
        const index = follows.followers.indexOf(userId);
        if (index !== -1) {
          follows.followers.splice(index, 1);
          await follows.save();
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Account Deleted successfully ",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.myProfile = async (req, res) => {
  try {
    const loggedinUser = await user
      .findById(req.user._id)
      .populate("posts followers following");
    res.status(200).json({
      success: true,
      user: loggedinUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyPosts = async (req, res) => {
  try {
    const loggedinUser = await user.findById(req.user._id);
    const allposts = [];
    for (let i = 0; i < loggedinUser.posts.length; i++) {
      const onepost = await post
        .findById(loggedinUser.posts[i])
        .populate("likes comments.user owner");
      allposts.push(onepost);
    }
    res.status(200).json({
      success: true,
      posts: allposts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const anyuser = await user
      .findById(req.params.id)
      .populate("posts followers following");

    if (!anyuser) {
      res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }
    res.status(200).json({
      success: true,
      user: anyuser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllUserProfile = async (req, res) => {
  try {
    const anyuser = await user.find({});

    res.status(200).json({
      success: true,
      users: anyuser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const loggedinUser = await user.findOne({ email: req.body.email });
    if (!loggedinUser) {
      return res.status(404).json({
        success: false,
        message: "User Not Found ",
      });
    }
    const resetPasswordToken = loggedinUser.getResetPasswordToken();
    // console.log(resetPasswordToken);
    // console.log(resetPasswordExpire);
    await loggedinUser.save();

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/password/reset/${resetPasswordToken}`;
    const messageForUser = `We received a request to reset the password for your account. 
    If you did not initiate this request, please ignore this email. 
    If you did request a password reset, please follow the instructions below.To reset your password,
    
     please click on the link below or copy and paste it into your web browser's address bar  \n \n ${resetUrl}`;
    try {
      await sendEmail({
        email: loggedinUser.email,
        subject: "Reset Password",
        messageForUser,
      });
      res.status(200).json({
        success: true,
        message: `Email sent to ${loggedinUser.email}`,
      });
    } catch (error) {
      loggedinUser.resetPasswordToken = undefined;
      loggedinUser.resetPasswordExpire = undefined;
      await loggedinUser.save();
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordTokenhere = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const loggedinUser = await user.findOne({
      resetPasswordToken: resetPasswordTokenhere,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!loggedinUser) {
      return res.status(401).json({
        success: false,
        message: "Token Invalid",
      });
    }
    loggedinUser.password = req.body.password;
    loggedinUser.resetPasswordToken = undefined;
    loggedinUser.resetPasswordExpire = undefined;
    await loggedinUser.save();
    res.status(200).json({
      success: true,
      message: "Possword Reset Successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
