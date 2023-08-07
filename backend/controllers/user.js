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
