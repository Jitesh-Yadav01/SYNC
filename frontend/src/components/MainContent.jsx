import React from 'react'
import '../styles/site.css'
import Landing from './Landing/Landing'
import { Helmet } from 'react-helmet-async'

// The landing page (route "/") is a clone of the spacebears experience.
// It ships its own pill navbar (with NEXUS routes), so no separate Navbar/SideBar here.
export default function MainContent() {
  return (
    <>
      <Helmet>
        <title>NEXUS — AIT Pune Student Community</title>
        <meta name="description" content="NEXUS is the digital platform for AIT Pune clubs, events, student activities, and campus communities." />
        <link rel="canonical" href="https://aitnexus.in/" />
      </Helmet>
      <Landing />
    </>
  )
}
