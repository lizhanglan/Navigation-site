import { getSettings } from '../actions';
import { SettingsPageClient } from '@/components/admin/settings-page-client';

export default async function SettingsPage() {
  const initialSettings = await getSettings();
  return <SettingsPageClient initialSettings={initialSettings} />;
}