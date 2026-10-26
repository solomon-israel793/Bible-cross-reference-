import React from 'react';
import { useOnlineStatus } from '../hooks/usePWAInstall';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-2 inset-x-0 z-50 flex justify-center px-4 pointer-events-none animate-fadeIn">
      <div className="pointer-events-auto bg-amber-500 text-zinc-950 font-bold px-3.5 py-1.5 rounded-full text-xs shadow-lg flex items-center gap-2 border border-amber-400">
        <WifiOff className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Offline Mode · Cached Scriptures Active</span>
      </div>
    </div>
  );
};
