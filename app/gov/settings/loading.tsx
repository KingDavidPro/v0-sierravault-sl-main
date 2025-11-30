export default function SettingsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 bg-[#0A2A43]/50 rounded w-48" />
      <div className="h-10 bg-[#0A2A43]/50 rounded w-64" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#0d3654]/50 border border-[#2DC5A0]/20 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0A2A43]/50 rounded-lg" />
              <div className="space-y-2">
                <div className="h-4 bg-[#0A2A43]/50 rounded w-32" />
                <div className="h-3 bg-[#0A2A43]/50 rounded w-48" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-12 bg-[#0A2A43]/50 rounded-lg" />
              <div className="h-12 bg-[#0A2A43]/50 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
