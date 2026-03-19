import { createFileRoute } from "@tanstack/react-router";
import { submitQuestVerification } from "../../server/user";

export const Route = createFileRoute("/api/user/submit-quest-verification")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const body = await request.json();
          const { walletAddress, questId, verificationCode } = body;

          if (!walletAddress || !questId) {
            return Response.json(
              { success: false, error: "Missing walletAddress or questId" },
              { status: 400 },
            );
          }

          const result = await submitQuestVerification({
            data: {
              walletAddress,
              questId,
              verificationCode,
            },
          });

          return Response.json(result);
        } catch (error: any) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          console.error("Submit Quest Verification API error:", errorMessage);
          return Response.json(
            { success: false, error: errorMessage },
            { status: 500 },
          );
        }
      },
    },
  },
});
