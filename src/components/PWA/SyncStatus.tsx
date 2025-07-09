import { useEffect, useState } from 'react';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { syncService } from '@/services/syncService';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function SyncStatus() {
  const [syncStatus, setSyncStatus] = useState(syncService.getSyncStatus());
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
      setSyncStatus(syncService.getSyncStatus());
    };

    // Update status every second if there are pending items
    const interval = setInterval(updateStatus, 1000);

    // Listen for online/offline events
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    // Listen for sync complete messages from service worker
    navigator.serviceWorker?.addEventListener('message', (event) => {
      if (event.data?.type === 'SYNC_COMPLETE') {
        updateStatus();
        setIsSyncing(false);
      }
    });

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await syncService.attemptSync();
    } finally {
      setIsSyncing(false);
      setSyncStatus(syncService.getSyncStatus());
    }
  };

  const getStatusIcon = () => {
    if (isSyncing) {
      return <RefreshCw className="h-4 w-4 animate-spin" />;
    }
    if (!syncStatus.isOnline) {
      return <CloudOff className="h-4 w-4" />;
    }
    if (syncStatus.pendingCount > 0) {
      return <Cloud className="h-4 w-4 text-yellow-500" />;
    }
    return <Cloud className="h-4 w-4 text-green-500" />;
  };

  const getStatusText = () => {
    if (isSyncing) {
      return 'Syncing...';
    }
    if (!syncStatus.isOnline) {
      return 'Offline';
    }
    if (syncStatus.pendingCount > 0) {
      return `${syncStatus.pendingCount} pending`;
    }
    return 'Synced';
  };

  const getTooltipContent = () => {
    if (!syncStatus.isOnline) {
      return 'You\'re offline. Changes will sync when you reconnect.';
    }
    if (syncStatus.pendingCount > 0) {
      const timeAgo = syncStatus.oldestPending
        ? Math.round((Date.now() - syncStatus.oldestPending.getTime()) / 1000 / 60)
        : 0;
      return `${syncStatus.pendingCount} changes waiting to sync (oldest: ${timeAgo}m ago)`;
    }
    return 'All changes are synced';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleManualSync}
            disabled={!syncStatus.isOnline || syncStatus.pendingCount === 0 || isSyncing}
            className={`
              flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors
              ${syncStatus.pendingCount > 0 && syncStatus.isOnline && !isSyncing
                ? 'hover:bg-gray-100 cursor-pointer'
                : 'cursor-default'
              }
            `}
          >
            {getStatusIcon()}
            <span className="font-medium">{getStatusText()}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipContent()}</p>
          {syncStatus.pendingCount > 0 && syncStatus.isOnline && (
            <p className="text-xs mt-1">Click to sync now</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}