import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { z } from "zod";

export default function AddProduct() {
  const navigate = useNavigate();
  const [previews, setPreviews] = useState([]);
  const [data, setData] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
    description: "",
    image: [],
  });

  const [errors, setErrors] = useState({});

  const schema = z.object({
    name: z.string().min(3, "Product name must be at least 3 characters"),

    price: z
      .string()
      .regex(/^\d+$/, "Price must contain only numbers")
      .transform(Number)
      .refine((val) => val > 0, "Price must be greater than 0"),

    quantity: z
      .string()
      .regex(/^\d+$/, "Quantity must contain only numbers")
      .transform(Number)
      .refine((val) => val > 0, "Quantity must be greater than 0"),

    category: z.string().min(1, "Category is required"),

    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),

    images: z.array(z.instanceof(File)).min(1, "At least 1 image is required"),
  });

  const handleChange = (e) => {
    if (e.target.type === "file") {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      setData((prev) => ({
        ...prev,
        images: files,
      }));

      const previewUrls = files.map((file) => URL.createObjectURL(file));
      setPreviews(previewUrls);
    } else {
      setData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

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
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("quantity", data.quantity);
      formData.append("category", data.category);
      formData.append("description", data.description);

      data.images.forEach((file) => {
        formData.append("images", file);
      });
      await api.post("/admin/create", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

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
      <h2 className="text-2xl font-bold mb-6">Add Product</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <input
            className={`input w-full ${errors.name ? "border-red-500" : ""
              }`}
            name="name"
            placeholder="Name"
            onChange={handleChange}
            
          />
          <p className="text-red-500 text-sm">{errors.name}</p>
        </div>

        <div>
          <input
            className={`input w-full ${errors.price ? "border-red-500" : ""
              }`}
            name="price"
            type="number"
            placeholder="Price"
            onChange={handleChange}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-"].includes(e.key)) {
                e.preventDefault();
              }
            }}
          />
          <p className="text-red-500 text-sm">{errors.price}</p>
        </div>

        <div>
          <input
            className={`input w-full ${errors.price ? "border-red-500" : ""
              }`}
            name="quantity"
            type="number"
            placeholder="quantity"
            onChange={handleChange}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-"].includes(e.key)) {
                e.preventDefault();
              }
            }}
          />
          <p className="text-red-500 text-sm">{errors.quantity}</p>
        </div>

        <div>
          <select
            className={`input w-full ${errors.category ? "border-red-500" : ""
              }`}
            name="category"
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            <option value="toys">Toys</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="books">Books</option>
          </select>
          <p className="text-red-500 text-sm">{errors.category}</p>
        </div>

        <div>
          <input
            className={`input w-full ${errors.image ? "border-red-500" : ""
              }`}
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            multiple
          />
          <p className="text-red-500 text-sm">{errors.image}</p>
        </div>


        <div className="md:col-span-2">
          <textarea
            className={`input w-full h-28 ${errors.description ? "border-red-500" : ""
              }`}
            name="description"
            placeholder="Description"
            onChange={handleChange}
          />
          <p className="text-red-500 text-sm">{errors.description}</p>
        </div>

        {previews.length > 0 && (
          <div className="mt-4 flex gap-3 flex-wrap">
            {previews.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Preview ${i}`}
                className="w-24 h-24 object-cover rounded-lg border"
              />
            ))}
          </div>
        )}

      </div>

      <button
        type="submit"
        className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        Add Product
      </button>
    </form>
  );
}
