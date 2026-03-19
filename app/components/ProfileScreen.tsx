import { useState } from "react";
import { cn } from "../lib/utils";
import { UserStats, DailyQuest, AppTheme } from "../types";
import {
  CONVERSION_RATE,
  CONVERSION_YIELD,
  INITIAL_QUESTS,
} from "../constants";
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
  IconX,
} from "./Icons";
import { truncateAddress, formatNumber } from "../lib/utils";

interface ProfileScreenProps {
  stats: UserStats;
  onLogout: () => void;
  onRedeem: (code: string) => Promise<{ success: boolean; message?: string }>;
  onQuestClaim: (
    questId: string,
    onSuccess?: (reward: number) => void,
  ) => Promise<void>;
  onQuestAction: (
    questId: string,
    openUrl?: boolean,
    verificationCode?: string,
  ) => void;
  onReferral: (code: string) => Promise<{ success: boolean; message?: string }>;
  onSystemSync: () => void;
  onOpenWallet: () => void;
  onClaimAllianceRewards: () => void;
  onCheckIn: () => Promise<{
    success: boolean;
    message: string;
    reward?: number;
  }>;
  notify?: (message: string, type?: "success" | "error" | "info") => void;
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
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);

  const handleRedeem = async () => {
    if (!redeemCode.trim()) return;
    const result = await onRedeem(redeemCode.trim());
    setRedeemStatus({
      type: result.success ? "success" : "error",
      message:
        result.message || (result.success ? "Code redeemed!" : "Invalid code"),
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
        message:
          result.message ||
          (result.success ? "Referral applied!" : "Invalid code"),
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
          <button onClick={onOpenWallet} className="btn btn-outline h-10 px-4">
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
                width: `${
                  ((stats?.xp || 0) / (((stats?.level || 1) + 1) * 1000)) * 100
                }%`,
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
            {Math.floor((stats?.coins || 0) / CONVERSION_RATE) *
              CONVERSION_YIELD}{" "}
            KOR available
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
          <p className="text-xs text-muted-foreground mt-1">
            Available balance
          </p>
        </div>
      </div>

      {/* Alliance Rewards Banner */}
      {(stats?.unclaimedAllianceRewards || 0) > 0 && (
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
                <p className="font-semibold text-foreground">
                  Alliance Rewards
                </p>
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
                : "text-muted-foreground hover:text-foreground",
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
              <StatItem
                label="Wins"
                value={stats?.wins || 0}
                highlight="green"
              />
              <StatItem label="Win Rate" value={`${winRate}%`} />
              <StatItem
                label="Biggest Win"
                value={formatNumber(stats?.biggestWin || 0)}
                highlight="yellow"
              />
              <StatItem
                label="Best Odds"
                value={(stats?.bestOddsWon || 0).toFixed(2)}
              />
              <StatItem
                label="Current Streak"
                value={stats?.currentStreak || 0}
                highlight={
                  (stats?.currentStreak || 0) > 0 ? "green" : undefined
                }
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
                    Claim{" "}
                    <span className="text-primary font-semibold text-sm">
                      5,000 coins
                    </span>{" "}
                    every 4 hours
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
                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-70",
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
            <h3 className="font-semibold text-foreground text-lg">
              Daily Quests
            </h3>
            <span className="badge badge-secondary text-xs">
              {(stats?.quests || []).filter((q) => q.completed).length}/
              {(stats?.quests || []).length} completed
            </span>
          </div>

          <div className="space-y-3">
            {(stats?.quests || []).map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                isSelected={selectedQuestId === quest.id}
                onClick={() => setSelectedQuestId(quest.id)}
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
              <p
                className={cn(
                  "text-xs mt-2",
                  redeemStatus.type === "success"
                    ? "text-green-500"
                    : "text-red-500",
                )}
              >
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
                    copied ? "btn-primary" : "btn-outline",
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
                Share your code and you both earn 5000 coins when your friend
                joins!
              </p>
            </div>

            {/* Referral Stats */}
            <div className="card p-4">
              <h4 className="font-medium text-foreground mb-3">
                Referral Stats
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {stats.referralCount}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Friends Referred
                  </p>
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
                    onChange={(e) =>
                      setReferralCode(e.target.value.toUpperCase())
                    }
                    placeholder="Enter friend's code"
                    className="input flex-1 disabled:opacity-50"
                    disabled={
                      isApplyingReferral || referralStatus.type === "success"
                    }
                  />
                  <button
                    onClick={handleReferral}
                    disabled={
                      isApplyingReferral ||
                      referralStatus.type === "success" ||
                      !referralCode.trim()
                    }
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
                        : "text-red-500",
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
              socialIds.forEach((id) => {
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

      {/* Quest Detail Drawer */}
      {selectedQuestId && stats?.quests && (
        <QuestDrawer
          key={selectedQuestId}
          quest={stats.quests.find((q) => q.id === selectedQuestId)!}
          onClose={() => setSelectedQuestId(null)}
          onAction={(openUrl, code) =>
            onQuestAction(selectedQuestId, openUrl, code)
          }
          onClaim={() => {
            onQuestClaim(selectedQuestId, (reward) => {
              setClaimReward(reward);
              setShowClaimSuccess(true);
              setSelectedQuestId(null);
            });
          }}
          notify={notify}
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
        <IconPlay className="w-6 h-6 text-muted-foreground rotate-[-90deg]" />{" "}
        {/* Using Play icon rotated as a 'construct' placeholder or just use generic */}
      </div>
      <div className="bg-card px-4 py-2 rounded-lg shadow-sm border">
        <span className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
          Coming Soon
        </span>
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
            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">
              Reward Claimed!
            </h2>
            <p className="text-sm text-muted-foreground font-medium mt-1">
              Check-in complete
            </p>
          </div>

          <div className="bg-primary/10 rounded-3xl p-6 border border-primary/20 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
              <IconCoins className="w-20 h-20" />
            </div>
            <div className="flex flex-col items-center relative z-10">
              <span className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
                Bonus Credit
              </span>
              <div className="flex items-center gap-2">
                <IconCoins className="w-6 h-6 text-yellow-500" />
                <span className="text-4xl font-black text-foreground">
                  +{formatNumber(amount)}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wide">
                Credited to coins balance
              </span>
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
              width: Math.random() * 8 + 4 + "px",
              height: Math.random() * 8 + 4 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              animationDelay: i * 200 + "ms",
              animationDuration: Math.random() * 3 + 2 + "s",
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
          !highlight && "text-foreground",
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
          : "bg-muted/50 text-muted-foreground opacity-50",
      )}
    >
      <div className="w-8 h-8 flex items-center justify-center">{icon}</div>
      <span className="text-[10px] font-medium text-center">{label}</span>
    </div>
  );
}

function QuestCard({
  quest,
  isSelected,
  onClick,
}: {
  quest: DailyQuest;
  isSelected: boolean;
  onClick: () => void;
}) {
  const progress = Math.min((quest.progress / quest.target) * 100, 100);
  const isComplete = quest.progress >= quest.target;

  return (
    <div
      onClick={onClick}
      className={cn(
        "card p-4 transition-all duration-300 relative group cursor-pointer hover:border-primary/50 hover:shadow-lg active:scale-[0.98]",
        isSelected &&
          "border-primary bg-primary/5 shadow-md ring-1 ring-primary/20",
        quest.completed && "opacity-60 grayscale-[0.3]",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
            {quest.title}
          </h4>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">
              +{quest.reward} COINS
            </span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span className="text-[10px] text-muted-foreground">
              {quest.frequency === "weekly" ? "WEEKLY" : "DAILY"}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          {quest.completed ? (
            <div className="flex items-center gap-1 text-primary text-[10px] font-black uppercase tracking-wider">
              <IconCheck className="w-3.5 h-3.5" />
              DONE
            </div>
          ) : isComplete ? (
            <div className="flex items-center gap-1 text-green-500 text-[10px] font-black uppercase tracking-wider animate-pulse">
              READY
            </div>
          ) : (
            <div className="text-muted-foreground text-[10px] font-black uppercase tracking-wider">
              {Math.floor(progress)}%
            </div>
          )}
          <IconChevronRight
            className={cn(
              "w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors",
              isSelected && "text-primary",
            )}
          />
        </div>
      </div>

      {/* Mini Progress Bar */}
      {!quest.completed && (
        <div className="h-1 bg-muted/30 rounded-full overflow-hidden mt-3 border border-muted-foreground/5">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700 ease-out",
              isComplete ? "bg-green-500" : "bg-primary",
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

// ==========================================
// QUEST DETAIL DRAWER
// ==========================================

function QuestDrawer({
  quest,
  onClose,
  onAction,
  onClaim,
  notify,
}: {
  quest: DailyQuest;
  onClose: () => void;
  onAction: (openUrl?: boolean, verificationCode?: string) => void;
  onClaim: () => void;
  notify?: (msg: string, type?: "success" | "error") => void;
}) {
  const [verificationInput, setVerificationInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasVisited, setHasVisited] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(`quest_visited_${quest.id}`) === "true";
    }
    return false;
  });

  const progress = Math.min((quest.progress / quest.target) * 100, 100);
  const isComplete = quest.progress >= quest.target;
  const canClaim = isComplete && !quest.completed;

  // Fallback URL from INITIAL_QUESTS if missing in current state
  const targetUrl =
    quest.externalUrl ||
    INITIAL_QUESTS.find((iq) => iq.id === quest.id)?.externalUrl;

  const handleVerify = () => {
    let val = verificationInput.trim();
    if (!val) {
      notify?.("Please enter details first.", "error");
      return;
    }

    // Auto-prefix username for better UX
    if (quest.verificationType === "username" && !val.startsWith("@")) {
      val = "@" + val;
      setVerificationInput(val);
    }

    setIsVerifying(true);
    setTimeout(() => {
      if (val.length < 3) {
        setIsVerifying(false);
        notify?.("Details too short.", "error");
        return;
      }

      if (quest.verificationType === "link") {
        const lowerVal = val.toLowerCase();
        if (!lowerVal.includes("x.com") && !lowerVal.includes("twitter.com")) {
          setIsVerifying(false);
          notify?.("Must be a valid X/Twitter link.", "error");
          return;
        }

        const savedUsername = localStorage.getItem("quest_verify_q-follow-x");
        if (!savedUsername) {
          setIsVerifying(false);
          notify?.("Verify following us on X first.", "error");
          return;
        }

        const normalizedUsername = savedUsername.replace("@", "").toLowerCase();
        if (!lowerVal.includes(normalizedUsername)) {
          setIsVerifying(false);
          notify?.(`Post must be from @${normalizedUsername}`, "error");
          return;
        }
      }

      // Success logic
      if (typeof window !== "undefined") {
        localStorage.setItem(`quest_verify_${quest.id}`, val);
        localStorage.setItem(`quest_completed_${quest.id}`, "true");
      }
      onAction(false, val); // Triggers App.tsx to mark as ready in DB and local
      setIsVerifying(false);
      notify?.("Task verified! You can now claim your coins.", "success");
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex justify-end overflow-hidden p-4 pointer-events-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto animate-in fade-in"
      />

      {/* Drawer Content */}
      <div className="relative w-full max-w-sm bg-background border-l border-primary/10 shadow-2xl h-full flex flex-col rounded-3xl pointer-events-auto shadow-primary/20 ring-1 ring-white/10 animate-in slide-in-from-right duration-500 ease-out">
        <div className="p-6 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <IconTarget className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Quest Details</h3>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                  {quest.id}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full border border-muted-foreground/10 flex items-center justify-center hover:bg-muted transition-colors active:scale-90"
            >
              <IconX className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Details Content */}
          <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar">
            {/* Title & Stats */}
            <div className="space-y-3">
              <h2 className="text-2xl font-black text-foreground leading-tight tracking-tight">
                {quest.title}
              </h2>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold border border-primary/10 uppercase tracking-wide">
                  <IconCoins className="w-4 h-4" />+{quest.reward}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-muted text-muted-foreground rounded-lg text-xs font-bold border border-muted-foreground/5 uppercase tracking-wide">
                  {quest.frequency}
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="card p-5 space-y-4 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-muted-foreground uppercase opacity-60">
                  Quest Progress
                </span>
                <span className="text-lg font-black text-primary">
                  {quest.progress} / {quest.target}
                </span>
              </div>
              <div className="h-3 bg-background/50 rounded-full overflow-hidden border border-muted-foreground/10 p-[2px]">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)]",
                    quest.completed
                      ? "bg-primary/50"
                      : isComplete
                      ? "bg-green-500"
                      : "bg-primary",
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground/60 font-medium">
                {quest.completed
                  ? "You have finished this task! Your account is credited."
                  : isComplete
                  ? "Verification successful. Tap below to claim your COINS!"
                  : "Complete the requirements to unlock your reward."}
              </p>
            </div>

            {/* Verification / Action */}
            {!quest.completed && (
              <div className="space-y-6">
                {quest.requiresVerification && !isComplete && (
                  <div
                    className={cn(
                      "space-y-3 transition-opacity duration-300",
                      !hasVisited
                        ? "opacity-30 blur-[0.5px] pointer-events-none"
                        : "opacity-100",
                    )}
                  >
                    <span className="text-xs font-black text-foreground uppercase tracking-wider block ml-1">
                      Submit Proof
                    </span>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={
                          quest.verificationPlaceholder || "Enter details..."
                        }
                        value={verificationInput}
                        disabled={isVerifying || !hasVisited}
                        onChange={(e) => setVerificationInput(e.target.value)}
                        className="w-full bg-muted/30 border border-muted-foreground/10 rounded-2xl px-5 h-14 text-sm focus:outline-none focus:border-primary transition-all pr-12 font-medium"
                      />
                      {isVerifying ? (
                        <IconRefresh className="w-5 h-5 animate-spin text-primary absolute right-4 top-1/2 -translate-y-1/2" />
                      ) : (
                        <IconCheck
                          className={cn(
                            "w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 transition-colors",
                            verificationInput.length > 5
                              ? "text-primary"
                              : "text-muted-foreground/20",
                          )}
                        />
                      )}
                    </div>
                    <div className="p-3 bg-muted/20 rounded-xl border border-muted-foreground/5">
                      <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                        {quest.verificationType === "username"
                          ? "Please enter your @username exactly as it appears on X/Twitter after completing the follow task."
                          : "Paste the full direct link (URL) of your retweet post from your browser address bar."}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3 pt-4 pb-10">
                  {targetUrl && !isComplete && !hasVisited && (
                    <button
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          localStorage.setItem(
                            `quest_visited_${quest.id}`,
                            "true",
                          );
                          setHasVisited(true);
                        }
                        onAction(true);
                      }}
                      className="btn btn-primary h-14 w-full flex items-center justify-center gap-2 font-black text-sm tracking-tight shadow-xl shadow-primary/20 ring-2 ring-white/10 active:scale-95"
                    >
                      <IconExternalLink className="w-5 h-5" />
                      START QUEST NOW
                    </button>
                  )}

                  {quest.requiresVerification && !isComplete && hasVisited && (
                    <button
                      disabled={isVerifying || verificationInput.length < 3}
                      onClick={handleVerify}
                      className={cn(
                        "btn h-14 w-full font-black text-sm tracking-tight shadow-lg transition-all active:scale-95 disabled:opacity-50",
                        verificationInput.length >= 6
                          ? "btn-primary"
                          : "btn-secondary",
                      )}
                    >
                      {isVerifying
                        ? "STAY TUNED... VERIFYING"
                        : "SUBMIT FOR VERIFICATION"}
                    </button>
                  )}

                  {(quest.type === "click" ||
                    quest.type === "external" ||
                    quest.type === "social" ||
                    quest.type === "play" ||
                    quest.type === "win") &&
                    !isComplete &&
                    !quest.requiresVerification &&
                    (hasVisited || !targetUrl) && (
                      <button
                        onClick={() => onAction(false)}
                        className="btn btn-outline h-14 w-full font-black text-sm tracking-tight border-2 border-primary group active:scale-95 transition-all hover:bg-primary hover:text-white"
                      >
                        <IconCheck className="w-5 h-5 mr-2 text-primary group-hover:text-white transition-colors" />
                        MARK AS COMPLETE
                      </button>
                    )}

                  {canClaim && (
                    <button
                      onClick={onClaim}
                      className="btn btn-primary h-16 w-full font-black text-lg tracking-tight shadow-2xl shadow-primary/30 border-none ring-4 ring-primary/20 animate-pulse active:scale-95"
                    >
                      <IconGift className="w-6 h-6 mr-3" />
                      CLAIM {quest.reward} COINS
                    </button>
                  )}
                </div>
              </div>
            )}

            {quest.completed && (
              <div className="flex flex-col items-center justify-center pt-10 text-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center text-primary shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]">
                  <IconCheck className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-foreground">
                    Task Rewarded
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You đã completed this task and received your reward. Awesome
                    job!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
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
          : "hover:bg-muted/50",
      )}
    >
      <div
        className={cn(
          "p-2 rounded-lg",
          variant === "danger" ? "bg-destructive/10" : "bg-muted",
        )}
      >
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p
          className={cn(
            "font-medium",
            variant === "danger" ? "text-destructive" : "text-foreground",
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
