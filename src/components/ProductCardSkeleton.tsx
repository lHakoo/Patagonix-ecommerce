export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-pine-800/10">
      <div className="aspect-square shimmer" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-2/3 rounded shimmer" />
        <div className="h-3 w-full rounded shimmer" />
        <div className="h-5 w-1/2 rounded shimmer mt-2" />
      </div>
    </div>
  );
}