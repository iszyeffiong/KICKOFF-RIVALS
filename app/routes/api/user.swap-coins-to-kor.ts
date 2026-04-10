import { createFileRoute } from "@tanstack/react-router";
import { swapCoinsToKor } from "../../server/user";

export const Route = createFileRoute("/api/user/swap-coins-to-kor")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const body = await request.json();
          const { walletAddress, coins, txHash } = body;

          if (!walletAddress || coins === undefined || !txHash) {
            return Response.json(
              { success: false, error: "Missing required fields (walletAddress, coins, or txHash)" },
              { status: 400 },
            );
          }

          const result = await swapCoinsToKor({
            data: {
              walletAddress,
              coins: Number(coins),
              txHash,
            },
          });

          if (!result.success) {
            return Response.json(result, { status: 400 });
          }

          return Response.json(result);
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          console.error("Swap coins API error:", error);
          return Response.json(
            { success: false, error: errorMessage },
            { status: 500 },
          );
        }
      },
    },
  },
});
