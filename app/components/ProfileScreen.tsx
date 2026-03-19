import { useState } from "react";
import { cn } from "../lib/utils";
import { UserStats, DailyQuest, AppTheme } from "../types";
import { CONVERSION_RATE, CONVERSION_YIELD, INITIAL_QUESTS } from "../constants";
import {
  IconUser,
  IconWallet,
  IconCoins,
  IconTrophy,
  IconStar,
  IconTarget,
  IconUsers,
  IconShare,
  IconCopy,
  IconCheck,
  IconGift,
  IconZap,
  IconSettings,
  IconLogOut,
  IconChevronRight,
  IconFlame,
  IconAward,
  IconExternalLink,
  IconPlay,
  IconRefresh,
} from "./Icons";
import { truncateAddress, formatNumber } from "../lib/utils";

interface ProfileScreenProps {
  stats: UserStats;
  onLogout: () => void;
  onRedeem: (code: string) => Promise<{ success: boolean; message?: string }>;
  onQuestClaim: (questId: string, onSuccess?: (reward: number) => void) => Promise<void>;
  onQuestAction: (questId: string, openUrl?: boolean) => void;
  onReferral: (code: string) => Promise<{ success: boolean; message?: string }>;
  onSystemSync: () => void;
  onOpenWallet: () => void;
  onClaimAllianceRewards: () => void;
  onCheckIn: () => Promise<{ success: boolean; message: string; reward?: number }>;
  notify?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function ProfileScreen({
  stats,
  onLogout,
  onRedeem,
  onQuestClaim,
  onQuestAction,
  onReferral,
  onSystemSync,
  onOpenWallet,
  onClaimAllianceRewards,
  onCheckIn,
  notify,
}: ProfileScreenProps) {
  const [activeSection, setActiveSection] = useState<
    "overview" | "quests" | "referral" | "settings"
  >("overview");
  const [redeemCode, setRedeemCode] = useState("");
  const [redeemStatus, setRedeemStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [referralCode, setReferralCode] = useState("");
  const [isApplyingReferral, setIsApplyingReferral] = useState(false);
  const [referralStatus, setReferralStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [copied, setCopied] = useState(false);
  const [showClaimSuccess, setShowClaimSuccess] = useState(false);
  const [claimReward, setClaimReward] = useState<number>(0);

  const handleRedeem = async () => {
    if (!redeemCode.trim()) return;
    const result = await onRedeem(redeemCode.trim());
    setRedeemStatus({
      type: result.success ? "success" : "error",
      message: result.message || (result.success ? "Code redeemed!" : "Invalid code"),
    });
    if (result.success) {
      setRedeemCode("");
    }
  };

  const handleReferral = async () => {
    if (!referralCode.trim()) return;
    setIsApplyingReferral(true);
    setReferralStatus({ type: null, message: "" });
    
    try {
      const result = await onReferral(referralCode.trim());
      setReferralStatus({
        type: result.success ? "success" : "error",
        message: result.message || (result.success ? "Referral applied!" : "Invalid code"),
      });
      if (result.success) {
        setReferralCode("");
      }
    } finally {
      setIsApplyingReferral(false);
    }
  };

  const copyReferralCode = () => {
    if (!stats?.referralCode) return;
    navigator.clipboard.writeText(stats.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const winRate =
    stats?.totalBets > 0
      ? Math.round(((stats?.wins || 0) / stats.totalBets) * 100)
      : 0;

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <div className="card p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <IconUser className="w-8 h-8" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-foreground truncate">
              {stats?.username || "Guest User"}
            </h2>
            <p className="text-sm text-muted-foreground font-mono">
              {truncateAddress(stats?.walletAddress || "")}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="badge badge-default text-xs">
                Level {stats?.level || 1}
              </span>
              {(stats?.loginStreak || 0) > 0 && (
                <span className="badge badge-secondary text-xs flex items-center gap-1">
                  <IconFlame className="w-3 h-3" />
                  {stats.loginStreak} day streak
                </span>
              )}
            </div>
          </div>

          {/* Wallet Button */}
          <button
            onClick={onOpenWallet}
            className="btn btn-outline h-10 px-4"
          >
            <IconWallet className="w-4 h-4" />
          </button>
        </div>

        {/* XP Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Experience</span>
            <span className="text-foreground font-medium">
              {stats?.xp || 0} / {((stats?.level || 1) + 1) * 1000} XP
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{
                width: `${((stats?.xp || 0) / (((stats?.level || 1) + 1) * 1000)) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <IconCoins className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-muted-foreground">Coins</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {formatNumber(stats?.coins || 0)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {Math.floor((stats?.coins || 0) / CONVERSION_RATE) * CONVERSION_YIELD} KOR
            available
          </p>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <IconZap className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">KOR Tokens</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {formatNumber(stats?.korBalance || 0)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Available balance</p>
        </div>
      </div>

      {/* Alliance Rewards Banner */}
      { (stats?.unclaimedAllianceRewards || 0) > 0 && (
        <button
          onClick={onClaimAllianceRewards}
          className="card p-4 w-full bg-primary/10 border-primary/30 hover:bg-primary/20 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/20">
                <IconGift className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Alliance Rewards</p>
                <p className="text-sm text-muted-foreground">
                  {stats.unclaimedAllianceRewards} coins to claim
                </p>
              </div>
            </div>
            <IconChevronRight className="w-5 h-5 text-primary" />
          </div>
        </button>
      )}


      {/* Section Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg">
        {[
          { id: "overview", label: "Stats" },
          { id: "quests", label: "Quests" },
          { id: "referral", label: "Referral" },
          { id: "settings", label: "Settings" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={cn(
              "flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all",
              activeSection === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="flex items-center justify-center gap-1.5">
              {tab.label}
              {tab.id === "quests" && (
                <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Overview Section */}
      {activeSection === "overview" && (
        <div className="space-y-4">
          {/* Stats Grid */}
          <div className="card p-4">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <IconTrophy className="w-5 h-5 text-primary" />
              Betting Stats
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <StatItem label="Total Bets" value={stats?.totalBets || 0} />
              <StatItem label="Wins" value={stats?.wins || 0} highlight="green" />
              <StatItem label="Win Rate" value={`${winRate}%`} />
              <StatItem
                label="Biggest Win"
                value={formatNumber(stats?.biggestWin || 0)}
                highlight="yellow"
              />
              <StatItem label="Best Odds" value={(stats?.bestOddsWon || 0).toFixed(2)} />
              <StatItem
                label="Current Streak"
                value={stats?.currentStreak || 0}
                highlight={(stats?.currentStreak || 0) > 0 ? "green" : undefined}
              />
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <IconAward className="w-5 h-5 text-yellow-500" />
              Achievements
            </h3>
            <div className="grid grid-cols-4 gap-3">
              <AchievementBadge
                icon={<IconStar />}
                label="First Win"
                unlocked={(stats?.wins || 0) > 0}
              />
              <AchievementBadge
                icon={<IconFlame />}
                label="Hot Streak"
                unlocked={(stats?.longestStreak || 0) >= 5}
              />
              <AchievementBadge
                icon={<IconTarget />}
                label="Sharpshooter"
                unlocked={(winRate || 0) >= 60}
              />
              <AchievementBadge
                icon={<IconTrophy />}
                label="High Roller"
                unlocked={(stats?.totalBets || 0) >= 100}
              />
            </div>
          </div>
        </div>
      )}

      {/* Quests Section */}
      {activeSection === "quests" && (
        <div className="space-y-4 relative min-h-[300px]">
          {/* 4-Hourly Check-in Card (Featured) */}
          <div className="card p-5 border-primary/20 bg-primary/5 shadow-inner">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                  <IconGift className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">4-Hourly Bonus</h3>
                  <p className="text-xs text-muted-foreground">
                    Claim <span className="text-primary font-semibold text-sm">5,000 coins</span> every 4 hours
                  </p>
                </div>
              </div>
              
              <button
                onClick={async () => {
                  if (stats.canCheckIn) {
                    console.log("[PROFILE] Claim button clicked");
                    const res = await onCheckIn();
                    if (res.success) {
                      setClaimReward(res.reward || 5000);
                      setShowClaimSuccess(true);
                    } else {
                      notify?.(res.message || "Claim failed", "error");
                    }
                  }
                }}
                disabled={!stats.canCheckIn}
                className={cn(
                  "btn h-11 px-6 font-bold shadow-lg transition-all",
                  stats.canCheckIn 
                    ? "btn-primary hover:scale-105 active:scale-95" 
                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-70"
                )}
              >
                {stats.canCheckIn ? (
                  "Claim Now"
                ) : (
                  <span className="flex items-center gap-2">
                    <IconZap className="w-4 h-4 animate-pulse" />
                    Wait {stats.nextCheckInIn}h
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground text-lg">Daily Quests</h3>
            <span className="badge badge-secondary text-xs">
              {(stats?.quests || []).filter(q => q.completed).length}/{(stats?.quests || []).length} completed
            </span>
          </div>

          <div className="space-y-3">
            {(stats?.quests || []).map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onAction={(openUrl) => onQuestAction(quest.id, openUrl)}
                onClaim={() => {
                  onQuestClaim(quest.id, (reward) => {
                    setClaimReward(reward);
                    setShowClaimSuccess(true);
                  });
                }}
                notify={notify}
              />
            ))}
          </div>


          {/* Redeem Code */}
          <div className="card p-4 mt-4">
            <h4 className="font-medium text-foreground mb-3">Redeem Coupon</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={redeemCode}
                onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                placeholder="Enter code"
                className="input flex-1"
              />
              <button
                onClick={handleRedeem}
                disabled={!redeemCode.trim()}
                className="btn btn-primary px-6 shadow-md"
              >
                Redeem
              </button>
            </div>
            {redeemStatus.message && (
              <p className={cn("text-xs mt-2", redeemStatus.type === "success" ? "text-green-500" : "text-red-500")}>
                {redeemStatus.message}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Referral Section */}
      {activeSection === "referral" && (
        <div className="space-y-4 relative min-h-[300px]">
          <div className="space-y-4">
            {/* Your Referral Code */}
            <div className="card p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <IconShare className="w-5 h-5 text-primary" />
                Your Referral Code
              </h3>
              <div className="flex gap-2">
                <div className="flex-1 bg-muted rounded-lg px-4 py-3 font-mono text-lg font-bold text-foreground overflow-x-auto whitespace-nowrap">
                  {stats.referralCode}
                </div>
                <button
                  onClick={copyReferralCode}
                  className={cn(
                    "btn px-4",
                    copied ? "btn-primary" : "btn-outline"
                  )}
                >
                  {copied ? (
                    <IconCheck className="w-5 h-5" />
                  ) : (
                    <IconCopy className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Share your code and you both earn 5000 coins when your friend joins!
              </p>
            </div>

            {/* Referral Stats */}
            <div className="card p-4">
              <h4 className="font-medium text-foreground mb-3">Referral Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {stats.referralCount}
                  </p>
                  <p className="text-xs text-muted-foreground">Friends Referred</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-yellow-500">
                    {formatNumber(stats.referralEarnings)}
                  </p>
                  <p className="text-xs text-muted-foreground">Coins Earned</p>
                </div>
              </div>
            </div>

            {/* Enter Referral Code */}
            {!stats.hasReferred && (
              <div className="card p-4">
                <h4 className="font-medium text-foreground mb-3">
                  Have a referral code?
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                    placeholder="Enter friend's code"
                    className="input flex-1 disabled:opacity-50"
                    disabled={isApplyingReferral || referralStatus.type === "success"}
                  />
                  <button
                    onClick={handleReferral}
                    disabled={isApplyingReferral || referralStatus.type === "success" || !referralCode.trim()}
                    className="btn btn-primary px-6 flex items-center justify-center min-w-[100px]"
                  >
                    {isApplyingReferral ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Apply"
                    )}
                  </button>
                </div>
                {referralStatus.message && (
                  <p
                    className={cn(
                      "text-xs mt-2",
                      referralStatus.type === "success"
                        ? "text-green-500"
                        : "text-red-500"
                    )}
                  >
                    {referralStatus.message}
                  </p>
                )}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Settings Section */}
      {activeSection === "settings" && (
        <div className="space-y-3">
          <SettingsButton
            icon={<IconWallet className="w-5 h-5" />}
            label="Wallet Settings"
            onClick={onOpenWallet}
          />
          <SettingsButton
            icon={<IconSettings className="w-5 h-5" />}
            label="Sync Account"
            description="Refresh your account data"
            onClick={onSystemSync}
          />
          <SettingsButton
            icon={<IconSettings className="w-5 h-5 text-yellow-500" />}
            label="Reset Social Quests (Test)"
            description="Clear quest progress for testing"
            onClick={() => {
              const socialIds = ["q-follow-x", "q-like-1", "q-like-2"];
              socialIds.forEach(id => {
                localStorage.removeItem(`quest_completed_${id}`);
                localStorage.removeItem(`quest_verify_${id}`);
                localStorage.removeItem(`quest_visited_${id}`);
              });
              notify?.("Quest progress reset! Refreshing...", "success");
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            }}
          />
          <SettingsButton
            icon={<IconLogOut className="w-5 h-5 text-destructive" />}
            label="Logout"
            description="Disconnect your wallet"
            onClick={onLogout}
            variant="danger"
          />
        </div>
      )}

      {showClaimSuccess && (
        <ClaimSuccessModal 
          amount={claimReward} 
          onClose={() => setShowClaimSuccess(false)} 
        />
      )}
    </div>
  );
}

// Sub-components
function ComingSoonOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[2px] rounded-lg border border-dashed border-muted-foreground/20">
      <div className="bg-background/80 p-4 rounded-full shadow-lg border mb-2">
        <IconPlay className="w-6 h-6 text-muted-foreground rotate-[-90deg]" /> {/* Using Play icon rotated as a 'construct' placeholder or just use generic */}
      </div>
      <div className="bg-card px-4 py-2 rounded-lg shadow-sm border">
        <span className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Coming Soon</span>
      </div>
    </div>
  );
}

interface ClaimSuccessModalProps {
  amount: number;
  onClose: () => void;
}

function ClaimSuccessModal({ amount, onClose }: ClaimSuccessModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-xs bg-card border-2 border-primary/30 rounded-[2.5rem] shadow-2xl p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
        <div className="absolute -top-12">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/40 border-4 border-card animate-bounce duration-[2000ms] infinite">
              <IconGift className="w-12 h-12 text-white" />
            </div>
            {/* Particle effects placeholders */}
            <div className="absolute top-0 left-0 w-full h-full animate-ping opacity-20 bg-primary rounded-full" />
          </div>
        </div>

        <div className="mt-12 space-y-4">
          <div>
            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Reward Claimed!</h2>
            <p className="text-sm text-muted-foreground font-medium mt-1">Check-in complete</p>
          </div>

          <div className="bg-primary/10 rounded-3xl p-6 border border-primary/20 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
              <IconCoins className="w-20 h-20" />
            </div>
            <div className="flex flex-col items-center relative z-10">
              <span className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Bonus Credit</span>
              <div className="flex items-center gap-2">
                <IconCoins className="w-6 h-6 text-yellow-500" />
                <span className="text-4xl font-black text-foreground">+{formatNumber(amount)}</span>
              </div>
              <span className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wide">Credited to coins balance</span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full btn btn-primary h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            Awesome!
          </button>
          
          <p className="text-[10px] text-muted-foreground font-medium italic">
            Come back in 4 hours for more!
          </p>
        </div>
      </div>
      
      {/* Simple "Confetti" effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-primary animate-ping opacity-40"
            style={{
              width: Math.random() * 8 + 4 + 'px',
              height: Math.random() * 8 + 4 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: i * 200 + 'ms',
              animationDuration: Math.random() * 3 + 2 + 's'
            }}
          />
        ))}
      </div>
    </div>
  );
}

interface StatItemProps {
  label: string;
  value: string | number;
  highlight?: "green" | "yellow" | "red";
}

function StatItem({ label, value, highlight }: StatItemProps) {
  return (
    <div className="text-center">
      <p
        className={cn(
          "text-xl font-bold",
          highlight === "green" && "text-green-500",
          highlight === "yellow" && "text-yellow-500",
          highlight === "red" && "text-red-500",
          !highlight && "text-foreground"
        )}
      >
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

interface AchievementBadgeProps {
  icon: React.ReactNode;
  label: string;
  unlocked: boolean;
}

function AchievementBadge({ icon, label, unlocked }: AchievementBadgeProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 p-2 rounded-lg transition-all",
        unlocked
          ? "bg-yellow-500/10 text-yellow-500"
          : "bg-muted/50 text-muted-foreground opacity-50"
      )}
    >
      <div className="w-8 h-8 flex items-center justify-center">{icon}</div>
      <span className="text-[10px] font-medium text-center">{label}</span>
    </div>
  );
}

interface QuestCardProps {
  quest: DailyQuest;
  onAction: (openUrl?: boolean) => void;
  onClaim: () => void;
  notify?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

function QuestCard({ quest, onAction, onClaim, notify }: QuestCardProps) {
  const [verificationInput, setVerificationInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasVisited, setHasVisited] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`quest_visited_${quest.id}`) === 'true';
    }
    return false;
  });
  const progress = Math.min((quest.progress / quest.target) * 100, 100);
  const isComplete = quest.progress >= quest.target;
  const canClaim = isComplete && !quest.completed;

  return (
    <div
      className={cn(
        "card p-4 transition-all",
        quest.completed && "opacity-60"
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-medium text-foreground">{quest.title}</h4>
          <p className="text-xs text-muted-foreground">
            {quest.frequency === "weekly" ? "Weekly" : "Daily"} • +{quest.reward}{" "}
            coins
          </p>
        </div>
        {quest.status === "LIVE" && !quest.completed && (
          <span className="badge bg-green-500/10 text-green-500 text-xs">
            Active
          </span>
        )}
        {quest.completed && (
          <span className="badge bg-primary/10 text-primary text-xs">
            <IconCheck className="w-3 h-3 mr-1" />
            Done
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">Progress</span>
          <span className="text-foreground font-medium">
            {quest.progress}/{quest.target}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-500",
              quest.completed
                ? "bg-primary/50"
                : isComplete
                  ? "bg-green-500"
                  : "bg-primary"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Action Buttons & Input */}
      {!quest.completed && (
        <div className="space-y-3 mt-3">
          {quest.requiresVerification && !isComplete && (
            <div className={cn("space-y-2 transition-opacity", !hasVisited && "opacity-30 pointer-events-none")}>
              <input
                type="text"
                placeholder={quest.verificationPlaceholder || "Enter details..."}
                value={verificationInput}
                disabled={isVerifying || !hasVisited}
                onChange={(e) => setVerificationInput(e.target.value)}
                className="w-full bg-background border border-muted-foreground/20 rounded-xl px-3 h-10 text-sm focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
              />
              <p className="text-[10px] text-muted-foreground italic px-1">
                {quest.verificationType === 'username' 
                  ? "Submit your X username for verification." 
                  : "Submit your comment link for verification."}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            {quest.externalUrl && !isComplete && (
              <a
                href={quest.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  localStorage.setItem(`quest_visited_${quest.id}`, 'true');
                  setHasVisited(true);
                  onAction(true);
                }}
                className="btn btn-outline flex-1 h-9 text-sm"
              >
                <IconExternalLink className="w-4 h-4 mr-1" />
                {quest.requiresVerification ? "Go to Link" : "Go"}
              </a>
            )}
            
            {quest.requiresVerification && !isComplete && (
              <button
                disabled={isVerifying || !hasVisited}
                onClick={async () => {
                  const val = verificationInput.trim();
                  
                  setIsVerifying(true);

                  setTimeout(() => {
                    if (val.length < 3) {
                      setIsVerifying(false);
                      notify?.("Please provide valid information.", "error");
                      return;
                    }

                    if (quest.verificationType === 'username') {
                      if (!val.startsWith('@') || val.length < 4) {
                        setIsVerifying(false);
                        notify?.("Invalid username! Please redo the task with your correct @username.", "error");
                        return;
                      }
                    }

                    if (quest.verificationType === 'link') {
                      if (!val.includes('x.com') && !val.includes('twitter.com')) {
                        setIsVerifying(false);
                        notify?.("Invalid link! Please go back and copy your specific status URL.", "error");
                        return;
                      }

                      const savedUsername = localStorage.getItem(`quest_verify_q-follow-x`);
                      if (!savedUsername) {
                        setIsVerifying(false);
                        notify?.("Please follow us on X first so we can verify your account.", "error");
                        return;
                      }
                      
                      const normalizedUsername = savedUsername.replace('@', '').toLowerCase();
                      if (!val.toLowerCase().includes(normalizedUsername)) {
                        setIsVerifying(false);
                        notify?.(`Verification failed: Link does not match @${normalizedUsername}. Please redo the task correctly.`, "error");
                        return;
                      }
                    }

                    // SUCCESS
                    localStorage.setItem(`quest_verify_${quest.id}`, val);
                    onAction(false);
                    setIsVerifying(false);
                    notify?.("Verification successful! You can now claim your reward.", "success");
                    setVerificationInput("");
                  }, 5000);
                }}
                className="btn btn-secondary flex-1 h-9 text-sm font-bold relative overflow-hidden"
              >
                {isVerifying ? (
                  <span className="flex items-center gap-2">
                    <IconRefresh className="w-4 h-4 animate-spin" />
                    Checking...
                  </span>
                ) : "Verify Task"}
              </button>
            )}

            {quest.type === "click" && !isComplete && !quest.requiresVerification && (
              <button
                onClick={() => onAction()}
                className="btn btn-outline flex-1 h-9 text-sm"
              >
                Complete
              </button>
            )}

            {canClaim && (
              <button
                onClick={onClaim}
                className="btn btn-primary flex-1 h-10 text-sm font-bold shadow-lg shadow-primary/20"
              >
                <IconGift className="w-4 h-4 mr-1" />
                Claim {quest.reward}
              </button>
            )}
          </div>
        </div>
      )}

      {quest.completed && (
        <div className="flex items-center gap-2 text-primary font-bold text-sm bg-primary/5 p-2 rounded-lg mt-3">
          <IconCheck className="w-5 h-5" />
          Task Rewarded
        </div>
      )}
    </div>
  );
}

interface SettingsButtonProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  onClick: () => void;
  variant?: "default" | "danger";
}

function SettingsButton({
  icon,
  label,
  description,
  onClick,
  variant = "default",
}: SettingsButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "card w-full p-4 flex items-center gap-4 transition-colors",
        variant === "danger"
          ? "hover:bg-destructive/5 hover:border-destructive/30"
          : "hover:bg-muted/50"
      )}
    >
      <div
        className={cn(
          "p-2 rounded-lg",
          variant === "danger" ? "bg-destructive/10" : "bg-muted"
        )}
      >
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p
          className={cn(
            "font-medium",
            variant === "danger" ? "text-destructive" : "text-foreground"
          )}
        >
          {label}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <IconChevronRight className="w-5 h-5 text-muted-foreground" />
    </button>
  );
}

export default ProfileScreen;
