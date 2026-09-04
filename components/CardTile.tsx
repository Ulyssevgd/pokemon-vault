"use client";

import Image from "next/image";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

type Card = {
  id: string;
  name: string;
  set: string;
  number: string;
  image: string;
};

type PricePoint = { date: string; eur: number | null; usd: number | null };

export default function CardTile({
  card,
  series,
}: {
  card: Card;
  series: PricePoint[];
}) {
  const clean = series.filter((p) => p.eur != null);
  const latest = clean[clean.length - 1];
  const first = clean[0];
  const change =
    latest && first && first.eur
      ? ((latest.eur! - first.eur) / first.eur) * 100
      : null;
  const isUp = (change ?? 0) >= 0;

  return (
    <div className="group rounded-2xl border border-white/10 bg-[#111318]/90 p-5 shadow-lg shadow-black/30 backdrop-blur-sm transition hover:border-white/20 hover:bg-[#14161c]/95">
      <div className="flex items-center gap-4">
        <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-md bg-black/40 ring-1 ring-white/10">
          <Image
            src={card.image}
            alt={card.name}
            fill
            sizes="80px"
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-base font-semibold">{card.name}</div>
          <div className="truncate text-xs text-white/40">
            {card.set} · #{card.number}
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-semibold">
              {latest?.eur != null ? `€${latest.eur.toFixed(2)}` : "—"}
            </span>
            {change != null && (
              <span
                className={`text-xs font-medium ${
                  isUp ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {isUp ? "+" : ""}
                {change.toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 h-24 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={clean} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${card.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={isUp ? "#34d399" : "#f87171"}
                  stopOpacity={0.35}
                />
                <stop
                  offset="100%"
                  stopColor={isUp ? "#34d399" : "#f87171"}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <YAxis domain={["auto", "auto"]} hide />
            <Tooltip
              contentStyle={{
                background: "#111318",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "rgba(255,255,255,0.5)" }}
              formatter={(value) => [`€${Number(value).toFixed(2)}`, "Value"]}
            />
            <Area
              type="monotone"
              dataKey="eur"
              stroke={isUp ? "#34d399" : "#f87171"}
              strokeWidth={2}
              fill={`url(#grad-${card.id})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {first && latest && (
        <div className="mt-1 flex justify-between text-[10px] text-white/25">
          <span>{first.date.slice(0, 7)}</span>
          <span>{latest.date}</span>
        </div>
      )}
    </div>
  );
}
