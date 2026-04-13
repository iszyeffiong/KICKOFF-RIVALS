import { createAPIFile } from "@tanstack/react-start/api";
import { db, pushSubscriptions } from "../../lib/db";
import { eq, and } from "drizzle-orm";

export default createAPIFile({
  POST: async ({ request }) => {
    const data = await request.json();
    const { walletAddress, subscription } = data;

    if (!walletAddress || !subscription) {
      return new Response(JSON.stringify({ success: false, error: "Missing data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      // Upsert subscription
      const existing = await db.query.pushSubscriptions.findFirst({
        where: eq(pushSubscriptions.endpoint, subscription.endpoint),
      });

      if (existing) {
        await db.update(pushSubscriptions).set({
          walletAddress,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        }).where(eq(pushSubscriptions.id, existing.id));
      } else {
        await db.insert(pushSubscriptions).values({
          walletAddress,
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      console.error("Subscription save failed", error);
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
});
