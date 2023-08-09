const user = require("../models/user");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let existingUser = await user.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        success: false,
        message: "user already exist",
      });
    const newUser = await user.create({
      name,
      email,
      password,
      avatar: { public_id: "string", url: "string" },
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
    const existingUser = await user.findOne({ email }).select("+password");
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
    const loggedinUser = await user.findById(req.user._id);
    const { oldPassword, newPassword } = req.body;
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
