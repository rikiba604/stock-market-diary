'use client';

import { useState, useEffect } from 'react';
import { DiaryEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface EntryFormProps {
  date: string;
  initialEntry: DiaryEntry | null;
  onSave: (entry: DiaryEntry) => Promise<void>;
  onClose: () => void;
}

export function EntryForm({
  date,
  initialEntry,
  onSave,
  onClose,
}: EntryFormProps) {
  const [marketNews, setMarketNews] = useState('');
  const [marketTopics, setMarketTopics] = useState('');
  const [investmentMemo, setInvestmentMemo] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialEntry) {
      setMarketNews(initialEntry.marketNews || '');
      setMarketTopics(initialEntry.marketTopics || '');
      setInvestmentMemo(initialEntry.investmentMemo || '');
    } else {
      setMarketNews('');
      setMarketTopics('');
      setInvestmentMemo('');
    }
  }, [initialEntry]);

  const handleSave = async () => {
    setSaving(true);
    const entry: DiaryEntry = {
      date,
      marketNews,
      marketTopics,
      investmentMemo,
      updatedAt: new Date().toISOString(),
    };
    await onSave(entry);
    setSaving(false);
    onClose();
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="market-news">市況ニュース</Label>
        <Textarea
          id="market-news"
          placeholder="今日の市場ニュースを入力..."
          value={marketNews}
          onChange={(e) => setMarketNews(e.target.value)}
          className="mt-2 h-24"
        />
      </div>

      <div>
        <Label htmlFor="market-topics">市況トピック</Label>
        <Textarea
          id="market-topics"
          placeholder="重要な市況トピックを入力..."
          value={marketTopics}
          onChange={(e) => setMarketTopics(e.target.value)}
          className="mt-2 h-24"
        />
      </div>

      <div>
        <Label htmlFor="investment-memo">投資メモ</Label>
        <Textarea
          id="investment-memo"
          placeholder="あなたの投資メモを入力..."
          value={investmentMemo}
          onChange={(e) => setInvestmentMemo(e.target.value)}
          className="mt-2 h-24"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={saving}>
          キャンセル
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? '保存中...' : '保存'}
        </Button>
      </div>
    </div>
  );
}
