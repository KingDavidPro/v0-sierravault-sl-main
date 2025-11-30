export default function AuditLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 bg-[#0A2A43]/50 rounded w-48" />
      <div className="h-10 bg-[#0A2A43]/50 rounded w-64" />

      <div className="bg-[#0d3654]/50 border border-[#2DC5A0]/20 rounded-xl p-4">
        <div className="flex gap-4">
          <div className="flex-1 h-10 bg-[#0A2A43]/50 rounded-lg" />
          <div className="w-32 h-10 bg-[#0A2A43]/50 rounded-lg" />
        </div>
      </div>

      <div className="bg-[#0d3654]/50 border border-[#2DC5A0]/20 rounded-xl divide-y divide-[#2DC5A0]/10">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <div className="w-10 h-10 bg-[#0A2A43]/50 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-[#0A2A43]/50 rounded w-1/3" />
              <div className="h-3 bg-[#0A2A43]/50 rounded w-2/3" />
            </div>
            <div className="h-4 bg-[#0A2A43]/50 rounded w-24" />
          </div>
        ))}
      </div>
    </div>
  )
}
