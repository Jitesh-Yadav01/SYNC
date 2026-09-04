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
        <meta property="og:title" content="NEXUS — AIT Pune Student Community" />
        <meta property="og:description" content="NEXUS is the digital platform for AIT Pune clubs, events, student activities, and campus communities." />
        <meta property="og:url" content="https://aitnexus.in/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://aitnexus.in/image.png" />
        <meta property="og:site_name" content="NEXUS" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="NEXUS — AIT Pune Student Community" />
        <meta name="twitter:description" content="NEXUS is the digital platform for AIT Pune clubs, events, student activities, and campus communities." />
        <meta name="twitter:image" content="https://aitnexus.in/image.png" />
      </Helmet>
      <Landing />
    </>
  )
}
