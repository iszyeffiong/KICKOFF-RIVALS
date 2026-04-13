import React, { useState } from "react";
import { IconX, IconUser, IconCheck } from "./Icons";
import { checkUsernameAvailability } from "../server/user";
import { cn } from "../lib/utils";

interface UpdateUsernameModalProps {
  onClose: () => void;
  onConfirm: (newUsername: string) => Promise<{ success: boolean; error?: string }>;
}

export function UpdateUsernameModal({ onClose, onConfirm }: UpdateUsernameModalProps) {
  const [username, setUsername] = useState("");
  const [isCheckLoading, setIsCheckLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setUsername(val);
    setError(null);
    setIsAvailable(null);

    if (val.length >= 3) {
      setIsCheckLoading(true);
      try {
        const res = await checkUsernameAvailability({ data: { username: val } });
        setIsAvailable(res.available);
      } catch (err) {
        console.error("Availability check failed", err);
      } finally {
        setIsCheckLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!isAvailable || username.length < 3) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await onConfirm(username);
      if (!res.success) {
        setError(res.error || "Update failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-card border-2 border-primary/20 rounded-[2rem] shadow-2xl p-6 animate-in zoom-in-95 duration-300 overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <IconUser className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-foreground uppercase tracking-tight">Change Name</h3>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Only one-time change</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Enter new username"
              className={cn(
                "w-full bg-muted/50 border-2 rounded-xl px-4 py-3 font-bold text-foreground placeholder:text-muted-foreground/50 transition-all outline-none",
                isAvailable === true && "border-green-500/50 focus:border-green-500 bg-green-500/5",
                isAvailable === false && "border-red-500/50 focus:border-red-500 bg-red-500/5",
                isAvailable === null && "border-transparent focus:border-primary"
              )}
              maxLength={20}
              autoFocus
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {isCheckLoading && (
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              )}
              {isAvailable === true && !isCheckLoading && (
                <IconCheck className="w-5 h-5 text-green-500" />
              )}
              {isAvailable === false && !isCheckLoading && (
                <IconX className="w-5 h-5 text-red-500" />
              )}
            </div>
          </div>

          <div className="bg-primary/5 rounded-xl p-3 border border-primary/10 text-[10px] space-y-1">
            <p className="text-muted-foreground font-bold uppercase tracking-tighter flex items-center gap-1.5">
              <span className="w-1 h-1 bg-primary rounded-full" />
              Alphanumeric characters only
            </p>
            <p className="text-muted-foreground font-bold uppercase tracking-tighter flex items-center gap-1.5">
              <span className="w-1 h-1 bg-primary rounded-full" />
              Minimum 3 characters
            </p>
            <p className="text-warning font-bold uppercase tracking-tighter flex items-center gap-1.5">
              <span className="w-1 h-1 bg-warning rounded-full" />
              THIS CANNOT BE UNDONE
            </p>
          </div>

          {error && (
            <p className="text-xs text-red-500 font-bold text-center animate-shake">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={!isAvailable || isSubmitting || isCheckLoading}
            className={cn(
              "w-full h-14 rounded-xl font-black uppercase tracking-widest text-sm transition-all shadow-lg",
              isAvailable && !isSubmitting
                ? "bg-primary text-white hover:scale-[1.02] active:scale-95 shadow-primary/20"
                : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
            )}
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
            ) : (
              "Confirm Change"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
