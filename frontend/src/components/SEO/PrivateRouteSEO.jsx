import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function PrivateRouteSEO({ children }) {
  return (
    <>
      <Helmet>
        <title>NEXUS Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {children}
    </>
  );
}
