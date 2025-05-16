import { User } from "../models/user.model.js";

const signupUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email is already in use.",
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role,
    });

    if (!newUser) {
      return res.status(500).json({ message: "Error while signingup user." });
    }

    const accessToken = newUser.generateAccessToken();
    const refreshToken = newUser.generateRefreshToken();

    newUser.refreshToken = refreshToken;

    await newUser.save();

    const options = {
      secure: true,
      httpOnly: true,
    };

    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "User signed up successfully.",
        data: newUser.getUserDetails(),
      });
  } catch (error) {
    console.log("Error while signingup user: ", error);
    res.status(500).json({ message: "Error while signingup user." });
  }
};

export { signupUser };
