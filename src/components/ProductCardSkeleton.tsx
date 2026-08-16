export default function ProductCardSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden bg-white animate-pulse">
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-5 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-6 bg-gray-200 rounded w-1/2 mt-3" />
      </div>
    </div>
  );
}