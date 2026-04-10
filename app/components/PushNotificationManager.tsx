import { useState, useEffect } from 'react';
import { IconZap, IconX, IconBell, IconShieldCheck } from './Icons';
import { cn } from '../lib/utils';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

export function PushNotificationManager({ walletAddress }: { walletAddress: string | null }) {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' ? Notification.permission : 'default'
  );
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && walletAddress) {
      checkSubscription();
    }
  }, [walletAddress]);

  useEffect(() => {
    // Show prompt after a short delay if not and not denied
    if (walletAddress && permission === 'default' && !isSubscribed) {
      const dismissed = localStorage.getItem('push_prompt_dismissed');
      if (!dismissed) {
        const timer = setTimeout(() => setShowPrompt(true), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [walletAddress, permission, isSubscribed]);

  async function checkSubscription() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    setIsSubscribed(!!subscription);
  }

  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async function subscribe() {
    if (!walletAddress) return;
    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });

      const res = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          subscription
        })
      });

      if (res.ok) {
        setIsSubscribed(true);
        setPermission(Notification.permission);
        setShowPrompt(false);
      }
    } catch (error) {
      console.error('Push subscription failed', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDismiss = () => {
    localStorage.setItem('push_prompt_dismissed', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt || !walletAddress || isSubscribed || permission === 'denied') return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <button 
          onClick={handleDismiss}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
        >
          <IconX className="w-4 h-4 text-slate-400" />
        </button>

        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-primary/20 rounded-full blur-3xl opacity-50" />
        
        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-6 shadow-inner ring-1 ring-white/10">
            <IconBell className="w-10 h-10 animate-bounce" />
          </div>

          <h3 className="text-2xl font-black text-white mb-2 tracking-tight uppercase">Never Miss a Round!</h3>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Get instant alerts when <span className="text-primary font-bold">betting opens</span> and <span className="text-primary font-bold">results are out</span>. Stake smarter with real-time updates.
          </p>

          <div className="w-full space-y-3">
             <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest justify-center mb-2">
                <IconShieldCheck className="w-3 h-3 text-emerald-500" />
                Private & Secure · No Spam
             </div>

            <button
              onClick={subscribe}
              disabled={loading}
              className={cn(
                "w-full h-14 bg-primary text-white rounded-2xl font-black text-sm tracking-widest uppercase",
                "shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-95 transition-all",
                "disabled:opacity-50 disabled:pointer-events-none"
              )}
            >
              {loading ? 'Processing...' : 'Notify Me'}
            </button>
            <button
              onClick={handleDismiss}
              className="w-full h-12 text-slate-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
