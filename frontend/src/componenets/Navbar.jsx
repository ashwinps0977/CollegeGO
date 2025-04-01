import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    
    // State to track user authentication
    const [token, setToken] = useState(false);
    
    useEffect(() => {
        // Check if user is logged in from localStorage
        const userLoggedIn = localStorage.getItem('user');
        setToken(!!userLoggedIn);
    }, []);
    
    const handleLogout = () => {
        localStorage.removeItem('user'); // Clear user data
        setToken(false);
        navigate('/loginpage'); // Redirect to login page
    };

    return (
        <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-gray-400'>
            <img className='w-44 cursor-pointer' src={assets.collogo} alt="Logo" onClick={() => navigate('/')} />
            
            <ul className='hidden md:flex items-start gap-5 font-medium'>
                <NavLink to='/'><li>HOME</li></NavLink>
                <NavLink to='/request1'><li>REQUEST</li></NavLink>
                <NavLink to='/tick'><li>TICKET</li></NavLink>
                <NavLink to='/cancellation'><li>CANCELLATION</li></NavLink>
                <NavLink to='/about'><li>ABOUT</li></NavLink>
                <NavLink to='/contact'><li>CONTACT</li></NavLink>
                
            </ul>
            
            <div className='flex items-center gap-4'>
                {
                    token ? (
                        <div className='flex items-center gap-2 cursor-pointer group relative'>
                            <img className='w-8 rounded-full' src={assets.upload_area} alt="User" />
                            <img className='w-2.5' src={assets.dropdown_icon} alt="Dropdown" />
                            
                            <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                                <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                                    <p onClick={() => navigate('/myprofile')} className='hover:text-black cursor-pointer'>My Profile</p>
                                    <p onClick={() => navigate('/tick')} className='hover:text-black cursor-pointer'>My Ticket</p>
                                    <p onClick={handleLogout} className='hover:text-black cursor-pointer'>Logout</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => navigate('/createacct')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>Create Account</button>
                    )
                }
            </div>
        </div>
    );
}

export default Navbar;
