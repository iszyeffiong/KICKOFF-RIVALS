import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isVerified: boolean;
  verificationTimestamp: number | null;
}

interface RegistrationData {
  username: string;
  leagueId: string;
  teamId: string;
}

interface UserState {
  // Wallet
  walletState: WalletState;
  setWalletAddress: (address: string | null) => void;
  setWalletVerified: (verified: boolean) => void;
  logout: () => void;

  // Onboarding/Registration
  isNewUser: boolean;
  setIsNewUser: (isNew: boolean) => void;
  registrationData: RegistrationData | null;
  setRegistrationData: (data: RegistrationData | null) => void;
  onboardingComplete: boolean;
  setOnboardingComplete: (complete: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      // Wallet
      walletState: {
        address: null,
        isConnected: false,
        isVerified: false,
        verificationTimestamp: null,
      },
      setWalletAddress: (address) =>
        set((state) => ({
          walletState: {
            ...state.walletState,
            address,
            isConnected: !!address,
          },
        })),
      setWalletVerified: (verified) =>
        set((state) => ({
          walletState: {
            ...state.walletState,
            isVerified: verified,
            verificationTimestamp: verified ? Date.now() : null,
          },
        })),
      logout: () =>
        set({
          walletState: {
            address: null,
            isConnected: false,
            isVerified: false,
            verificationTimestamp: null,
          },
          isNewUser: false,
          registrationData: null,
        }),

      // Onboarding
      isNewUser: false,
      setIsNewUser: (isNew) => set({ isNewUser: isNew }),
      registrationData: null,
      setRegistrationData: (data) => set({ registrationData: data }),
      onboardingComplete: false,
      setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),
    }),
    {
      name: 'kickoff-user-storage',
      partialize: (state) => ({
        onboardingComplete: state.onboardingComplete,
        walletState: {
          ...state.walletState,
          // We might want to persist verification for a session
          isVerified: state.walletState.isVerified,
        },
      }),
    }
  )
);
