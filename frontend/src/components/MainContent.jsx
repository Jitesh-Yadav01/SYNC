import React from 'react'
import '../styles/site.css'
import Home from '../pages/Home/Home'
import ContactUs from '../sections/ContactUs/ContactUs'
import AboutUs from '../sections/Aboutus/Aboutus'

export default function MainContent(){
  return (
    <main className="main">
      <Home />
      <AboutUs />
      <ContactUs />
    </main>
  )
}