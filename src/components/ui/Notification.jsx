import React from 'react';
import { useApp } from '../../context/AppContext';
import { Icons } from '../ui/Icons';

export function Notification() {
  const { notification } = useApp();

  if (!notification) return null;

  return (
    <div className={`notification ${notification.type}`}>
      {notification.type === 'success' && <Icons.Check />}
      <span>{notification.message}</span>
    </div>
  );
}

export default Notification;
