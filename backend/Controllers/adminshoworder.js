import Order from "../Models/order.js";

export const getAdminOrder = async (req, res) => {
    try {
        const order = await Order.find()
            .populate("userId", "userName email role address") 
            .populate("products.productId", "name price image category");
        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("GET ORDER ERROR:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};