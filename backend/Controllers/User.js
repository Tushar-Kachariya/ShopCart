import bcrypt from 'bcrypt';
import User from "../Models/User.js";
import jwt from 'jsonwebtoken';
import Order from '../Models/order.js';

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
    if (user.isBlocked === true) {
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
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
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

export const toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // toggle block
    user.isBlocked = !user.isBlocked;

    await user.save();

    res.status(200).json({
      message: "User block status updated",
      isBlocked: user.isBlocked,
    });

  } catch (error) {
    console.error("TOGGLE BLOCK ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};




export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { userName, address } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only allowed fields
    if (userName) user.userName = userName;

    if (address) {
      user.address = {
        fullName: address.fullName || user.address?.fullName,
        phone: address.phone || user.address?.phone,
        street: address.street || user.address?.street,
        city: address.city || user.address?.city,
        state: address.state || user.address?.state,
        postalCode: address.postalCode || user.address?.postalCode,
        country: address.country || user.address?.country || "India",
        landmark: address.landmark || user.address?.landmark,
      };
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {
    console.error("UPDATE USER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getuseroreder = async (req, res) => {
  try {
    console.log("Logged User:", req.user); 

    const order = await Order.find({ userId: req.user._id })
      .populate("userId", "userName email role address")
      .populate("products.productId", "name price image category")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    console.error("GET ORDER ERROR FULL:", error); 
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

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.session.userId; 

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });

  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
