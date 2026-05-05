import { DiaryEntry } from './types';

const STORAGE_KEY = 'stock-market-diary-entries';

function getStorageData(): Record<string, DiaryEntry> {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

function saveStorageData(data: Record<string, DiaryEntry>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getEntry(date: string): DiaryEntry | null {
  const data = getStorageData();
  return data[date] || null;
}

export function saveEntry(entry: DiaryEntry): void {
  const data = getStorageData();
  data[entry.date] = entry;
  saveStorageData(data);
}

export function listDatesWithEntries(): string[] {
  const data = getStorageData();
  return Object.keys(data).sort();
}

export function deleteEntry(date: string): void {
  const data = getStorageData();
  delete data[date];
  saveStorageData(data);
}
