import cardsData from "@/data/cards.json";
import historyData from "@/data/history.json";
import CardTile from "@/components/CardTile";

type Card = {
  id: string;
  name: string;
  set: string;
  number: string;
  image: string;
};

type PricePoint = { date: string; eur: number | null; usd: number | null };

export default function Home() {
  const cards = cardsData as Card[];
  const history = historyData as Record<string, PricePoint[]>;

  const totalValue = cards.reduce((sum, card) => {
    const series = history[card.id] || [];
    const latest = series[series.length - 1];
    return sum + (latest?.eur ?? 0);
  }, 0);

  const lastUpdated = cards
    .map((c) => history[c.id]?.[history[c.id].length - 1]?.date)
    .filter(Boolean)
    .sort()
    .pop();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0c10] px-6 py-12 text-white sm:px-10">
      {/* Pokéball-inspired backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(239,68,68,0.16),transparent_55%)]" />
        <div className="absolute left-1/2 top-1/2 h-[1400px] w-[1400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]" />
        <div className="absolute left-1/2 top-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/[0.08]" />
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
        <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/10 bg-[#0b0c10]" />
        <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.06]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <header className="mb-12 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Poké<span className="text-red-400">Deck</span>
            </h1>
            <p className="mt-1 text-sm text-white/50">
              Live Cardmarket values · updates daily
            </p>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-sm text-white/50">Total collection value</div>
            <div className="text-2xl font-semibold text-emerald-400">
              €{totalValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            </div>
            {lastUpdated && (
              <div className="mt-0.5 text-xs text-white/30">
                Last updated {lastUpdated}
              </div>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <CardTile
              key={card.id}
              card={card}
              series={history[card.id] || []}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
