import React, { useState, useEffect } from 'react';
import { Download, Share, PlusSquare } from 'lucide-react';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOSPromptVisible, setIsIOSPromptVisible] = useState(false);

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

    if (isIOS && !isStandalone) {
      const hasSeenIOSPrompt = localStorage.getItem('hasSeenIOSPrompt');
      if (!hasSeenIOSPrompt) {
        setIsIOSPromptVisible(true);
      }
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsIOSPromptVisible(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const closeIOSPrompt = () => {
    setIsIOSPromptVisible(false);
    localStorage.setItem('hasSeenIOSPrompt', 'true');
  };

  if (!deferredPrompt && !isIOSPromptVisible) return null;

  return (
    <div className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-[9999] animate-in fade-in slide-in-from-bottom-4 duration-500">
      {deferredPrompt && (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-2 bg-[#4285F4] hover:bg-[#3367d6] text-white px-4 py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#4285F4]/20 transition-all active:scale-95"
        >
          <Download className="w-5 h-5" />
          <span className="font-semibold text-sm">Install App</span>
        </button>
      )}

      {isIOSPromptVisible && !deferredPrompt && (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 dark:border-slate-700 max-w-xs relative">
          <button 
            onClick={closeIOSPrompt}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            ✕
          </button>
          <p className="text-sm text-slate-800 dark:text-slate-200 font-medium mb-2 pr-4">
            Install NEXUS on your iPhone
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 flex-wrap">
            Tap <Share className="w-4 h-4 inline" /> then <PlusSquare className="w-4 h-4 inline" /> 'Add to Home Screen'
          </p>
        </div>
      )}
    </div>
  );
}
