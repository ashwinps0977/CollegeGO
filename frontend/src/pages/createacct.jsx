import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateAccount = () => {
  const navigate = useNavigate();
  const branches = ["CS", "MECH", "AD", "CY", "EC", "EEE", "ECS", "CIVIL"];
  const semesters = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    branch: "",
    semester: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name" && !/^[A-Za-z\s]*$/.test(value)) return;
    if (name === "mobile" && (!/^\d*$/.test(value) || value.length > 10)) return;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    setLoading(true);
    try {
      console.log("Sending request to backend...");

      const response = await axios.post("http://localhost:5001/register", formData);

      console.log("Response from backend:", response.data);

      setSuccess(response.data.message);
      
      // Store user data in sessionStorage
      sessionStorage.setItem("user", JSON.stringify({
        username: formData.username,
        name: formData.name,
        role: "Student" // Since this is the student registration
      }));
      
      // Dispatch event to notify Navbar and other components
      window.dispatchEvent(new Event('user-authenticated'));
      
      setTimeout(() => navigate("/loginpage"), 2000);
    } catch (error) {
      console.error("Error registering user:", error.response?.data || error);
      setError(error.response?.data?.error || "Error registering user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">Create Account</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center">{success}</p>}

        <form className="mt-6" onSubmit={handleSubmit}>
          {["name", "username", "email", "mobile", "password", "confirmPassword"].map((field) => (
            <div key={field} className="mt-4">
              <label className="block text-gray-700 text-sm">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type={field.includes("password") ? "password" : "text"}
                name={field}
                placeholder={`Enter your ${field}`}
                value={formData[field]}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>
          ))}

          <div className="mt-4">
            <label className="block text-gray-700 text-sm">Branch</label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 text-sm">Semester</label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">Select Semester</option>
              {semesters.map((sem) => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-gray-600 text-sm text-center mt-4">
          Already have an account?{' '}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate("/loginpage")}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default CreateAccount;