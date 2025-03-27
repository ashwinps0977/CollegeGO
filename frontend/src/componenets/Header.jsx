import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { assets } from "../assets/assets";

const Header = () => {
  const navigate = useNavigate(); // Initialize navigation

  return (
    <div className="flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20">
      {/*-------Left side------*/}
      <div className="md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:md:mb-[-30px]">
        <p className="text-xl md:text-4xl lg:text-sxl text-white font-semibold leading-tight md:leading-tight lg:leading-tight">
          A Smart- EcoPass
        </p>
        <div className="flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light">
          <img src="" alt="" />
          <p>
            CollegeGO – Your Smart Bus Pass!  <br className="hidden sm:block" /> A seamless app for hostel students to apply, renew, and manage bus passes online. With digital approvals, real-time updates, and QR-code passes, it ensures a hassle-free, secure, and paperless experience! 
          </p>
        </div>

        {/* Apply Pass Button - Navigates to Request1 Page */}
       
      </div>

      {/*-------Right side------*/}
      <div></div>
    </div>
  );
};

export default Header;
