import Product from "../Models/productModel.js";

export const productCreate = async (req, res) => {
  try {
    const { name, price, category, image, description } = req.body;

    if (!name || !price || !category || !image || !description) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const newProduct = await Product.create({
      name,
      price: Number(price),
      category,
      image,
      description,
    });


    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error.message);
    res.status(500).json({
      msg: error.message,
    });
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

export const productUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "Product ID is required" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id,req.body);

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


