import React, { useState } from "react";

const Login = () => {
  // State Variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState("Login"); // Toggle between Login & Sign Up
  const [error, setError] = useState("");

  // Handle Form Submit
  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (state === "Sign Up") {
      // Save user data in local storage
      if (!name || !email || !password) {
        setError("All fields are required!");
        return;
      }

      const userData = { name, email, password };
      localStorage.setItem("user", JSON.stringify(userData));
      alert("Account Created Successfully!");
      setState("Login"); // Switch to login after signup
      setError("");
    } else {
      // Login Validation
      const savedUser = JSON.parse(localStorage.getItem("user"));

      if (savedUser && savedUser.email === email && savedUser.password === password) {
        alert(`Welcome back, ${savedUser.name}!`);
        setError("");
      } else {
        setError("Invalid Email or Password!");
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {/* Form */}
        <form className="mt-6" onSubmit={onSubmitHandler}>
          {/* Name Field (Only for Sign Up) */}
          {state === "Sign Up" && (
            <div>
              <label className="block text-gray-700 text-sm">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
          )}

          {/* Email Field */}
          <div className="mt-4">
            <label className="block text-gray-700 text-sm">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Password Field */}
          <div className="mt-4">
            <label className="block text-gray-700 text-sm">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {state}
          </button>
        </form>

        {/* Toggle between Login & Sign Up */}
        <p className="text-gray-600 text-sm text-center mt-4">
          {state === "Sign Up" ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => {
              setState(state === "Sign Up" ? "Login" : "Sign Up");
              setError(""); // Reset error on toggle
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
