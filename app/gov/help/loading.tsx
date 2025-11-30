export default function HelpLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 bg-[#0A2A43]/50 rounded w-48" />
      <div className="h-10 bg-[#0A2A43]/50 rounded w-64" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#0d3654]/50 border border-[#2DC5A0]/20 rounded-xl p-6 h-40" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#0d3654]/50 border border-[#2DC5A0]/20 rounded-xl p-4 h-16" />
          ))}
        </div>
        <div className="space-y-4">
          <div className="bg-[#0d3654]/50 border border-[#2DC5A0]/20 rounded-xl p-4 h-48" />
          <div className="bg-[#0d3654]/50 border border-[#2DC5A0]/20 rounded-xl p-4 h-40" />
        </div>
      </div>
    </div>
  )
}
