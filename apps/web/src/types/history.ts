import type { SvgoConfig } from "@/lib/svgo";

export type HistoryEntry = {
  id: string;
  fileName: string;
  originalSvg: string;
  compressedSvg: string;
  timestamp: number;
  thumbnail: string;
  config: SvgoConfig;
  originalSize: number;
  compressedSize: number;
};

export type HistoryEntryInput = Omit<HistoryEntry, "id" | "timestamp">;
