import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from '../stores/userStore';
import type { UserStats } from '../types';
import { INITIAL_QUESTS } from '../constants';

const API_URL = "";

export const useProfile = () => {
  const queryClient = useQueryClient();
  const { 
    walletState, 
    registrationData, 
    setRegistrationData, 
    setIsNewUser 
  } = useUserStore();
  
  const address = walletState.address;

  const query = useQuery<UserStats & { success: boolean; isNew?: boolean }>({
    queryKey: ['profile', address],
    queryFn: async () => {
      if (!address) throw new Error("No wallet connected");

      const params = new URLSearchParams({
        walletAddress: address.toLowerCase(),
      });

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
        // If the server tells us it's a new user, update the store
        if (data.isNew) {
          setIsNewUser(true);
          setRegistrationData(null); // Clear pending registration
        } else {
          setIsNewUser(false);
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
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
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
