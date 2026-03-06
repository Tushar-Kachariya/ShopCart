import Product from "../Models/productModel.js";
import Order from "../Models/order.js";
import User from "../Models/User.js";
import nodemailer from 'nodemailer'

export const getProduct = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const productSearch = async (req, res) => {
  try {
    const search = req.query.search || "";

    const products = await Product.find({
      name: { $regex: search, $options: "i" },
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("SEARCH ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { cartItems, shippingAddress, billingAddress, paymentMethod } = req.body;

    if (!userId)
      return res.status(401).json({ message: "Unauthorized" });

    if (!cartItems || cartItems.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    let totalAmount = 0;
    const products = [];

    // Validate & Calculate
    for (const item of cartItems) {
      const product = await Product.findById(item._id);

      if (!product)
        return res.status(404).json({ message: "Product not found" });

      if (product.instock < item.quantity)
        return res.status(400).json({
          message: `${product.name} is out of stock`,
        });

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      await Product.findByIdAndUpdate(product._id, {
        $inc: { instock: -item.quantity },
      });

      products.push({
        productId: product._id,
        image:
          product.images?.[0] ||
          "https://via.placeholder.com/150",
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        total: itemTotal,
      });
    }

    const shippingCharge = 50;

    const order = await Order.create({
      userId,
      products,
      shippingAddress,
      billingAddress,
      paymentMethod,
      charge: shippingCharge,
      totalAmount: totalAmount + shippingCharge,
    });

    // Send Email
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
      subject: "ShopCart Order Confirmation",
      html: `
  <div style="font-family: Arial, Helvetica, sans-serif; background:#f4f6f8; padding:30px;">
    
    <div style="max-width:600px; margin:auto; background:white; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

      <!-- Header -->
      <div style="background:#111827; padding:20px; text-align:center;">
        <h1 style="color:white; margin:0;">ShopCart</h1>
        <p style="color:#d1d5db; margin:5px 0 0;">Order Confirmation</p>
      </div>

      <!-- Body -->
      <div style="padding:25px;">

        <h2 style="color:#111827;">Thank you, ${user.userName} 🎉</h2>

        <p style="color:#6b7280;">
          Your order has been successfully placed. Below are your order details.
        </p>

        <p style="font-size:14px; color:#374151;">
          <b>Order ID:</b> ${order._id}
        </p>

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;"/>

        <!-- Products -->
        ${products
          .map(
            (p) => `
            <div style="display:flex; align-items:center; margin-bottom:15px; border-bottom:1px solid #f3f4f6; padding-bottom:10px;">
              
              <img src="${p.image}" 
                   style="width:70px; height:70px; object-fit:cover; border-radius:8px; margin-right:15px;" />

              <div style="flex:1;">
                <p style="margin:0; font-weight:bold; color:#111827;">
                  ${p.name}
                </p>

                <p style="margin:4px 0; font-size:14px; color:#6b7280;">
                  Quantity: ${p.quantity}
                </p>
              </div>

              <div style="font-weight:bold; color:#111827;">
                ₹${p.total}
              </div>

            </div>
          `
          )
          .join("")}

        <!-- Total -->
        <div style="margin-top:20px; padding-top:15px; border-top:2px solid #e5e7eb;">
          <h3 style="text-align:right; color:#111827;">
            Total: ₹${order.totalAmount}
          </h3>
        </div>

        <p style="margin-top:20px; font-size:14px; color:#6b7280;">
          We will notify you once your order is shipped.
        </p>

      </div>

      <!-- Footer -->
      <div style="background:#f9fafb; text-align:center; padding:15px; font-size:12px; color:#9ca3af;">
        © ${new Date().getFullYear()} ShopCart. All rights reserved.
      </div>

    </div>

  </div>
  `,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getOneProduct = async (req, res) => {
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
