'use client';

import Calendar from 'react-calendar';
import { listDatesWithEntries, getEntry } from '@/lib/storage';
import { useEffect, useState } from 'react';
import 'react-calendar/dist/Calendar.css';

interface MarketCalendarProps {
  onSelectDate: (date: Date) => void;
}

export function MarketCalendar({ onSelectDate }: MarketCalendarProps) {
  const [datesWithEntries, setDatesWithEntries] = useState<string[]>([]);

  useEffect(() => {
    setDatesWithEntries(listDatesWithEntries());
  }, []);

  const formatShortWeekday = (_: string, date: Date) => {
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    return weekdays[date.getDay()];
  };

  const formatDay = (_: string, date: Date) =>
    date.getDate().toString();

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
        formatShortWeekday={formatShortWeekday}
        formatDay={formatDay}
      />
    </div>
  );
}
