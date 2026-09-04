export default function PokeballPattern() {
  // A repeating tile of Poké Balls rendered as inline SVG data —
  // gives the page a real Pokémon feel without relying on any
  // external/copyrighted artwork.
  const tile = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">
      <g opacity="0.55">
        <circle cx="40" cy="40" r="26" fill="none" stroke="#ef4444" stroke-width="5"/>
        <path d="M14 40 A26 26 0 0 1 66 40" fill="#ef4444"/>
        <path d="M14 40 A26 26 0 0 0 66 40" fill="#f4f4f5"/>
        <rect x="14" y="37" width="52" height="6" fill="#111318"/>
        <circle cx="40" cy="40" r="7" fill="#111318"/>
        <circle cx="40" cy="40" r="3.5" fill="#f4f4f5"/>
      </g>
      <g opacity="0.35" transform="translate(100 95)">
        <circle cx="20" cy="20" r="14" fill="none" stroke="#60a5fa" stroke-width="3"/>
        <path d="M6 20 A14 14 0 0 1 34 20" fill="#60a5fa"/>
        <path d="M6 20 A14 14 0 0 0 34 20" fill="#f4f4f5"/>
        <rect x="6" y="18.5" width="28" height="3" fill="#111318"/>
        <circle cx="20" cy="20" r="3.5" fill="#111318"/>
      </g>
    </svg>
  `);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[#0b0c10]">
      {/* colour wash to give the dark base some Pokémon-red/blue mood */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(239,68,68,0.20),transparent_45%),radial-gradient(circle_at_85%_15%,rgba(59,130,246,0.16),transparent_45%),radial-gradient(circle_at_50%_100%,rgba(250,204,21,0.10),transparent_50%)]" />
      {/* tiled poké ball pattern */}
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage: `url("data:image/svg+xml,${tile}")`,
          backgroundSize: "160px 160px",
          backgroundRepeat: "repeat",
        }}
      />
      {/* fade to solid dark at the edges so content stays readable */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,transparent_0%,rgba(11,12,16,0.75)_70%,rgba(11,12,16,0.95)_100%)]" />
    </div>
  );
}
