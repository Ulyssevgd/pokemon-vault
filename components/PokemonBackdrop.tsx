"use client";

import Image from "next/image";

// Bold, colorful character art scattered around the page — gives the
// site a real Pokémon feel instead of a generic dark background.
const POKEMON = [
  { id: 150, name: "Mewtwo", top: "-4%", left: "-10%", size: 560, rotate: -8 },
  { id: 382, name: "Kyogre", top: "2%", right: "-12%", size: 600, rotate: 6 },
  { id: 25, name: "Pikachu", bottom: "0%", left: "-2%", size: 420, rotate: -4 },
  { id: 208, name: "Steelix", bottom: "-6%", right: "-4%", size: 580, rotate: 10 },
  { id: 149, name: "Dragonite", top: "38%", left: "40%", size: 480, rotate: -3 },
];

function spriteUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export default function PokemonBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[#0b0c10]">
      {/* colour wash for mood */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(239,68,68,0.20),transparent_45%),radial-gradient(circle_at_85%_15%,rgba(59,130,246,0.18),transparent_45%),radial-gradient(circle_at_50%_100%,rgba(250,204,21,0.12),transparent_55%)]" />

      {POKEMON.map((p) => (
        <div
          key={p.id}
          className="absolute opacity-[0.34]"
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

      {/* light vignette only at the very top/center so header text stays crisp;
          bottom stays open so the art reads clearly */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(11,12,16,0.55)_0%,transparent_45%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0b0c10] via-[#0b0c10]/70 to-transparent" />
    </div>
  );
}
