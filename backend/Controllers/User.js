import bcrypt from 'bcrypt';
import User from "../Models/User.js";
import jwt from 'jsonwebtoken';

const JWT_SEC = 'myjsonwebtoken';
export const createUser = async (req, res) => {
  try {

    const { email, userName, password } = req.body;


    const exiestEmail = await User.findOne({ email });

    if (exiestEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const NewUser = await new User({
      userName,
      email,
      password: hashpassword
    });

    const saveUser = await NewUser.save();

    res.status(201).json({
      message: "User registered successfully",
      saveUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findOne({ email });
   
    if (!user) {
      return res.status(400).json({ message: "Email does not exist" });
    }
    if (user.isBlocked=== true) {
      return res.status(400).json({ message: "User is block" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    req.session.userId = user._id;

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      JWT_SEC
    );

    res.cookie("token", token, {
      maxAge: 1000 * 60 * 10,
      httpOnly: true,
      secure: false,
    });

    res.status(201).json({
      message: "User login successfully",
      user,
      token, 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      message: user.isBlocked ? "User blocked" : "User unblocked",
      user,
    });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};




export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteUSer = await User.findByIdAndDelete(
      id,
      req.body
    );

    if (!deleteUSer) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User delete successfully",
      user: deleteUSer,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getalluser = async (req, res) => {
  try {
    const getalluser = await User.find();

    if (!getalluser) {
      return res.status(404).json({ message: "Users not found" });
    }

    res.status(200).json({

      user: getalluser,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



export const logOut = async (req, res) => {


  try {

    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: " Could not log out", error: err.message });
        }
      })

    }
    res.clearCookie('token');
    res.clearCookie('connect.sid')

    res.status(200).json({


      message: "logout successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};