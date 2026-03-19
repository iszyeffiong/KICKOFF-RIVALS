import { createFileRoute } from "@tanstack/react-router";
import { claimSocialReward } from "../../server/user";

export const Route = createFileRoute("/api/user/claim-social-reward")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const body = await request.json();
          const walletAddress = body.walletAddress;
          const questId = body.questId;

          if (!walletAddress || !questId) {
            return Response.json(
              { success: false, error: "Missing walletAddress or questId" },
              { status: 400 },
            );
          }

          const result = await claimSocialReward({
            data: {
              walletAddress,
              questId,
            },
          });

          return Response.json(result);
        } catch (error: any) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          console.error("Social Reward API error:", error);
          return Response.json(
            { success: false, error: errorMessage },
            { status: 500 },
          );
        }
      },
    },
  },
});
