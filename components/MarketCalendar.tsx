'use client';

import Calendar from 'react-calendar';
import { storage } from '@/lib/storage';
import { DiaryEntry } from '@/lib/types';
import { useEffect, useState, useMemo, useLayoutEffect } from 'react';
import 'react-calendar/dist/Calendar.css';

interface MarketCalendarProps {
  onSelectDate: (date: Date) => void;
  refreshTrigger?: number;
}

export function MarketCalendar({ onSelectDate, refreshTrigger }: MarketCalendarProps) {
  const [entries, setEntries] = useState<Record<string, DiaryEntry>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadEntries = async () => {
      setLoading(true);
      const dates = await storage.listDatesWithEntries();
      const entriesMap: Record<string, DiaryEntry> = {};
      for (const date of dates) {
        const entry = await storage.getEntry(date);
        if (entry) {
          entriesMap[date] = entry;
        }
      }
      setEntries(entriesMap);
      setLoading(false);
    };
    loadEntries();
  }, [refreshTrigger]);

  useLayoutEffect(() => {
    const cleanupDateText = () => {
      const tiles = document.querySelectorAll(
        '.react-calendar__month-view__days__day'
      );
      tiles.forEach((tile) => {
        if (tile.childNodes.length > 0) {
          const textNode = Array.from(tile.childNodes).find(
            (node) => node.nodeType === Node.TEXT_NODE
          );
          if (textNode && textNode.textContent?.includes('日')) {
            const cleaned = textNode.textContent.replace('日', '');
            textNode.textContent = cleaned;
          }
        }
      });
    };
    cleanupDateText();
    const observer = new MutationObserver(cleanupDateText);
    observer.observe(document.body, { subtree: true, childList: true });
    return () => observer.disconnect();
  }, []);

  const tileContent = useMemo(() => {
    return ({ date }: { date: Date }) => {
      const dateStr = date.toISOString().split('T')[0];
      const entry = entries[dateStr];

      if (!entry) return null;

      const hasContent =
        entry.marketNews.trim() ||
        entry.marketTopics.trim() ||
        entry.investmentMemo.trim();

      if (!hasContent) return null;

      const dotsCount = [
        entry.marketNews.trim(),
        entry.marketTopics.trim(),
        entry.investmentMemo.trim(),
      ].filter(Boolean).length;

      return (
        <div className="flex justify-center gap-0.5 mt-1">
          {Array.from({ length: dotsCount }).map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 bg-orange-500 rounded-full"
            />
          ))}
        </div>
      );
    };
  }, [entries]);

  return (
    <div className="flex justify-center">
      {loading ? (
        <div className="py-20 text-gray-500">読み込み中...</div>
      ) : (
        <Calendar
          onClickDay={onSelectDate}
          tileContent={tileContent}
          className="react-calendar"
          locale="en-US"
        />
      )}
    </div>
  );
}
