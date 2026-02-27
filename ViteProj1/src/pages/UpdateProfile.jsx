import { useState, useEffect } from "react";
import api from "../api/axios";
import Navbar from "../componets/Navbar";
import Footer from "../componets/Footer";
import { useNavigate } from "react-router-dom";

export default function UpdateProfile() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState({
        _id: "",
        userName: "",
        address: {
            fullName: "",
            phone: "",
            street: "",
            city: "",
            state: "",
            postalCode: "",
            landmark: "",
        },
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/user/profile");
                const userData = res.data.user;

                setUser({
                    _id: userData._id,
                    userName: userData.userName || "",
                    address: {
                        fullName: userData.address?.fullName || "",
                        phone: userData.address?.phone || "",
                        street: userData.address?.street || "",
                        city: userData.address?.city || "",
                        state: userData.address?.state || "",
                        postalCode: userData.address?.postalCode || "",
                        landmark: userData.address?.landmark || "",
                    },
                });

                setLoading(false);
            } catch (error) {
                console.log("Fetch error:", error.response?.data || error.message);
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith("address.")) {
            const key = name.split(".")[1];

            setUser((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [key]: value,
                },
            }));
        } else {
            setUser((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.put(`/user/updateuser/${user._id}`, {
                userName: user.userName,
                address: user.address,
            });

            alert("Profile updated successfully ");
            navigate("/profile");
        } catch (error) {
            console.log("Update error:", error.response?.data || error.message);
        }
    };

    if (loading)
        return <div className="text-center mt-20 text-lg">Loading...</div>;

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
                <div className="max-w-4xl mx-auto">

                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600 shadow-inner">
                            {user.userName?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                {user.userName}
                            </h1>
                            <p className="text-gray-500 text-sm">
                                Manage your personal information
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">
                            Personal Information
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-8">

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="userName"
                                    value={user.userName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                                />
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                                    Address Details
                                </h3>

                                <div className="grid md:grid-cols-2 gap-6">

                                    {[
                                        { label: "Full Name", key: "fullName" },
                                        { label: "Phone Number", key: "phone" },
                                        { label: "Street Address", key: "street" },
                                        { label: "City", key: "city" },
                                        { label: "State", key: "state" },
                                        { label: "Postal Code", key: "postalCode" },
                                        { label: "Landmark", key: "landmark", full: true },
                                    ].map((field) => (
                                        <div
                                            key={field.key}
                                            className={field.full ? "md:col-span-2" : ""}
                                        >
                                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                                {field.label}
                                            </label>

                                            <input
                                                type="text"
                                                name={`address.${field.key}`}
                                                value={user.address[field.key]}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                                            />
                                        </div>
                                    ))}

                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg active:scale-95 transition-all duration-200"
                                >
                                    Save Changes
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );

}
