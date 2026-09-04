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
      </Helmet>
      <Events />
    </div>
  );
}
