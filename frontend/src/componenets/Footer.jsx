import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            {/*-------Left side------*/}
            <div>
            <img className='mb-5 w-40' src={assets.collogo} alt="" />
                <p className='w-full md:w-2/3text-gray-600 leading-6'>"© 2025 CollegeGO | Simplifying Bus Pass Management for Students "</p>

            </div>
            {/*-------center------*/}
            <div>
                <p className='text-xl font-medium mb-5'>WEBSITE</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Contact Us</li>
                    <li>Privacy Policy </li>
                </ul>

            </div>
            {/*-------right side------*/}
            <div >
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>+1-123-456-789</li>
                    <li>collegego@gmail.com</li>
                </ul>

            </div>

        </div>

        <div>
            {/*-----------CopyRight Text----------*/}
            <div>
                <hr />
                <p className='py-5 text-sm text-center'>CopyRight 2025@ CollegeGO - All Right Reserved.</p>
            </div>
        </div>
    </div>
  )
}

export default Footer