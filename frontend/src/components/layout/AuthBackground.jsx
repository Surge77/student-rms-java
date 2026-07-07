/** The registrar's desk: aged paper, a faint watermark seal, ink vignette.
    Wraps the auth "enrollment certificate" cards. */
export function AuthBackground({ children }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* Oversized watermark seal, embossed faintly into the paper */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="h-[70vmin] w-[70vmin] text-foreground opacity-[0.035]"
          fill="none"
        >
          <circle cx="50" cy="50" r="47" stroke="currentColor" strokeWidth="0.6" />
          <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="0.4" />
          <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Ink vignette to anchor the certificate */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 50%, hsl(30 24% 16% / 0.28) 100%)',
        }}
      />

      {/* Grain */}
      <div
        aria-hidden
        className="paper-grain pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-multiply"
      />

      <div className="relative z-10 w-full">{children}</div>
    </div>
  )
}
