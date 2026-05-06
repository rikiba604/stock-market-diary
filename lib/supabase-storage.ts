import { DiaryEntry } from './types';
import { DiaryStorage } from './storage-interface';
import { supabase } from './supabase';

export class SupabaseStorage implements DiaryStorage {
  async getEntry(date: string): Promise<DiaryEntry | null> {
    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .eq('date', date)
      .single();

    if (error || !data) return null;

    return {
      date: data.date,
      marketNews: data.market_news || '',
      marketTopics: data.market_topics || '',
      investmentMemo: data.investment_memo || '',
      updatedAt: data.updated_at,
    };
  }

  async saveEntry(entry: DiaryEntry): Promise<void> {
    const { error } = await supabase
      .from('diary_entries')
      .upsert({
        date: entry.date,
        market_news: entry.marketNews,
        market_topics: entry.marketTopics,
        investment_memo: entry.investmentMemo,
        updated_at: entry.updatedAt,
      });

    if (error) throw error;
  }

  async searchEntries(query: string): Promise<DiaryEntry[]> {
    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .or(
        `market_news.ilike.%${query}%,market_topics.ilike.%${query}%,investment_memo.ilike.%${query}%`
      )
      .order('date', { ascending: false });

    if (error || !data) return [];

    return data.map((row) => ({
      date: row.date,
      marketNews: row.market_news || '',
      marketTopics: row.market_topics || '',
      investmentMemo: row.investment_memo || '',
      updatedAt: row.updated_at,
    }));
  }

  async listDatesWithEntries(): Promise<string[]> {
    const { data, error } = await supabase
      .from('diary_entries')
      .select('date')
      .order('date', { ascending: true });

    if (error || !data) return [];

    return data.map((row) => row.date);
  }

  async deleteEntry(date: string): Promise<void> {
    const { error } = await supabase
      .from('diary_entries')
      .delete()
      .eq('date', date);

    if (error) throw error;
  }

  async migrateFromLocalStorage(): Promise<void> {
    if (typeof window === 'undefined') return;

    const STORAGE_KEY = 'stock-market-diary-entries';
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return;

    try {
      const entries = JSON.parse(data) as Record<string, DiaryEntry>;
      for (const entry of Object.values(entries)) {
        await this.saveEntry(entry);
      }
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Migration failed:', error);
    }
  }
}

export const storage = new SupabaseStorage();
