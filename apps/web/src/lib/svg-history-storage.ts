import localforage from "localforage";
import type { HistoryEntry, HistoryEntryInput } from "@/types/history";
import { HISTORY_CONSTANTS } from "./constants/history";

export type { HistoryEntry, HistoryEntryInput } from "@/types/history";

const svgHistoryStore = localforage.createInstance({
  name: "tiny-svg",
  storeName: "svg_history",
});

function generateHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    // biome-ignore lint/suspicious/noBitwiseOperators: Hash function requires bitwise operations
    hash = (hash << 5) - hash + char;
    // biome-ignore lint/suspicious/noBitwiseOperators: Hash function requires bitwise operations
    hash &= hash;
  }
  return Math.abs(hash).toString(36);
}

export async function saveHistoryEntry(
  entry: HistoryEntryInput
): Promise<string> {
  const contentHash = generateHash(entry.originalSvg);
  const id = `${contentHash}-${Date.now()}`;
  const timestamp = Date.now();

  const newEntry: HistoryEntry = {
    ...entry,
    id,
    timestamp,
  };

  const existingEntries = await getAllHistoryEntries();

  const isDuplicate = existingEntries.some(
    (existing) =>
      generateHash(existing.originalSvg) === contentHash &&
      existing.fileName === entry.fileName
  );

  if (isDuplicate) {
    return id;
  }

  const updatedEntries = [newEntry, ...existingEntries];

  if (updatedEntries.length > HISTORY_CONSTANTS.MAX_ENTRIES) {
    updatedEntries.splice(HISTORY_CONSTANTS.MAX_ENTRIES);
  }

  await svgHistoryStore.setItem("entries", updatedEntries);

  return id;
}

export async function getAllHistoryEntries(): Promise<HistoryEntry[]> {
  const entries = await svgHistoryStore.getItem<HistoryEntry[]>("entries");
  return entries ?? [];
}

export async function getRecentHistoryEntries(
  count = 3
): Promise<HistoryEntry[]> {
  const entries = await getAllHistoryEntries();
  return entries.slice(0, count);
}

export async function getHistoryEntryById(
  id: string
): Promise<HistoryEntry | null> {
  const entries = await getAllHistoryEntries();
  return entries.find((entry) => entry.id === id) ?? null;
}

export async function deleteHistoryEntry(id: string): Promise<void> {
  const entries = await getAllHistoryEntries();
  const updatedEntries = entries.filter((entry) => entry.id !== id);
  await svgHistoryStore.setItem("entries", updatedEntries);
}

export async function clearAllHistory(): Promise<void> {
  await svgHistoryStore.removeItem("entries");
}

export async function getHistoryCount(): Promise<number> {
  const entries = await getAllHistoryEntries();
  return entries.length;
}
