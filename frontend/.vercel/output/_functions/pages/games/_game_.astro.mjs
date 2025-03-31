import { c as createComponent, b as createAstro, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Rbl2tHtw.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_B6RRkINA.mjs';
import { G as GamesAPI } from '../../chunks/api_DtQ2kKCQ.mjs';
import { S as StreamerCard } from '../../chunks/StreamerCard_C5mNpBAQ.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$game = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$game;
  const { game } = Astro2.params;
  const decodedGame = decodeURIComponent(game);
  let streamers = [];
  let error = null;
  try {
    const gameData = await GamesAPI.getByName(decodedGame);
    if (gameData && gameData.length > 0) {
      const streamerMap = {};
      gameData.forEach((item) => {
        if (!streamerMap[item.streamer_name] || new Date(streamerMap[item.streamer_name].snapshot_at) < new Date(item.snapshot_at)) {
          streamerMap[item.streamer_name] = item;
        }
      });
      streamers = Object.values(streamerMap);
      streamers.sort((a, b) => b.viewers_count - a.viewers_count);
    } else {
      error = `No se encontraron streamers para el juego "${decodedGame}"`;
    }
  } catch (err) {
    console.error(`Error al obtener datos para el juego ${decodedGame}:`, err);
    error = `Error al cargar datos para el juego "${decodedGame}"`;
    streamers = Array(4).fill().map((_, i) => ({
      streamer_name: `Streamer ${i + 1}`,
      viewers_count: 0,
      game: decodedGame,
      title: "Sin datos disponibles"
    }));
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${decodedGame} - Juegos de Twitch` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="bg-gradient-to-r from-purple-900 to-purple-700 text-white py-12"> <div class="container mx-auto px-4"> <h1 class="text-3xl md:text-4xl font-bold">${decodedGame}</h1> <p class="mt-2 text-purple-200">Streamers jugando a este juego</p> </div> </div> <div class="container mx-auto px-4 py-12"> <h2 class="text-2xl font-bold text-gray-800 mb-8">Streamers Populares de ${decodedGame}</h2> ${error && renderTemplate`<div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-8" role="alert"> <strong class="font-bold">Atención:</strong> <span class="block sm:inline"> ${error}</span> </div>`} <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> ${streamers.map((streamer) => renderTemplate`${renderComponent($$result2, "StreamerCard", StreamerCard, { "streamer": streamer })}`)} </div> </div> ` })}`;
}, "C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/src/pages/games/[game].astro", void 0);

const $$file = "C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/src/pages/games/[game].astro";
const $$url = "/games/[game]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$game,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
