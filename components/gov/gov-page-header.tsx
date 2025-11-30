import type { ReactNode } from "react"
import { GovBreadcrumbs } from "./gov-breadcrumbs"

interface GovPageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export function GovPageHeader({ title, description, actions }: GovPageHeaderProps) {
  return (
    <div className="mb-6 md:mb-8">
      <GovBreadcrumbs />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
          {description && <p className="text-white/60 mt-1">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
      </div>
    </div>
  )
}
