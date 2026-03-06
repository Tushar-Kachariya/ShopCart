import bcrypt from 'bcrypt';
import User from "../Models/User.js";
import jwt from 'jsonwebtoken';
import otpGenerator from "otp-generator";
import Order from '../Models/order.js';
import { transporter } from "../config/Email.config.js";


export const createUser = async (req, res) => {
  try {
    const { email, userName, contect, password } = req.body;

    if (!email || !userName || !contect || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    const existingContact = await User.findOne({ contect });

    if (existingContact && !existingUser) {
      return res.status(400).json({
        message: "Contact number already registered",
      });
    }

    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false, });

    const otpExpire = Date.now() + 5 * 60 * 1000;

    if (existingUser) {

      if (existingUser.isVerified) {
        return res.status(400).json({
          message: "Email already registered",
        });
      }

      existingUser.userName = userName;
      existingUser.contect = contect;
      existingUser.password = await bcrypt.hash(password, 10);
      existingUser.otp = otp;
      existingUser.otpExpire = otpExpire;

      await existingUser.save();

      await transporter.sendMail({
        from: `"ShopCart Support" <${process.env.EMAIL}>`,
        to: email,
        subject: "ShopCart Email Verification OTP",
        html: `
        <div style="font-family:Arial;background:#f4f4f4;padding:30px;">
          <div style="max-width:500px;margin:auto;background:white;padding:30px;border-radius:10px;text-align:center;">
            <h2 style="color:#111;">Verify Your Email</h2>
            <p>Hello <b>${userName}</b>, use the OTP below to verify your ShopCart account.</p>
            <div style="font-size:32px;font-weight:bold;letter-spacing:6px;color:#2563eb;margin:20px 0;">
              ${otp}
            </div>
            <p>This OTP will expire in <b>5 minutes</b>.</p>
            <p style="font-size:12px;color:gray;">If you didn't request this email, ignore it.</p>
          </div>
        </div>
        `,
      });

      return res.status(200).json({
        message: "OTP resent to your email",
      });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const user = new User({
      userName,
      email,
      contect,
      password: hashpassword,
      otp,
      otpExpire,
      isVerified: false,
    });

    await user.save();

    await transporter.sendMail({
      from: `"ShopCart Support" <${process.env.EMAIL}>`,
      to: email,
      subject: "ShopCart Email Verification OTP",
      html: `
      <div style="font-family:Arial;background:#f4f4f4;padding:30px;">
        <div style="max-width:500px;margin:auto;background:white;padding:30px;border-radius:10px;text-align:center;">
          <h2 style="color:#111;">Verify Your Email</h2>
          <p>Hello <b>${userName}</b>, use the OTP below to verify your ShopCart account.</p>
          <div style="font-size:32px;font-weight:bold;letter-spacing:6px;color:#2563eb;margin:20px 0;">
            ${otp}
          </div>
          <p>This OTP will expire in <b>5 minutes</b>.</p>
          <p style="font-size:12px;color:gray;">If you didn't request this email, ignore it.</p>
        </div>
      </div>
      `,
    });

    res.status(200).json({
      message: "OTP sent to your email",
    });

  } catch (error) {
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
    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your email first"
      })
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

export const getUserOrder = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const orders = await Order.find({
      userId: req.user._id,
    })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,   // IMPORTANT: property name = orders
    });

  } catch (error) {
    console.error("GET USER ORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
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


export const verifyOTP = async (req, res) => {
  try {

    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpire = null;

    await user.save();

    res.status(200).json({
      message: "Email verified successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};