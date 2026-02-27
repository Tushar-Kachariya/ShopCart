import Product from "../Models/productModel.js";
import Order from "../Models/order.js";
import User from "../Models/User.js";

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
    const userId = req.user.id;
    const { cartItems } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    const add = await User.findOne(req.user);
    

    let totalAmount = 0;

    const products = cartItems.map((item) => {
      const itemTotal = item.price * item.quantity;
      totalAmount += itemTotal;

      return {
        productId: item._id,
        image: item.image,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: itemTotal,
      };
    });

    const order = await Order.create({
      userId,
      products,
      totalAmount,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("PLACE ORDER ERROR:", error.message);
    res.status(500).json({ message: "Internal server error" });
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
