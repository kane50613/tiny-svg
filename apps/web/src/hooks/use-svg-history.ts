import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { HISTORY_CONSTANTS } from "@/lib/constants/history";
import {
  clearAllHistory,
  deleteHistoryEntry,
  getAllHistoryEntries,
  getHistoryCount,
  getRecentHistoryEntries,
  saveHistoryEntry,
} from "@/lib/svg-history-storage";
import type { HistoryEntry, HistoryEntryInput } from "@/types/history";

export function useSvgHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [recentEntries, setRecentEntries] = useState<HistoryEntry[]>([]);
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadEntries = useCallback(async () => {
    try {
      setIsLoading(true);
      const [allEntries, recent, totalCount] = await Promise.all([
        getAllHistoryEntries(),
        getRecentHistoryEntries(HISTORY_CONSTANTS.RECENT_ENTRIES_COUNT),
        getHistoryCount(),
      ]);
      setEntries(allEntries);
      setRecentEntries(recent);
      setCount(totalCount);
    } catch (error) {
      console.error("Failed to load history:", error);
      toast.error("Failed to load history");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const saveEntry = useCallback(
    async (entry: HistoryEntryInput) => {
      try {
        await saveHistoryEntry(entry);
        await loadEntries();
        toast.success("SVG saved to history");
      } catch (error) {
        console.error("Failed to save history entry:", error);
        toast.error("Failed to save to history");
      }
    },
    [loadEntries]
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      try {
        await deleteHistoryEntry(id);
        await loadEntries();
        toast.success("Entry deleted");
      } catch (error) {
        console.error("Failed to delete history entry:", error);
        toast.error("Failed to delete entry");
      }
    },
    [loadEntries]
  );

  const clearAll = useCallback(async () => {
    try {
      await clearAllHistory();
      await loadEntries();
      toast.success("History cleared");
    } catch (error) {
      console.error("Failed to clear history:", error);
      toast.error("Failed to clear history");
    }
  }, [loadEntries]);

  return {
    entries,
    recentEntries,
    count,
    isLoading,
    saveEntry,
    deleteEntry,
    clearAll,
    refresh: loadEntries,
  };
}
