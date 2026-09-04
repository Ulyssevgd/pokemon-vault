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
    <div className="min-h-screen bg-[#0b0c10] text-white px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              My Vault
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
