import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { Navigate, NavLink, useNavigate } from 'react-router-dom'


const Navbar = () => {
    const navigate = useNavigate();

    const [showMenu, setShowMenu]= useState(false)
    const [token,setToken] = useState(true)
  return (
    <div className='flex items-centre justify-between text-sm py-4 mb-5 border-b border-b-grey-400'>
        <img className='w-44 cursor-pointer' src={assets.collogo} alt="" />
  
        <ul className='hidden md:flex items-start gap-5 font-medium'>
            <NavLink to='/'>
                <li className='py-1'>HOME</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>

            <NavLink to='/request1'>
                <li className='py-1'>REQUEST</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
            </NavLink>

            <NavLink to='/myticket1
            
            .
            .
            1 1'>
                <li className='py-1'>TICKET</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>

            <NavLink to='/cancellation'>
                <li className='py-1'>CANCELLATION</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>

            <NavLink to='/loginpage'>
                <li className='py-1'>LOGIN</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>

            <NavLink to='/about'>
                <li className='py-1'>ABOUT</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>

            <NavLink to='/contact'>
                <li className='py-1'>CONTACT</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>
        </ul>
        <div className='flex item-center gap-4'>
            {
                token 
                ? <div className='flex items-center gap-2 cursor-pinter group relative'>
                    <img className='w-8 rounded-full' src={assets.upload_area} alt="" />
                    <img className='w-2.5' src={assets.dropdown_icon} alt="" />
                    <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                        <div className='min-w-48 bg-stone-100 rounded flexflex-col gap-4 p-4'>
                            <p onClick={()=>navigate('myprofile')} className='hover:text-black cursor-pointer'>My Profile</p>
                            <p onClick={()=>navigate('myticket')} className='hover:text-black cursor-pointer'>My Ticket</p>
                            <p onClick={()=>setToken(false)} className='hover:text-black cursor-pointer'>Logout</p>
                        </div>
                    </div>
                </div>
                :
                <button onClick={()=>navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>Create Account</button>
            }
            <img onClick={()=>setShowMenu(true)}  className='w-6 md:hidden' src={assets.menu_icon} alt="" />
            {/*----------Mobile Menu-----------*/}
            <div className='md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all'>
                <div>
                    <img src={assets.logo} alt="" />
                    <img onClick={()=>setShowMenu(false)} src={assets.cross_icon} alt="" />
                </div>
                <ul>
                    <NavLink>HOME</NavLink>
                    <NavLink>REQUEST</NavLink>
                    <NavLink>TICKET</NavLink>
                    <NavLink>CANCELLATION</NavLink>
                    <NavLink>ABOUT</NavLink>
                    <NavLink>CONTACT</NavLink>
                </ul>
            </div>
        </div>
    </div>
  )
}

export default Navbar