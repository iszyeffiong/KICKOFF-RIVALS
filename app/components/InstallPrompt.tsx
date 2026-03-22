import { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import { IconX, IconShare, IconDownload, IconPlus } from "./Icons";

export function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) return;

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Save prompt for Android
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show only if not iOS
      if (!isIOSDevice) {
        setShow(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // For iOS, show after a delay
    if (isIOSDevice) {
      const timer = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timer);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-500">
      <div className="card p-4 bg-slate-900 border-2 border-primary/30 shadow-2xl relative overflow-hidden group">
        {/* Glow behind */}
        <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors pointer-events-none" />
        
        <button 
          onClick={() => setShow(false)}
          className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-white/10 text-slate-400 transition-colors"
        >
          <IconX className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-4 pr-6">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/40 p-2 shrink-0">
            <img src="/favicon.png" alt="KickOff" className="w-full h-full object-contain filter invert-0" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-white text-sm leading-tight">Install KickOff Rivals</h4>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
              Install the app for the full experience.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
          {isIOS ? (
            <div className="flex flex-col gap-2">
              <p className="text-[10px] text-slate-300 flex items-center gap-1.5 font-medium">
                Tap <IconShare className="w-3.5 h-3.5 inline text-primary" /> Share and select <IconPlus className="w-3.5 h-3.5 inline text-primary font-bold bg-white/10 rounded p-0.5" /> <strong>Add to Home Screen</strong>
              </p>
              <button 
                onClick={() => setShow(false)}
                className="btn btn-outline h-10 w-full text-xs font-bold rounded-xl border-white/20 hover:bg-white/5"
              >
                Got it
              </button>
            </div>
          ) : (
            <button 
              onClick={handleInstallClick}
              className="btn btn-primary h-11 w-full text-sm font-bold rounded-xl shadow-lg shadow-primary/20"
            >
              <IconDownload className="w-4 h-4 mr-2" />
              Install Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
