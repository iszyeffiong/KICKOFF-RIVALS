import webPush from 'web-push';
import { db, pushSubscriptions } from '../lib/db';

const vapidPublicKey = process.env.VITE_VAPID_PUBLIC_KEY || '';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || '';

if (vapidPublicKey && vapidPrivateKey) {
  webPush.setVapidDetails(
    'mailto:support@kickoffrivals.com',
    vapidPublicKey,
    vapidPrivateKey
  );
}

export async function sendNotificationToAll(title: string, body: string, url: string = '/') {
  const subs = await db.query.pushSubscriptions.findMany();
  
  const notifications = subs.map(sub => {
    const pushSubscription = {
      endpoint: sub.endpoint,
      keys: {
        p256dh: sub.p256dh,
        auth: sub.auth
      }
    };

    return webPush.sendNotification(
      pushSubscription,
      JSON.stringify({ title, body, url })
    ).catch(err => {
      console.error('Failed to send push to', sub.endpoint, err);
      // If subscription expired/unsubscribed, remove it
      if (err.statusCode === 410 || err.statusCode === 404) {
        // delete it from db
      }
    });
  });

  await Promise.all(notifications);
}

export async function sendNotificationToUser(walletAddress: string, title: string, body: string, url: string = '/') {
  const subs = await db.query.pushSubscriptions.findMany({
    where: (subs, { eq }) => eq(subs.walletAddress, walletAddress)
  });

  const notifications = subs.map(sub => {
    const pushSubscription = {
      endpoint: sub.endpoint,
      keys: {
        p256dh: sub.p256dh,
        auth: sub.auth
      }
    };

    return webPush.sendNotification(
      pushSubscription,
      JSON.stringify({ title, body, url })
    ).catch(err => console.error(err));
  });

  await Promise.all(notifications);
}
