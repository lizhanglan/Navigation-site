import Fallback from '@/components/loading/fallback';

export default function Loading() {
  return (
    <div className="min-h-screen">
      <Fallback className="min-h-[50vh]" message="加载中..." />
    </div>
  );
}
