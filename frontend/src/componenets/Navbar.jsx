import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    
    // State to track authentication status
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    
    useEffect(() => {
        // Check authentication status from sessionStorage
        const checkAuthStatus = () => {
            const user = JSON.parse(sessionStorage.getItem('user'));
            if (user) {
                setIsLoggedIn(true);
                setUserData(user);
            } else {
                setIsLoggedIn(false);
                setUserData(null);
            }
        };
        
        checkAuthStatus();
        
        // Listen for storage changes to update UI when login occurs in another tab
        window.addEventListener('storage', checkAuthStatus);
        
        return () => {
            window.removeEventListener('storage', checkAuthStatus);
        };
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('user');
        setIsLoggedIn(false);
        setUserData(null);
        navigate('/loginpage');
    };

    return (
        <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-gray-400'>
            <img className='w-44 cursor-pointer' src={assets.collogo} alt="Logo" onClick={() => navigate('/')} />
            
            <ul className='hidden md:flex items-center gap-8 font-medium'> {/* Increased gap from gap-5 to gap-8 */}
                <NavLink to='/'><li>HOME</li></NavLink>
                <NavLink to='/request1'><li>REQUEST</li></NavLink>
                <NavLink to='/tick'><li>TICKET</li></NavLink>
                <NavLink to='/about'><li>ABOUT</li></NavLink>
                <NavLink to='/contact'><li>CONTACT</li></NavLink>
            </ul>
            
            <div className='flex items-center gap-4'>
                {isLoggedIn ? (
                    <div className='flex items-center gap-2 cursor-pointer group relative'>
                        {/* User profile avatar with first letter */}
                        <div className='w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold'>
                            {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <img className='w-2.5' src={assets.dropdown_icon} alt="Dropdown" />
                        
                        {/* Dropdown menu */}
                        <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                            <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 shadow-lg'>
                                {userData?.name && (
                                    <p className='font-semibold text-black'>{userData.name}</p>
                                )}
                                <p onClick={() => navigate('/myprofile')} className='hover:text-black cursor-pointer'>My Profile</p>
                                <p onClick={() => navigate('/tick')} className='hover:text-black cursor-pointer'>My Ticket</p>
                                <p onClick={handleLogout} className='hover:text-black cursor-pointer'>Logout</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <button 
                            onClick={() => navigate('/loginpage')} 
                            className='bg-gray-200 text-gray-800 px-6 py-2 rounded-full font-medium hover:bg-gray-300 transition'
                        >
                            Login
                        </button>
                        <button 
                            onClick={() => navigate('/createacct')} 
                            className='bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-primary-dark transition'
                        >
                            Create Account
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Navbar;