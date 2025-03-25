import React from "react";
import { assets } from "../assets/assets";

const Contact1 = () => {
  return (
    <div className="flex flex-col items-center py-12 px-6">
      {/* Contact Heading */}
      <h2 className="text-2xl font-semibold text-gray-700 uppercase mb-6">
        CONTACT <span className="font-bold">US</span>
      </h2>

      {/* Main Container */}
      <div className="flex flex-col md:flex-row items-center max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
        
        {/* Left: Image Section */}
        <div className="w-full md:w-1/2">
          <img
            src={assets.collogo}  // Replace with the actual CollegeGO image
            alt="Contact CollegeGO"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right: Contact Info */}
        <div className="w-full md:w-1/2 p-8">
          
          {/* Office Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800">OUR OFFICE</h3>
            <p className="text-gray-600 mt-2">
              CollegeGO Headquarters <br />
              123 Campus Road, City Name, Country
            </p>
            <p className="text-gray-600 mt-2">
              Tel: +123 456 7890 <br />
              Email: support@collegego.com
            </p>
          </div>

          {/* Careers Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              CAREERS AT COLLEGEGO
            </h3>
            <p className="text-gray-600 mt-2">
              Join our team to build the future of digital bus pass management.
            </p>
            <button className="mt-4 px-4 py-2 border border-gray-700 text-gray-700 rounded-lg hover:bg-gray-100 transition">
              Explore Jobs
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact1;
