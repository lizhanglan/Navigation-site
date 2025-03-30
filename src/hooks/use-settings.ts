import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

export interface Settings {
  allowSubmissions: boolean;
  requireApproval: boolean;
  itemsPerPage: number;
  siteIcp: string;
  siteFooter: string;
}

interface SettingItem {
  key: string;
  value: string;
}

interface SettingsResponse {
  success: boolean;
  data: SettingItem[];
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (!response.ok) throw new Error('Failed to load settings');
        const { success, data } = await response.json();
        if (!success) throw new Error('Failed to load settings');

        // Convert string values to proper types
        const settingsObject = {
          ...data,
          allowSubmissions: data.allowSubmissions === 'true',
          requireApproval: data.requireApproval === 'true',
          itemsPerPage: Number(data.itemsPerPage) || 12
        };

        setSettings(settingsObject);
      } catch (error) {
        toast({
          title: '加载设置失败', 
          description: '使用默认设置继续',
          variant: 'destructive',
        });
        setSettings({
          allowSubmissions: true,
          requireApproval: true,
          itemsPerPage: 12,
          siteIcp: '',
          siteFooter: '',
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [toast]);

  return { settings, loading };
}