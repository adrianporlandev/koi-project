import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../chunks/astro/server_Rbl2tHtw.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_B6RRkINA.mjs';
import { G as GamesAPI } from '../chunks/api_CPIoDhh6.mjs';
export { renderers } from '../renderers.mjs';

const $$Games = createComponent(async ($$result, $$props, $$slots) => {
  let topGames = [];
  let error = null;
  try {
    console.log("Intentando obtener juegos populares...");
    topGames = await GamesAPI.getTop(20);
    console.log("Juegos obtenidos:", topGames);
    if (topGames.length === 1 && topGames[0].game === "Sin datos") {
      error = "No se pudieron cargar los datos reales de juegos.";
    }
  } catch (err) {
    console.error("Error al cargar juegos:", err);
    error = `Error al cargar juegos: ${err.message}`;
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Juegos - Twitch Stats" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-12"> <h1 class="text-3xl font-bold text-gray-800 mb-8">Juegos Populares</h1> ${error && renderTemplate`<div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-8" role="alert"> <strong class="font-bold">Atención:</strong> <span class="block sm:inline"> ${error}</span> <p class="mt-2">
Verifica la conexión con la API y asegúrate de que el servidor esté funcionando correctamente.
<a href="/diagnostico" class="underline font-medium">Ir a la página de diagnóstico</a> </p> </div>`} ${topGames.length === 0 ? renderTemplate`<div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert"> <strong class="font-bold">Atención:</strong> <span class="block sm:inline"> No se encontraron juegos. Verifica que la API esté en funcionamiento.</span> </div>` : renderTemplate`<div class="bg-white rounded-lg shadow-md overflow-hidden"> <table class="min-w-full divide-y divide-gray-200"> <thead class="bg-gray-50"> <tr> <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
Juego
</th> <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
Total de Viewers
</th> <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
Streamers
</th> </tr> </thead> <tbody class="bg-white divide-y divide-gray-200"> ${topGames.map((game) => renderTemplate`<tr class="hover:bg-gray-50"> <td class="px-6 py-4 whitespace-nowrap"> <a${addAttribute(`/games/${encodeURIComponent(game.game)}`, "href")} class="text-purple-600 hover:text-purple-900 font-medium"> ${game.game} </a> </td> <td class="px-6 py-4 whitespace-nowrap text-gray-700"> ${game.total_viewers.toLocaleString()} </td> <td class="px-6 py-4 whitespace-nowrap text-gray-700"> ${game.streamer_count} </td> </tr>`)} </tbody> </table> </div>`} </div> ` })}`;
}, "C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/src/pages/games.astro", void 0);

const $$file = "C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/src/pages/games.astro";
const $$url = "/games";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Games,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
