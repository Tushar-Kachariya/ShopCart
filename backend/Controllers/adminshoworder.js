import Order from "../Models/order.js";

export const getAdminOrder = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "userName email phone address")
      .populate("products.productId", "name price image category")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("GET ADMIN ORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};