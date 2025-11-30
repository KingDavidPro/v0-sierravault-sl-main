import { cn } from "@/lib/utils"

interface GovSkeletonTableProps {
  rows?: number
  columns?: number
  className?: string
}

export function GovSkeletonTable({ rows = 5, columns = 5, className }: GovSkeletonTableProps) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-white/10", className)}>
      <table className="w-full">
        <thead>
          <tr className="bg-white/5">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-4 py-3">
                <div className="h-4 bg-white/10 rounded animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-t border-white/10">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <div
                    className="h-4 bg-white/5 rounded animate-pulse"
                    style={{
                      width: `${60 + Math.random() * 40}%`,
                      animationDelay: `${(rowIndex * columns + colIndex) * 50}ms`,
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
