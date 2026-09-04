"use client";

import { useState } from "react";
import CardTile from "@/components/CardTile";
import CardModal from "@/components/CardModal";

type Card = {
  id: string;
  name: string;
  set: string;
  number: string;
  image: string;
};

type PricePoint = { date: string; eur: number | null; usd: number | null };

export default function CardGrid({
  cards,
  history,
}: {
  cards: Card[];
  history: Record<string, PricePoint[]>;
}) {
  const [selected, setSelected] = useState<Card | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => setSelected(card)}
            className="text-left"
          >
            <CardTile card={card} series={history[card.id] || []} />
          </button>
        ))}
      </div>

      {selected && (
        <CardModal card={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
