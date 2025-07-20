import React, { useState } from "react";
import { Navigate, useNavigate, useNavigation } from "react-router-dom";

const AccountDeleteForm = () => {
    const navigate=useNavigate();
    const userData = JSON.parse(localStorage.getItem('User Detail'))
    // console.log(userData,userData.email,userData.name);
    
  const [formData, setFormData] = useState({
    email: userData?.email || "",
    name: userData?.name || "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const deleteUserUrl = `${import.meta.env.VITE_URL}${import.meta.env.VITE_DELETE_USER}`;

    try {
      const response = await fetch(deleteUserUrl, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to delete the account. Please try again.");
      }

      const result = await response.json();
      setSuccess(result.message || "Account deleted Request successfully.");
      setFormData({ email: "", name: "", description: "" }); // Reset form
      // localStorage.clear();
      // navigate('/');
      // window.location.reload();
      
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 bg-white rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Request Account Deletion
        </h2>

        {/* Email Field */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Email (username)
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email/username"
          />
        </div>

        {/* Name Field */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your name"
          />
        </div>

        {/* Description Field */}
        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Provide a reason for deleting your account"
          />
        </div>

        {/* Feedback Messages */}
        {error && (
          <p className=" text-red-500 mb-4">{error}</p>
        )}
        {success && (
          <p className=" text-green-500 mb-4">{success}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 text-white rounded-md focus:ring-4 focus:ring-red-500 ${
            loading
              ? "bg-red-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {loading ? "Deleting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
};

export default AccountDeleteForm;
