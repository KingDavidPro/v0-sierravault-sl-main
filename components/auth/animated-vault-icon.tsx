"use client"

export function AnimatedVaultIcon() {
  return (
    <div className="relative w-20 h-20 mx-auto mb-6">
      {/* Outer rotating ring */}
      <div className="absolute inset-0 rounded-full border-2 border-[#2DC5A0] opacity-20 animate-spin-slow" />

      {/* Middle pulsing ring */}
      <div className="absolute inset-2 rounded-full border-2 border-[#2DC5A0] opacity-40 animate-pulse" />

      {/* Inner vault shield */}
      <div className="absolute inset-4 flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-[#2DC5A0]"
        >
          <path
            d="M12 2L4 6V11C4 16.55 7.84 21.74 12 23C16.16 21.74 20 16.55 20 11V6L12 2Z"
            fill="currentColor"
            fillOpacity="0.2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 12L11 14L15 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-draw"
          />
        </svg>
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-[#2DC5A0] opacity-10 blur-xl animate-pulse" />
    </div>
  )
}
