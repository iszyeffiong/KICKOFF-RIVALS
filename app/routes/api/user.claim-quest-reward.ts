import { createFileRoute } from "@tanstack/react-router";
import { claimQuestReward } from "../../server/user";

export const Route = createFileRoute("/api/user/claim-quest-reward")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const body = await request.json();
          const { walletAddress, questId, txHash } = body;
          console.log(`[API] Claim Quest Reward hit: ${walletAddress}, ${questId}, ${txHash}`);

          if (!walletAddress || !questId || !txHash) {
            return Response.json(
              { success: false, error: "Missing required fields (walletAddress, questId, or txHash)" },
              { status: 400 },
            );
          }

          const result = await claimQuestReward({
            data: {
              walletAddress,
              questId,
              txHash,
            },
          });

          return Response.json(result);
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          console.error("Claim Quest API error:", error);
          return Response.json(
            { success: false, error: errorMessage },
            { status: 500 },
          );
        }
      },
    },
  },
});

