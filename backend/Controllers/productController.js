import Product from "../Models/productModel.js";
import Order from "../Models/order.js";
import User from "../Models/User.js";

export const productCreate = async (req, res) => {
  try {
    const { name, price,quantity, category, description } = req.body;

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
      instock:quantity,
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

export const updateOrderSatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "Product ID is required" });
    }

    const updatedProduct = await Order.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};


