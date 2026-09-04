import React from 'react';
import Events from '../components/events/Events';
import { Helmet } from 'react-helmet-async';

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-black" style={{ overflowX: 'clip' }}>
      <Helmet>
        <title>AIT Pune Events | NEXUS</title>
        <meta name="description" content="Discover events, activities, and student experiences happening across AIT Pune." />
        <link rel="canonical" href="https://aitnexus.in/events" />
        <meta property="og:title" content="AIT Pune Events | NEXUS" />
        <meta property="og:description" content="Discover events, activities, and student experiences happening across AIT Pune." />
        <meta property="og:url" content="https://aitnexus.in/events" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://aitnexus.in/image.png" />
        <meta property="og:site_name" content="NEXUS" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AIT Pune Events | NEXUS" />
        <meta name="twitter:description" content="Discover events, activities, and student experiences happening across AIT Pune." />
        <meta name="twitter:image" content="https://aitnexus.in/image.png" />
      </Helmet>
      <Events />
    </div>
  );
}
