export function AuthBackground({ children }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      {/* Aurora — amber-toned drifting blobs, deliberately subtle */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-[20%] top-[15%] h-[34rem] w-[34rem] rounded-full opacity-[0.14] blur-[120px] animate-aurora"
          style={{ background: 'radial-gradient(circle, hsl(38 70% 52%) 0%, transparent 70%)' }}
        />
        <div
          className="absolute right-[12%] bottom-[10%] h-[28rem] w-[28rem] rounded-full opacity-[0.09] blur-[120px] animate-aurora-rev"
          style={{ background: 'radial-gradient(circle, hsl(28 60% 42%) 0%, transparent 70%)' }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.05] blur-[100px]"
          style={{ background: 'radial-gradient(circle, hsl(42 65% 55%) 0%, transparent 70%)' }}
        />
      </div>

      {/* Grain overlay */}
      <div
        aria-hidden
        className="grain pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-soft-light"
      />

      {/* Hairline vignette to anchor the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 55%, hsl(30 8% 5% / 0.5) 100%)' }}
      />

      <div className="relative z-10 w-full">{children}</div>
    </div>
  )
}
