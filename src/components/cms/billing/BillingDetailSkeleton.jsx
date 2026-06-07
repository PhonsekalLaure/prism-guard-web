import { SkeletonBlock } from '@components/ui/Skeleton';

export default function BillingDetailSkeleton() {
  return (
    <div className="cms-bdetail-body">
      <SkeletonBlock height={86} width="100%" radius={8} />
      <div className="cms-bdetail-stats">
        {[0, 1, 2, 3].map((item) => (
          <SkeletonBlock key={item} height={64} width="100%" radius={0} />
        ))}
      </div>
      <SkeletonBlock height={108} width="100%" radius={8} />
    </div>
  );
}
