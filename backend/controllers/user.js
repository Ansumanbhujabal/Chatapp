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

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
