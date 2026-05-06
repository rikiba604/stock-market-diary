'use client';

import { useState, useCallback } from 'react';
import { DiaryEntry } from '@/lib/types';
import { storage } from '@/lib/storage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSelectDate: (date: Date) => void;
}

export function SearchBar({ onSelectDate }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DiaryEntry[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setSearching(true);
    try {
      const entries = await storage.searchEntries(searchQuery);
      setResults(entries);
      setShowResults(true);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    handleSearch(newQuery);
  };

  const handleResultClick = (date: string) => {
    const [year, month, day] = date.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day);
    onSelectDate(selectedDate);
    setQuery('');
    setShowResults(false);
    setResults([]);
  };

  return (
    <div className="mb-8">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="検索キーワードを入力..."
          value={query}
          onChange={handleInputChange}
          className="flex-1"
        />
        <Button
          onClick={() => handleSearch(query)}
          disabled={searching || !query.trim()}
          variant="outline"
        >
          {searching ? '検索中...' : '検索'}
        </Button>
      </div>

      {showResults && results.length > 0 && (
        <div className="mt-4 bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="text-sm font-medium text-gray-700 mb-3">
            検索結果: {results.length}件
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {results.map((entry) => {
              const displayDate = new Intl.DateTimeFormat('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
              }).format(new Date(entry.date + 'T00:00:00'));

              return (
                <button
                  key={entry.date}
                  onClick={() => handleResultClick(entry.date)}
                  className="block w-full text-left p-2 rounded hover:bg-gray-100 transition-colors"
                >
                  <div className="font-medium text-blue-600">{displayDate}</div>
                  <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {entry.marketNews || entry.marketTopics || entry.investmentMemo}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {showResults && results.length === 0 && !searching && query.trim() && (
        <div className="mt-4 bg-white rounded-lg border border-gray-200 shadow-sm p-4 text-center text-gray-500">
          キーワードに一致する日記エントリがありません
        </div>
      )}
    </div>
  );
}
