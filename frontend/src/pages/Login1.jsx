import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [name, setName] = useState("");
  const [state, setState] = useState("Login"); // Toggle between Login & Sign Up
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (state === "Sign Up") {
      // Sign Up Logic
      if (!name || !formData.username || !formData.password) {
        setError("All fields are required!");
        return;
      }
      try {
        await axios.post("http://localhost:5000/register", {
          name,
          username: formData.username,
          password: formData.password,
        });
        alert("Account Created Successfully!");
        setState("Login");
      } catch (error) {
        setError(error.response?.data?.error || "Registration failed");
      }
    } else {
      // Login Logic
      try {
        const response = await axios.post("http://localhost:5000/login", formData);
        sessionStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/new-movement-request");
      } catch (error) {
        setError(error.response?.data?.error || "Login failed");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form className="mt-6" onSubmit={handleSubmit}>
          {state === "Sign Up" && (
            <div>
              <label className="block text-gray-700 text-sm">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
          )}

          <div className="mt-4">
            <label className="block text-gray-700 text-sm">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 text-sm">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {state}
          </button>
        </form>

        <p className="text-gray-600 text-sm text-center mt-4">
          {state === "Sign Up" ? "Already have an account?" : "Don't have an account?"} {" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => {
              setState(state === "Sign Up" ? "Login" : "Sign Up");
              setError("");
            }}
          >
            {state === "Sign Up" ? "Login here" : "Sign up here"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
