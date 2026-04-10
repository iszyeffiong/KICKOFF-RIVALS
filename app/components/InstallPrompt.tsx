import { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import { IconX, IconShare, IconDownload, IconPlus, IconSparkles } from "./Icons";

export function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) return;

    // Check if dismissed in the last 24 hours
    const lastDismissed = localStorage.getItem('install_prompt_dismissed_at');
    if (lastDismissed) {
      const hoursSinceDismissal = (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60);
      if (hoursSinceDismissal < 24) return;
    }

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Save prompt for Android
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show after a short delay
      if (!isIOSDevice) {
        setTimeout(() => setShow(true), 4000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // For iOS, show after a delay
    if (isIOSDevice) {
      const timer = setTimeout(() => setShow(true), 5000);
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
    if (outcome === 'dismissed') {
       localStorage.setItem('install_prompt_dismissed_at', Date.now().toString());
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('install_prompt_dismissed_at', Date.now().toString());
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-28 left-4 right-4 z-[90] animate-in slide-in-from-bottom-8 fade-in duration-700">
      <div className="relative bg-slate-900/90 backdrop-blur-xl border border-white/10 p-6 rounded-[2.5rem] shadow-2xl overflow-hidden group">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500" />
        
        <button 
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all z-10"
        >
          <IconX className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-5 relative z-10">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-500/20 p-3 ring-1 ring-white/20">
              <img src="/favicon.png" alt="KickOff" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
               <IconSparkles className="w-3.5 h-3.5 text-slate-900" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-emerald-500/30">
                Highly Recommended
              </span>
            </div>
            <h4 className="font-black text-white text-lg leading-tight uppercase tracking-tight">Experience it <span className="text-gradient">Native</span></h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
              Install KickOff Rivals to get **full-screen immersive play** and **instant goal alerts**.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3 relative z-10">
          {isIOS ? (
            <div className="flex flex-col gap-3">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <p className="text-[10px] text-slate-200 leading-relaxed font-medium">
                  Tap <span className="inline-flex items-center justify-center w-6 h-6 bg-white/10 rounded-lg mx-1"><IconShare className="w-3.5 h-3.5 text-primary" /></span> <strong>Share</strong> and select <span className="inline-flex items-center justify-center w-6 h-6 bg-white/10 rounded-lg mx-1"><IconPlus className="w-3.5 h-3.5 text-primary" /></span> <strong>Add to Home Screen</strong>
                </p>
              </div>
              <button 
                onClick={handleDismiss}
                className="w-full h-12 bg-white/5 hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95"
              >
                Got It
              </button>
            </div>
          ) : (
            <button 
              onClick={handleInstallClick}
              className="w-full h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all active:scale-95"
            >
              <div className="flex items-center justify-center gap-2">
                <IconDownload className="w-5 h-5" />
                Install KickOff
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
