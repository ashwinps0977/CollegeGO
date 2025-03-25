import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div className="px-6 lg:px-20 py-12 text-gray-700">
      {/* About Us Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold">
          ABOUT <span className="text-blue-600">US</span>
        </h2>
      </div>

      <div className="mt-8 flex flex-col lg:flex-row items-center lg:items-start gap-8">
        {/* Left Side - Image */}
        <div className="w-full lg:w-1/3">
          <img
            src={assets.headerbus}
            alt=""
            className="rounded-lg shadow-md"
          />
        </div>

        {/* Right Side - Description */}
        <div className="w-full lg:w-2/3 text-lg space-y-4">
          <p>
            Welcome to <strong>CollegeGO</strong>, your trusted partner in managing 
            your college transportation seamlessly. We understand the difficulties students face 
            in obtaining and renewing bus passes, and we are here to simplify the process.
          </p>
          <p>
            CollegeGO is committed to leveraging technology to streamline bus pass 
            management. Our digital platform eliminates paperwork and ensures a smooth 
            experience for students, staff, and administrators.
          </p>

          {/* Our Vision */}
          <h3 className="text-xl font-semibold text-gray-800">Our Vision</h3>
          <p>
            Our vision at <strong>CollegeGO</strong> is to create a hassle-free, secure, 
            and efficient bus pass system for students. We aim to bridge the gap 
            between students and transportation authorities, making public 
            transportation more accessible and well-managed.
          </p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="mt-16 text-center">
        <h3 className="text-2xl font-semibold">
          WHY <span className="text-blue-600">CHOOSE US</span>
        </h3>
      </div>

      {/* Features Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-gray-900">EFFICIENCY</h4>
          <p>Streamlined bus pass application and renewal that saves time.</p>
        </div>
        <div className="border p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-gray-900">CONVENIENCE</h4>
          <p>Easy access to a secure digital bus pass anytime, anywhere.</p>
        </div>
        <div className="border p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-gray-900">SECURITY</h4>
          <p>Multi-level approval process ensuring authenticity and transparency.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
