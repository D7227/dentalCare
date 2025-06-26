import { useState, useEffect } from 'react';

interface UseAutoSaveProps {
  data: any;
  onSave: (data: any) => Promise<void>;
  enabled?: boolean;
  delay?: number;
}

export const useAutoSave = ({ data, onSave, enabled = true, delay = 3000 }: UseAutoSaveProps) => {
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const timer = setTimeout(async () => {
      setIsSaving(true);
      try {
        await onSave(data);
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setIsSaving(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [data, onSave, enabled, delay]);

  return { isSaving };
};