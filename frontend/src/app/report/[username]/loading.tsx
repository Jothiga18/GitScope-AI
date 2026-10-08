import StageList from '@/components/analysis/StageList';

export default function Loading() {
  return <div className="wrap" role="status" aria-live="polite"><StageList mode="progress" /></div>;
}
