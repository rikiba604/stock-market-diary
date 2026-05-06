'use client';

import { useState, useEffect } from 'react';
import { MarketCalendar } from '@/components/MarketCalendar';
import { EntryModal } from '@/components/EntryModal';
import { SearchBar } from '@/components/SearchBar';
import { storage } from '@/lib/storage';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // マイグレーション: localStorage → Supabase
    const migrate = async () => {
      try {
        await storage.migrateFromLocalStorage();
      } catch (error) {
        console.error('Migration failed:', error);
      }
    };
    migrate();
  }, []);

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📈 株式市場日記
          </h1>
          <p className="text-gray-600">
            市況の動きと投資メモを毎日記録
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <SearchBar onSelectDate={handleSelectDate} />
          <MarketCalendar onSelectDate={handleSelectDate} refreshTrigger={refreshKey} />
        </div>
      </div>

      <EntryModal
        isOpen={isModalOpen}
        date={selectedDate}
        onClose={() => setIsModalOpen(false)}
        onSaved={() => {
          setRefreshKey((prev) => prev + 1);
          setIsModalOpen(false);
          setSelectedDate(null);
        }}
      />
    </div>
  );
}
