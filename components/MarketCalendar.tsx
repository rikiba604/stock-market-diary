'use client';

import Calendar from 'react-calendar';
import { listDatesWithEntries, getEntry } from '@/lib/storage';
import { useEffect, useLayoutEffect, useState } from 'react';
import 'react-calendar/dist/Calendar.css';

interface MarketCalendarProps {
  onSelectDate: (date: Date) => void;
}

export function MarketCalendar({ onSelectDate }: MarketCalendarProps) {
  const [datesWithEntries, setDatesWithEntries] = useState<string[]>([]);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    setDatesWithEntries(listDatesWithEntries());
  }, []);

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

  const tileContent = ({ date }: { date: Date }) => {
    const dateStr = date.toISOString().split('T')[0];
    const entry = getEntry(dateStr);

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
            className="w-1.5 h-1.5 bg-blue-500 rounded-full"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex justify-center">
      <Calendar
        onClickDay={onSelectDate}
        tileContent={tileContent}
        className="react-calendar"
        locale="en-US"
      />
    </div>
  );
}
