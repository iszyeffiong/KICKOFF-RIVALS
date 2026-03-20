import { createFileRoute } from "@tanstack/react-router";
import { syncGameplayQuests } from "../../server/user";

export const Route = createFileRoute("/api/user/sync-gameplay-quests")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const body = await request.json();
          const walletAddress = body.walletAddress;

          if (!walletAddress) {
            return Response.json(
              { success: false, error: "Missing walletAddress" },
              { status: 400 },
            );
          }

          const result = await syncGameplayQuests({
            data: {
              walletAddress,
            },
          });

          return Response.json(result);
        } catch (error: any) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          console.error("Quest Sync API error:", errorMessage);
          return Response.json(
            { success: false, error: errorMessage },
            { status: 500 },
          );
        }
      },
    },
  },
});
