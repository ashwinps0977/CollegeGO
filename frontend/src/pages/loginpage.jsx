import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getButtonStyle = (role) => `
    px-6 py-3 rounded-lg text-white font-semibold transition duration-300 
    ${selectedRole === role ? "bg-green-600 shadow-lg" : "bg-blue-500 hover:bg-blue-600"}
  `;

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("📤 Sending Login Request:", { username, password, role: selectedRole });

    if (!selectedRole) {
      setError("Please select a role!");
      return;
    }

    if (!username || !password) {
      setError("All fields are required!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/login", {
        username,
        password,
        role: selectedRole,
      });

      console.log("✅ Response:", response.data);
      sessionStorage.setItem("user", JSON.stringify(response.data.user));
      alert("Login successful!");

      if (selectedRole === "Student") navigate("/request1");
      else if (selectedRole === "HOD") navigate("/Hod1");

      else if (selectedRole === "Warden") navigate("/warden");
    } catch (error) {
      console.error("❌ Login Error:", error.response?.data || error);
      setError(error.response?.data?.error || "Invalid username or password");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white w-full text-blue-600 text-3xl font-extrabold py-5 text-center shadow-lg rounded-b-lg">
        CollegeGO
      </div>

      <div className="bg-white shadow-2xl rounded-xl p-10 w-full max-w-md mt-10">
        <h2 className="text-center text-2xl font-bold text-gray-700">A Safe Eco-Pass</h2>
        <h3 className="text-center text-lg font-medium text-gray-500 mt-2">Select Your Role</h3>

        <div className="flex justify-center gap-4 mt-6">
          <button className={getButtonStyle("Student")} onClick={() => setSelectedRole("Student")}>
            Student
          </button>
          <button className={getButtonStyle("HOD")} onClick={() => setSelectedRole("HOD")}>
            HOD
          </button>
          <button className={getButtonStyle("Warden")} onClick={() => setSelectedRole("Warden")}>
            Warden
          </button>
        </div>

        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

        <form onSubmit={handleLogin} className="mt-6">
          <input
            type="text"
            placeholder="Enter your username or ID"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm mt-4"
          />

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-6 shadow-lg transform transition duration-300 hover:scale-105">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
