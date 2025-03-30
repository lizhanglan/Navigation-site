import { getWebsites, getCategories } from './actions';
import { AdminPageClient } from '@/components/admin/admin-page-client';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const websites = await getWebsites();
  const categories = await getCategories();

  return (
    <div>
      <AdminPageClient initialWebsites={websites} initialCategories={categories} />
    </div>
  );
}