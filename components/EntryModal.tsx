'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DiaryEntry } from '@/lib/types';
import { storage } from '@/lib/storage';
import { EntryForm } from './EntryForm';

interface EntryModalProps {
  isOpen: boolean;
  date: Date | null;
  onClose: () => void;
  onSaved?: () => void;
}

export function EntryModal({
  isOpen,
  date,
  onClose,
  onSaved,
}: EntryModalProps) {
  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && date) {
      const loadEntry = async () => {
        setLoading(true);
        const dateStr = date.toISOString().split('T')[0];
        const existing = await storage.getEntry(dateStr);
        setEntry(existing);
        setLoading(false);
      };
      loadEntry();
    } else {
      setEntry(null);
    }
  }, [isOpen, date]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const handleSave = async (entry: DiaryEntry) => {
    await storage.saveEntry(entry);
    onSaved?.();
  };

  if (!date) return null;

  const dateStr = date.toISOString().split('T')[0];
  const displayDate = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(date);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{displayDate}</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="py-8 text-center text-gray-500">読み込み中...</div>
        ) : (
          <EntryForm
            date={dateStr}
            initialEntry={entry}
            onSave={handleSave}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
