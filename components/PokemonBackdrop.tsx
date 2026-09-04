"use client";

import Image from "next/image";

// Faint, oversized character art scattered around the page — gives the
// site a real Pokémon feel instead of a generic dark background.
const POKEMON = [
  { id: 150, name: "Mewtwo", top: "-6%", left: "-8%", size: 480, rotate: -8 },
  { id: 382, name: "Kyogre", top: "4%", right: "-10%", size: 520, rotate: 6 },
  { id: 25, name: "Pikachu", bottom: "2%", left: "-4%", size: 360, rotate: -4 },
  { id: 208, name: "Steelix", bottom: "-8%", right: "-6%", size: 500, rotate: 10 },
  { id: 149, name: "Dragonite", top: "36%", left: "42%", size: 420, rotate: -3 },
];

function spriteUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export default function PokemonBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[#0b0c10]">
      {/* colour wash for mood */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(239,68,68,0.16),transparent_45%),radial-gradient(circle_at_85%_15%,rgba(59,130,246,0.14),transparent_45%),radial-gradient(circle_at_50%_100%,rgba(250,204,21,0.08),transparent_50%)]" />

      {POKEMON.map((p) => (
        <div
          key={p.id}
          className="absolute opacity-[0.14] grayscale"
          style={{
            top: p.top,
            left: p.left,
            right: p.right,
            bottom: p.bottom,
            width: p.size,
            height: p.size,
            transform: `rotate(${p.rotate}deg)`,
          }}
        >
          <Image
            src={spriteUrl(p.id)}
            alt=""
            fill
            sizes={`${p.size}px`}
            className="object-contain"
            unoptimized
          />
        </div>
      ))}

      {/* fade to solid dark at the edges so text/cards stay readable */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,transparent_0%,rgba(11,12,16,0.55)_55%,rgba(11,12,16,0.9)_100%)]" />
    </div>
  );
}
