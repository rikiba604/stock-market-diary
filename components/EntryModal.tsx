'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DiaryEntry } from '@/lib/types';
import { getEntry, saveEntry } from '@/lib/storage';
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

  const handleOpenChange = (open: boolean) => {
    if (open && date) {
      const dateStr = date.toISOString().split('T')[0];
      const existing = getEntry(dateStr);
      setEntry(existing);
    } else {
      setEntry(null);
    }
    if (!open) {
      onClose();
    }
  };

  const handleSave = (entry: DiaryEntry) => {
    saveEntry(entry);
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
        <EntryForm
          date={dateStr}
          initialEntry={entry}
          onSave={handleSave}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
