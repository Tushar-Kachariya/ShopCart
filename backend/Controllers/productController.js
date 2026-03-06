import Product from "../Models/productModel.js";
import Order from "../Models/order.js";
import User from "../Models/User.js";
import nodemailer from 'nodemailer';

export const productCreate = async (req, res) => {
  try {
    const { name, price, quantity, category, description } = req.body;

    const images = (req.files || []).map((file) => `/uploads/${file.filename}`);

    if (!name || !price || !category || !description) {
      return res.status(400).json({ success: false, msg: "All fields are required" });
    }

    if (images.length === 0) {
      return res.status(400).json({ success: false, msg: "At least one image is required" });
    }

    const newProduct = await Product.create({
      name,
      price: Number(price),
      instock: quantity,
      category,
      description,
      images,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return res.status(500).json({ success: false, msg: error.message });
  }
};
export const productGet = async (req, res) => {
  try {
    const products = await Product.find();

    if (!products || products.length === 0) {
      return res.status(404).json({ msg: "No products found" });
    }

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const productDelete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "Product ID is required" });
    }

    const delProduct = await Product.findByIdAndDelete(id);

    if (!delProduct) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product: delProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "user ID is required" });
    }

    const delUser = await User.findByIdAndDelete(id);

    if (!delUser) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "user deleted successfully",
      product: delUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const productGetOne = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      product
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const productUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "Product ID is required" });
    }

    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }

    if (req.body.price) {
      req.body.price = Number(req.body.price);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });




    if (!updatedProduct) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({ msg: "Order ID is required" });
    }

    const updateOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updateOrder) {
      return res.status(404).json({ msg: "Order not found" });
    }

    const user = await User.findById(updateOrder.userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Send email only for specific statuses
    if (status === "Confirmed" || status === "Delivered") {

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"ShopCart" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "ShopCart Order Update",
        html: `
        <div style="font-family: Arial; background:#f4f6f8; padding:30px;">
        
        <div style="max-width:600px; margin:auto; background:white; border-radius:10px; overflow:hidden;">
    
        <div style="background:#111827; padding:20px; text-align:center;">
            <h1 style="color:white;margin:0;">ShopCart</h1>
        </div>
    
        <div style="padding:25px;">
    
        <h2>Hello ${user.userName} 👋</h2>
    
        <p>Your order status has been updated.</p>
    
        <p><b>Order ID:</b> ${updateOrder._id}</p>
    
        <p><b>Status:</b> ${status}</p>
    
        <hr/>
    
        ${updateOrder.products
          .map(
            (p) => `
            <div style="display:flex;margin-bottom:10px;">
              <img src="${p.image}" width="60" style="margin-right:10px"/>
              <div>
                <b>${p.name}</b>
                <p>Qty: ${p.quantity}</p>
              </div>
              <div style="margin-left:auto">
                ₹${p.total}
              </div>
            </div>
          `
          )
          .join("")}
    
        <h3 style="text-align:right">Total: ₹${updateOrder.totalAmount}</h3>
    
        </div>
    
        <div style="background:#f9fafb;text-align:center;padding:10px;">
        © ${new Date().getFullYear()} ShopCart
        </div>
    
        </div>
    
        </div>
        `,
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updateOrder,
    });

  } catch (error) {
    console.error("UPDATE ORDER ERROR:", error);
    res.status(500).json({ msg: "Server error" });
  }
};


