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

const signinUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("-__v");

    if (!user) {
      return res.status(400).json({ message: "Inavalid credential." });
    }

    const isPasswordCorrect = user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Inavalid credential." });
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save();

    const options = {
      secure: true,
      httpOnly: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "User signed in successfully.",
        data: user.getUserDetails(),
      });
  } catch (error) {
    console.log("Error while signing in user.", error);
    res
      .status(500)
      .json({ message: error.message || "Error while signing in user." });
  }
};

const signoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        message: "User logged out successfully.",
      });
  } catch (error) {
    console.log("Error while signing out user.", error);
    res.status(500).json({
      message: error.message || "Error while signing out user.",
    });
  }
};

export { signupUser, signinUser, signoutUser };
