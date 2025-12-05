import React, { useState, useEffect } from 'react'
import './NavBar.css'
import logo from '../../assets/synclogo.svg'
import Hamburger from '../Hamburger'
import SideBar from '../SideBar'

export default function Navbar(){
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900)

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
        <img src={logo} alt="AIT Pune" className="logo" />
      </div>
      {isMobile && (
        <div className="nav-right">
          <Hamburger open={open} onClick={handleHamburger} />
        </div>
      )}
      {!isMobile && (
        <nav className="nav-center" role="navigation" aria-label="Top navigation">
          <ul className="top-nav">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#clubs">Clubs</a></li>
            <li><a href="#secretary">Secretary</a></li>
            <li><a href="#calendar">Calender</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </nav>
      )}
      {isMobile && (
        <SideBar open={open} onClose={handleCloseSidebar} />
      )}
    </header>
  )
}
