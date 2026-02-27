import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { z } from "zod";

function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState([]);

  useEffect(() => {
    fetchProduct();
  }, []);

  // ✅ Updated Schema
  const schema = z.object({
    name: z.string().min(2, "Product name must be at least 2 characters"),
    price: z.coerce.number().min(1, "Price must be greater than 0"),
    instock: z.coerce
      .number()
      .min(0, "Stock cannot be negative"), // allow 0
    category: z.string().min(1, "Category is required"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    images: z.array(z.string()).optional(),
  });

  // ✅ Fetch Product
  const fetchProduct = async () => {
    try {
      const res = await api.get(`/admin/get/${id}`, {
        withCredentials: true,
      });

      const product = res.data.product;

      setData(product);

      const imageList = product.images || [];

      const formattedImages = imageList.map((img) =>
        img.startsWith("data:image")
          ? img
          : `http://localhost:5000${img}`
      );

      setPreview(formattedImages);

    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  if (!data) return <p className="text-center mt-10">Loading...</p>;

  // ✅ Handle Input Change
  const handleChange = (e) => {
    if (e.target.type === "file") {
      const files = Array.from(e.target.files);

      const readers = files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then((base64Images) => {
        setData((prev) => ({
          ...prev,
          images: base64Images,
        }));

        setPreview(base64Images);
      });

    } else {
      setData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  // ✅ Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = schema.safeParse(data);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });

      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      await api.put(
        `/admin/update/${id}`,
        {
          ...data,
          price: Number(data.price),
          instock: Number(data.instock), // ✅ force number
        },
        {
          withCredentials: true,
        }
      );

      navigate("/admin");

    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow max-w-2xl"
    >
      <h2 className="text-2xl font-bold mb-6">Update Product</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Name */}
        <div>
          <input
            name="name"
            value={data.name}
            onChange={handleChange}
            className="input w-full"
          />
          <p className="text-red-500 text-sm">{errors.name}</p>
        </div>

        {/* Price */}
        <div>
          <input
            name="price"
            type="number"
            min="1"
            value={data.price}
            onChange={handleChange}
            className="input w-full"
          />
          <p className="text-red-500 text-sm">{errors.price}</p>
        </div>

        {/* Stock */}
        <div>
          <input
            name="instock"
            type="number"
            min="0" // ✅ prevent negative typing
            value={data.instock}
            onChange={handleChange}
            className="input w-full"
          />
          <p className="text-red-500 text-sm">{errors.instock}</p>
        </div>

        {/* Category */}
        <div>
          <select
            name="category"
            value={data.category}
            onChange={handleChange}
            className="input w-full"
          >
            <option value="">Select Category</option>
            <option value="toys">Toys</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="books">Books</option>
          </select>
          <p className="text-red-500 text-sm">{errors.category}</p>
        </div>

        {/* Images */}
        <div>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleChange}
            className="input w-full"
          />
          <p className="text-red-500 text-sm">{errors.images}</p>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <textarea
            name="description"
            value={data.description}
            onChange={handleChange}
            className="input w-full h-28"
          />
          <p className="text-red-500 text-sm">{errors.description}</p>
        </div>

        {/* Image Preview */}
        <div className="md:col-span-2 mt-4 flex gap-4 flex-wrap">
          {preview.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="Product"
              className="w-32 h-32 object-cover rounded-lg border"
            />
          ))}
        </div>

      </div>

      <button
        type="submit"
        className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        Update Product
      </button>
    </form>
  );
}

export default UpdateProduct;