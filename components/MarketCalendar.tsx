'use client';

import Calendar from 'react-calendar';
import { listDatesWithEntries } from '@/lib/storage';
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

  const tileContent = ({ date }: { date: Date }) => {
    const dateStr = date.toISOString().split('T')[0];
    if (datesWithEntries.includes(dateStr)) {
      return <div className="flex justify-center mt-1">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
      </div>;
    }
    return null;
  };

  return (
    <div className="flex justify-center">
      <Calendar
        onClickDay={onSelectDate}
        tileContent={tileContent}
        className="react-calendar"
      />
    </div>
  );
}
