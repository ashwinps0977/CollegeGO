import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateAccount = () => {
  const navigate = useNavigate();
  const branches = ["CS", "MECH", "AD", "CY", "EC", "EEE", "ECS", "CIVIL"];
  const semesters = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    branch: "",
    semester: "",
    email: "",
    mobile: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name" && !/^[A-Za-z\s]*$/.test(value)) return;
    if (name === "username") {
      const usernamePattern = new RegExp(`^\\d{2}(${branches.join("|")})\\d{3}$`);
      if (!usernamePattern.test(value)) return;
    }
    if (name === "mobile" && (!/^\d{0,10}$/.test(value) || value.length > 10)) return;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.mobile.length !== 10) {
      alert("Mobile number must be exactly 10 digits.");
      return;
    }

    localStorage.setItem("user", JSON.stringify(formData));
    alert("Account Created Successfully!");

    // Reset only the username and password fields
    setFormData((prevState) => ({
      ...prevState,
      username: "",
      password: "",
    }));

    navigate("/loginpage");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">Create Account</h2>

        <form className="mt-6" onSubmit={handleSubmit}>
          {[
            { label: "Name", name: "name", type: "text" },
            { label: "Username", name: "username", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Mobile No", name: "mobile", type: "tel" },
            { label: "Password", name: "password", type: "password" },
          ].map((field) => (
            <div key={field.name} className="mt-4">
              <label className="block text-gray-700 text-sm">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                placeholder={`Enter your ${field.label.toLowerCase()}`}
                value={formData[field.name]}
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
                <option key={branch} value={branch}>
                  {branch}
                </option>
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
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-gray-600 text-sm text-center mt-4">
          Already have an account?{" "}
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
