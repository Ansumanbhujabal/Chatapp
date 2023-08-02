const user = require("../models/user");

exports.register = async (req, res) => {
  try {
    const { name, email, apssword } = req.body;
    let user = user.findOne({ email });
    if (user)
      return res.status(400).json({
        success: false,
        message: "user already exist",
      });
    user = await user.create({
      name,
      email,
      password,
      avatar: { public_id: "string", url: "string" },
    });

    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
