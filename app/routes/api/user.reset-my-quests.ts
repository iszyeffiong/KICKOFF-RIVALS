import { createFileRoute } from "@tanstack/react-router";
import { db, userQuests } from "../../lib/db";
import { and, eq } from "drizzle-orm";

export const Route = createFileRoute("/api/user/reset-my-quests")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const body = await request.json();
          const { walletAddress } = body;

          if (!walletAddress) {
            return Response.json(
              { success: false, error: "Missing walletAddress" },
              { status: 400 }
            );
          }

          const normalized = walletAddress.toLowerCase();

          const { ne } = await import("drizzle-orm");
          
          // Reset only daily/weekly quests for this specific user, exclude 'once'
          await db
            .update(userQuests)
            .set({ 
              completed: false, 
              progress: 0, 
              proof: null,
              verifiedAt: null 
            })
            .where(
              and(
                eq(userQuests.walletAddress, normalized),
                ne(userQuests.frequency, "once")
              )
            );

          console.log(`[RESET] Quest progress reset for ${normalized}`);

          return Response.json({
            success: true,
            message: "Your quest progress has been reset. You can now redo all tasks!",
          });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          console.error("Reset quests API error:", error);
          return Response.json(
            { success: false, error: errorMessage },
            { status: 500 }
          );
        }
      },
    },
  },
});
