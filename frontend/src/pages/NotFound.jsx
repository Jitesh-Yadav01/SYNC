import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono text-white p-4" style={{ overflowX: 'clip' }}>
      <Helmet>
        <title>Page Not Found | NEXUS</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center backdrop-blur-xl">
        <h1 className="text-7xl font-bold mb-4 text-gray-300">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 text-sm font-bold bg-white text-black hover:bg-gray-200 transition-all active:scale-95 duration-300 rounded-lg cursor-pointer"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
