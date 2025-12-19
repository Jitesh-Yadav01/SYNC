import React, { useState, useEffect } from 'react'
import './NavBar.css'
import logo from '../../assets/synclogo.svg'
import Hamburger from './Hamburger'
import SideBar from './SideBar'
import { useNavigate } from "react-router-dom";
import { NavLink } from 'react-router-dom'

export default function Navbar(){
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900)
  const navigate = useNavigate();

  useEffect(() => {
    
    const handleResize = () => setIsMobile(window.innerWidth <= 900)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleHamburger = () => setOpen(!open)
  const handleCloseSidebar = () => setOpen(false)

  return (
    <header className="navbar" role="banner">
      <div className="nav-left">
        <img src={logo} alt="AIT Pune" className="logo"  onClick={()=>navigate('/')}/>
      </div>
      {isMobile && (
        <>
        <div className="nav-right">
          <button className='btn-primary absolute right-15 mt-0.1' onClick={()=>navigate("/login")}>Login</button>
          <Hamburger open={open} onClick={handleHamburger} />
        </div>
        </>
      )}
      {!isMobile && (
        <nav className="nav-center inline-flex" role="navigation" aria-label="Top navigation">
          <ul className="top-nav">
            <li><NavLink to={"/"}>Home</NavLink></li>
            <li><a href="#about">About Us</a></li>
            <li><NavLink to={'/clubs'}>Clubs</NavLink></li>
            <li><a href="https://www.gdgaitpune.me">Team</a></li>
            <li><a href="#calendar">Calender</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
          <button className='btn-primary absolute right-10' onClick={()=>navigate("/login")}>Login</button>
        </nav>
      )}
      {isMobile && (
        <SideBar open={open} onClose={handleCloseSidebar} />
      )}
      
    </header>
  )
}
