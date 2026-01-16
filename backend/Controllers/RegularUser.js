import Product from "../Models/productModel.js";
export const getProduct = async (req, res) => {
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

export const productSearch = async (req, res) => {
  try {
    const search = req.query.search || "";
    const products = await Product.find({
    name: { $regex: search, $options: "i" } 
  
  });

  res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};
