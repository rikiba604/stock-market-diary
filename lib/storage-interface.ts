import { DiaryEntry } from './types';

export interface DiaryStorage {
  getEntry(date: string): Promise<DiaryEntry | null>;
  saveEntry(entry: DiaryEntry): Promise<void>;
  searchEntries(query: string): Promise<DiaryEntry[]>;
  listDatesWithEntries(): Promise<string[]>;
  deleteEntry(date: string): Promise<void>;
  migrateFromLocalStorage(): Promise<void>;
}
