import { useState } from "react";
import { cn } from "../lib/utils";
import { RivalsLogo } from "./RivalsLogo";
import {
  IconChevronRight,
  IconChevronLeft,
  IconCheck,
  IconFootball,
  IconTrophy,
  IconCoins,
  IconUsers,
  IconZap,
} from "./Icons";

interface OnboardingProps {
  onFinish: (username: string) => void;
}

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

const infoSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Welcome to KickOff Rivals",
    description:
      "The ultimate virtual football betting experience. Place bets, watch live matches, and win big!",
    icon: <IconFootball className="w-16 h-16" />,
    features: [
      "Real-time match simulations",
      "Multiple betting markets",
      "24/7 matches available",
    ],
  },
  {
    id: 2,
    title: "Earn KOR Tokens",
    description:
      "Win bets to earn KOR tokens. Convert your coins to tokens and climb the leaderboards!",
    icon: <IconCoins className="w-16 h-16" />,
    features: [
      "Win bets to earn rewards",
      "Daily quests for bonus coins",
      "Convert coins to KOR tokens",
    ],
  },
  {
    id: 3,
    title: "Join an Alliance",
    description:
      "Pick your favorite team and league. Earn alliance rewards when your team wins!",
    icon: <IconUsers className="w-16 h-16" />,
    features: [
      "Support your favorite team",
      "Earn alliance bonuses",
      "Compete with other alliances",
    ],
  },
  {
    id: 4,
    title: "Complete Quests",
    description:
      "Daily and weekly quests give you bonus coins. Complete them all to maximize your earnings!",
    icon: <IconTrophy className="w-16 h-16" />,
    features: [
      "Daily quest rewards",
      "Weekly challenge bonuses",
      "Social tasks for extra coins",
    ],
  },
  {
    id: 5,
    title: "Ready to Play!",
    description:
      "You're all set! Connect your wallet to start betting and winning. Good luck!",
    icon: <IconZap className="w-16 h-16" />,
    features: [
      "5000 welcome coins bonus",
      "Free first-time referral rewards",
      "Instant betting - no delays",
    ],
  },
];

// Total steps = info slides + username step at the end
const TOTAL_STEPS = infoSteps.length + 1; // last step is username

export function Onboarding({ onFinish }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);

  const isUsernameStep = currentStep === infoSteps.length; // last step
  const isFirstStep = currentStep === 0;
  const step = isUsernameStep ? null : infoSteps[currentStep];

  const validateUsername = (value: string): string | null => {
    const v = value.trim();
    if (v.length < 3) return "Username must be at least 3 characters";
    if (v.length > 20) return "Username must be less than 20 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(v))
      return "Only letters, numbers, and underscores allowed";
    return null;
  };

  const handleNext = () => {
    if (isUsernameStep) {
      // Final step — validate and finish
      const err = validateUsername(username);
      if (err) {
        setUsernameError(err);
        return;
      }
      onFinish(username.trim());
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    // Skip info slides — jump straight to username step
    setCurrentStep(infoSteps.length);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <RivalsLogo size="sm" variant="full" className="text-white" />
        {!isUsernameStep && (
          <button
            onClick={handleSkip}
            className="text-slate-400 hover:text-white text-sm transition-colors"
          >
            Skip
          </button>
        )}
      </header>

      {/* Progress dots */}
      <div className="relative z-10 flex items-center justify-center gap-2 pt-2">
        {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "rounded-full transition-all duration-300",
              index === currentStep
                ? "w-8 h-2 bg-primary"
                : index < currentStep
                  ? "w-2 h-2 bg-primary/50"
                  : "w-2 h-2 bg-slate-600",
            )}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* INFO STEPS */}
        {step && (
          <div
            className="max-w-md w-full text-center animate-fade-in"
            key={step.id}
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-6 rounded-full bg-primary/20 text-primary">
                {step.icon}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {step.title}
            </h1>

            {/* Description */}
            <p className="text-slate-400 mb-8">{step.description}</p>

            {/* Features */}
            <div className="space-y-3 mb-8">
              {step.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-slate-800/50 rounded-lg p-3 border border-slate-700"
                >
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <IconCheck className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-slate-300 text-sm text-left">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERNAME STEP */}
        {isUsernameStep && (
          <div className="max-w-md w-full animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="p-5 rounded-full bg-primary/20 text-primary">
                <IconUsers className="w-14 h-14" />
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
              Choose Your Name
            </h1>
            <p className="text-slate-400 text-center mb-8">
              This is how other players will see you on KickOff Rivals
            </p>

            <div className="space-y-4">
              <div>
                <input
                  id="onboarding-username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (usernameError) setUsernameError(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleNext()}
                  placeholder="e.g. GoalKing99"
                  maxLength={20}
                  autoFocus
                  className={cn(
                    "w-full h-14 px-4 rounded-xl border bg-slate-800 text-white text-lg",
                    "placeholder:text-slate-500 outline-none transition-all",
                    usernameError
                      ? "border-red-500 focus:border-red-400"
                      : "border-slate-600 focus:border-primary",
                  )}
                />
                {usernameError ? (
                  <p className="text-red-400 text-sm mt-2">{usernameError}</p>
                ) : (
                  <p className="text-slate-500 text-xs mt-2">
                    3–20 characters · letters, numbers, underscores only
                  </p>
                )}
              </div>

              {/* Character count */}
              <div className="flex justify-end">
                <span
                  className={cn(
                    "text-xs tabular-nums",
                    username.length > 18 ? "text-yellow-400" : "text-slate-500",
                  )}
                >
                  {username.length}/20
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center gap-4 w-full max-w-md mt-6">
          {!isFirstStep && (
            <button
              onClick={handlePrev}
              className="btn btn-ghost h-12 px-6 text-slate-400 hover:text-white"
            >
              <IconChevronLeft className="w-5 h-5 mr-1" />
              Back
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={isUsernameStep && username.trim().length < 3}
            className={cn(
              "btn btn-primary h-12 flex-1 font-semibold",
              "hover:scale-105 transition-transform",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
            )}
          >
            {isUsernameStep ? (
              <>
                Let's Go
                <IconZap className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                Next
                <IconChevronRight className="w-5 h-5 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center text-slate-500 text-xs">
        Step {currentStep + 1} of {TOTAL_STEPS}
        {isUsernameStep && (
          <span className="text-primary font-medium"> · Almost there!</span>
        )}
      </footer>
    </div>
  );
}

export default Onboarding;
