import React from 'react';
import { getNotifications } from '@/app/_actions/governance';
import NotificationsClient from './NotificationsClient';

export default async function NotificationsPage() {
  // Fetch notifications
  const notifications = await getNotifications();

  return (
    <NotificationsClient
      initialNotifications={notifications}
    />
  );
}
