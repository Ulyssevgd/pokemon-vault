// Fetches current market prices for each card in data/cards.json from the
// free Pokémon TCG API and appends a data point to data/history.json.
// Run daily by a GitHub Action so the site always shows fresh values.

const fs = require("fs");
const path = require("path");

const CARDS_PATH = path.join(__dirname, "..", "data", "cards.json");
const HISTORY_PATH = path.join(__dirname, "..", "data", "history.json");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchCard(id, attempt = 1) {
  const res = await fetch(`https://api.pokemontcg.io/v2/cards/${id}`, {
    headers: process.env.POKEMONTCG_API_KEY
      ? { "X-Api-Key": process.env.POKEMONTCG_API_KEY }
      : {},
  });
  if (!res.ok) {
    if (attempt < 5) {
      await sleep(3000 * attempt);
      return fetchCard(id, attempt + 1);
    }
    throw new Error(`Failed to fetch ${id}: ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}

const USD_TO_EUR = 0.92; // rough fallback conversion when Cardmarket data isn't synced yet

function extractEurPrice(card) {
  const cm = card.cardmarket?.prices;
  if (cm) {
    const eur = cm.trendPrice ?? cm.averageSellPrice ?? cm.avg30 ?? null;
    if (eur != null) return eur;
  }
  // Brand-new sets often have TCGplayer (USD) data before Cardmarket (EUR)
  // catches up. Fall back to a converted USD price so charts don't go blank.
  const usd = extractUsdPrice(card);
  return usd != null ? Math.round(usd * USD_TO_EUR * 100) / 100 : null;
}

function extractUsdPrice(card) {
  const tp = card.tcgplayer?.prices;
  if (!tp) return null;
  const variant = Object.values(tp)[0];
  return variant?.market ?? null;
}

async function main() {
  const cards = JSON.parse(fs.readFileSync(CARDS_PATH, "utf8"));
  let history = {};
  if (fs.existsSync(HISTORY_PATH)) {
    history = JSON.parse(fs.readFileSync(HISTORY_PATH, "utf8"));
  }

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  for (const card of cards) {
    try {
      const data = await fetchCard(card.id);
      const eur = extractEurPrice(data);
      const usd = extractUsdPrice(data);

      if (!history[card.id]) history[card.id] = [];
      const series = history[card.id];

      const point = { date: today, eur, usd };
      const existingIdx = series.findIndex((p) => p.date === today);
      if (existingIdx >= 0) {
        series[existingIdx] = point;
      } else {
        series.push(point);
      }

      console.log(`${card.name} (${card.id}): €${eur} / $${usd}`);
    } catch (err) {
      console.error(`Error fetching ${card.id}:`, err.message);
    }
    // Be nice to the free API's rate limit.
    await sleep(1500);
  }

  fs.writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2));
  console.log("History updated:", HISTORY_PATH);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
