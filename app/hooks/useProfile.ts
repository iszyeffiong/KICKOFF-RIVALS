import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from '../stores/userStore';
import type { UserStats } from '../types';
import { INITIAL_QUESTS } from '../constants';

const API_URL = "";

interface UseProfileOptions {
  checkOnly?: boolean;
  address?: string;
}

export const useProfile = ({ checkOnly = false, address: overrideAddress }: UseProfileOptions = {}) => {
  const queryClient = useQueryClient();
  const { 
    walletState, 
    registrationData, 
    setRegistrationData, 
    setIsNewUser 
  } = useUserStore();
  
  const address = overrideAddress || walletState.address;

  const query = useQuery<UserStats & { success: boolean; isNew?: boolean }>({
    queryKey: ['profile', address],
    queryFn: async () => {
      if (!address) throw new Error("No wallet connected");

      const params = new URLSearchParams({
        walletAddress: address.toLowerCase(),
      });
      if (checkOnly) params.set("checkOnly", "true");

      // Include registration data if available to create/update user
      if (registrationData) {
        if (registrationData.username) params.set("username", registrationData.username);
        if (registrationData.leagueId) params.set("leagueId", registrationData.leagueId);
        if (registrationData.teamId) params.set("teamId", registrationData.teamId);
      }

      console.log("[useProfile] Fetching with params:", params.toString());

      const res = await fetch(`${API_URL}/api/user/profile?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        // If the server confirms the user is fully setup, restore state
        if (!data.isNew && data.username && data.allianceTeamId) {
          setIsNewUser(false);
          setRegistrationData(null);
          // NEW: Ensure they are marked as onboarded if they have a valid team/username
          const store = useUserStore.getState();
          store.setOnboardingComplete(true);
          store.setWalletVerified(true);
        } else if (data.isNew) {
          setIsNewUser(true);
          useUserStore.getState().setOnboardingComplete(false);
        }

        // Merge INITIAL_SOCIAL_QUESTS
        if (data.quests) {
          const socialIds = ["q-follow-x", "q-lcr-post"];
          const extra = INITIAL_QUESTS.filter(iq => socialIds.includes(iq.id) && !data.quests.some((sq: any) => sq.id === iq.id));
          data.quests = [...data.quests, ...extra];
        }
      }

      return data;
    },
    enabled: !!address,
    staleTime: 5000, // Reduced to 5 seconds for more frequent updates in betting environment
    refetchInterval: 30000, // 30 seconds
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["profile", address] });
  }, [queryClient, address]);

  const profile = query.data;
  const isError = query.isError || (profile && profile.success === false);

  return {
    ...query,
    profile,
    isError,
    refresh,
  };
};
