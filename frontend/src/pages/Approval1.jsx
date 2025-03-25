import React from "react";
import { FaUserShield, FaChalkboardTeacher, FaUniversity } from "react-icons/fa";

const Approval = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="grid grid-cols-3 gap-6">
        {/* Warden */}
        <button className="flex flex-col items-center p-6 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
          <FaUserShield size={40} />
          <span className="mt-2 text-lg font-semibold">Warden</span>
        </button>

        {/* Faculty */}
        <button className="flex flex-col items-center p-6 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
          <FaChalkboardTeacher size={40} />
          <span className="mt-2 text-lg font-semibold">Faculty</span>
        </button>

        {/* HOD */}
        <button className="flex flex-col items-center p-6 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
          <FaUniversity size={40} />
          <span className="mt-2 text-lg font-semibold">HOD</span>
        </button>
      </div>
    </div>
  );
};

export default Approval;
