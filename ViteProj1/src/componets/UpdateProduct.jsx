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
  }, [id]);

  /* ---------- VALIDATION ---------- */

  const schema = z.object({
    name: z.string().min(2, "Product name must be at least 2 characters"),
    price: z.number().min(1, "Price must be greater than 0"),
    instock: z.number().min(0, "Stock cannot be negative"),
    category: z.string().min(1, "Category is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    images: z.array(z.string()).optional(),
  });

  /* ---------- FETCH PRODUCT ---------- */

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/admin/get/${id}`, {
        withCredentials: true,
      });

      const product = res.data.product;

      setData({
        ...product,
        price: Number(product.price),
        instock: Number(product.instock),
      });

      const images = product.images || [];

      const formatted = images.map((img) =>
        img.startsWith("data:image")
          ? img
          : `http://localhost:5000${img}`
      );

      setPreview(formatted);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  if (!data) return <p className="text-center mt-10">Loading...</p>;

  /* ---------- INPUT CHANGE ---------- */

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const fileArray = Array.from(files);

      const readers = fileArray.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then((base64Images) => {
        setData((prev) => ({
          ...prev,
          images: [...(prev.images || []), ...base64Images],
        }));

        setPreview((prev) => [...prev, ...base64Images]);
      });

    } else {
      setData((prev) => ({
        ...prev,
        [name]:
          name === "price" || name === "instock"
            ? Number(value)
            : value,
      }));
    }
  };

  /* ---------- REMOVE IMAGE ---------- */

  const removeImage = (index) => {
    const newPreview = preview.filter((_, i) => i !== index);
    const newImages = (data.images || []).filter((_, i) => i !== index);

    setPreview(newPreview);

    setData((prev) => ({
      ...prev,
      images: newImages,
    }));
  };

  /* ---------- SUBMIT ---------- */

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
      console.log("Sending data:", data);

      await api.put(`/admin/update/${id}`, data, {
        withCredentials: true,
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
      <h2 className="text-2xl font-bold mb-6">Update Product</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* NAME */}
        <div>
          <input
            name="name"
            value={data.name}
            onChange={handleChange}
            className="input w-full"
            placeholder="Product Name"
          />
          <p className="text-red-500 text-sm">{errors.name}</p>
        </div>

        {/* PRICE */}
        <div>
          <input
            name="price"
            type="number"
            step="1"
            min="1"
            value={data.price}
            onChange={handleChange}
            onWheel={(e) => e.target.blur()}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-"].includes(e.key)) {
                e.preventDefault();
              }
            }}
            className="input w-full"
          />
          <p className="text-red-500 text-sm">{errors.price}</p>
        </div>

        {/* STOCK */}
        <div>
          <input
            name="instock"
            type="number"
            step="1"
            min="0"
            value={data.instock}
            onChange={handleChange}
            onWheel={(e) => e.target.blur()}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-"].includes(e.key)) {
                e.preventDefault();
              }
            }}
            className="input w-full"
          />
          <p className="text-red-500 text-sm">{errors.instock}</p>
        </div>

        {/* CATEGORY */}
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
        </div>

        {/* IMAGES */}
        <div>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleChange}
            className="input w-full"
          />
        </div>

        {/* DESCRIPTION */}
        <div className="md:col-span-2">
          <textarea
            name="description"
            value={data.description}
            onChange={handleChange}
            className="input w-full h-28"
          />
        </div>

        {/* IMAGE PREVIEW */}
        <div className="md:col-span-2 flex gap-4 flex-wrap">
          {preview.map((img, index) => (
            <div key={index} className="relative">
              <img
                src={img}
                className="w-32 h-32 object-cover rounded-lg border"
              />

              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 text-xs rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

      </div>

      <button
        type="submit"
        className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg"
      >
        Update Product
      </button>
    </form>
  );
}

export default UpdateProduct;