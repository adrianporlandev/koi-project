import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Rbl2tHtw.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_B6RRkINA.mjs';
import { S as StreamersAPI } from '../chunks/api_DtQ2kKCQ.mjs';
import { S as StreamerCard } from '../chunks/StreamerCard_C5mNpBAQ.mjs';
export { renderers } from '../renderers.mjs';

const $$Streamers = createComponent(async ($$result, $$props, $$slots) => {
  let topStreamers = [];
  let error = null;
  try {
    console.log("Intentando obtener streamers populares...");
    topStreamers = await StreamersAPI.getTop(24);
    console.log("Streamers obtenidos:", topStreamers);
    if (topStreamers.length === 1 && topStreamers[0].streamer_name === "Ejemplo") {
      error = "No se pudieron cargar los datos reales de streamers.";
    }
  } catch (err) {
    console.error("Error al cargar streamers:", err);
    error = `Error al cargar streamers: ${err.message}`;
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Streamers - tw Stats" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-12"> <h1 class="text-3xl font-bold text-gray-800 mb-8">Streamers Populares</h1> ${error && renderTemplate`<div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-8" role="alert"> <strong class="font-bold">Atención:</strong> <span class="block sm:inline"> ${error}</span> <p class="mt-2">
Verifica la conexión con la API y asegúrate de que el servidor esté funcionando correctamente.
<a href="/diagnostico" class="underline font-medium">Ir a la página de diagnóstico</a> </p> </div>`} ${topStreamers.length === 0 ? renderTemplate`<div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert"> <strong class="font-bold">Atención:</strong> <span class="block sm:inline"> No se encontraron streamers. Verifica que la API esté en funcionamiento.</span> </div>` : renderTemplate`<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> ${topStreamers.map((streamer) => renderTemplate`${renderComponent($$result2, "StreamerCard", StreamerCard, { "streamer": streamer })}`)} </div>`} </div> ` })}`;
}, "C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/src/pages/streamers.astro", void 0);

const $$file = "C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/src/pages/streamers.astro";
const $$url = "/streamers";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Streamers,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
