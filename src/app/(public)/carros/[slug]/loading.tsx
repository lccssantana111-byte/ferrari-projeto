export default function CarDetailLoading() {
  return (
    <div className="min-h-screen pt-16 bg-carbon">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 animate-pulse">
          <div className="lg:col-span-3 space-y-3">
            <div className="aspect-[16/9] rounded-2xl bg-graphite" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-20 h-14 rounded-lg bg-graphite" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="h-4 w-24 bg-graphite rounded mb-3" />
              <div className="h-10 w-64 bg-graphite rounded mb-2" />
              <div className="h-6 w-32 bg-graphite rounded" />
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-graphite rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
