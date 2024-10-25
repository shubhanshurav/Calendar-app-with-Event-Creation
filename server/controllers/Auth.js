const User = require("../models/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");

// Route to register a new user
exports.signUp = async (req, res, next) => {
  try {
    //data fetch from req ki body se
    const {fullName, email, password } = req.body;

    //validate details
    if (!email || !password || !fullName) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    //check user already exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(403).json({
        success: false,
        message: "User is already exists. Please sign in to continue.",
      });
    }

    //Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("first: ", hashedPassword);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    console.log("user = ", user);

    // return res
    return res.status(200).json({
      success: true,
      message: "User registered Successfully",
      user,
    });
  } catch (error) {
    next(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      });
    }

    const user = await User.findOne({ email });
    // const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`,
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), 
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "User Logged in Successfully",
      });

      return res.status(200).json({
          success: true,
          message: "User registered successfully",
          user,
          token,
        });

    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    });
  }
};
