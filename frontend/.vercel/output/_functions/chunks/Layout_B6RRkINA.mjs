import { c as createComponent, b as createAstro, d as addAttribute, e as renderScript, a as renderTemplate, r as renderComponent, f as renderHead, g as renderSlot } from './astro/server_Rbl2tHtw.mjs';
import 'kleur/colors';
/* empty css                               */
import 'clsx';

const $$Astro$1 = createAstro();
const $$ClientRouter = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ClientRouter;
  const { fallback = "animate" } = Astro2.props;
  return renderTemplate`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${addAttribute(fallback, "content")}>${renderScript($$result, "C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/node_modules/astro/components/ClientRouter.astro", void 0);

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderComponent($$result, "ViewTransitions", $$ClientRouter, {})}${renderHead()}</head> <body class="bg-gray-50 min-h-screen"> <header class="bg-purple-900 text-white shadow-md"> <div class="container mx-auto px-4 py-4 flex justify-between items-center"> <a href="/" class="text-2xl font-bold flex items-center"> <img src="../../public/koi-logo.webp" alt="KOI Stats Logo" class="h-8 mr-2">
KOI Stats
</a> <nav> <ul class="flex space-x-6"> <li><a href="/" class="hover:text-purple-300 transition-colors">Inicio</a></li> <li><a href="/streamers" class="hover:text-purple-300 transition-colors">Streamers</a></li> <li><a href="/games" class="hover:text-purple-300 transition-colors">Juegos</a></li> </ul> </nav> </div> </header> <main> ${renderSlot($$result, $$slots["default"])} </main> <footer class="bg-gray-800 text-white py-8 mt-12"> <div class="container mx-auto px-4"> <div class="flex flex-col md:flex-row justify-between"> <div class="mb-6 md:mb-0"> <h3 class="text-xl font-bold mb-2">KOI Stats</h3> <p class="text-gray-400">Estadísticas y análisis de streamers de KOI</p> </div> <div> <h4 class="text-lg font-semibold mb-2">Enlaces</h4> <ul class="space-y-1"> <li><a href="/" class="text-gray-400 hover:text-white transition-colors">Inicio</a></li> <li><a href="/streamers" class="text-gray-400 hover:text-white transition-colors">Streamers</a></li> <li><a href="/games" class="text-gray-400 hover:text-white transition-colors">Juegos</a></li> <li><a href="/diagnostico" class="text-gray-400 hover:text-white transition-colors">Diagnóstico</a></li> </ul> </div> </div> <div class="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500"> <p>&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} KOI Stats. Todos los derechos reservados.</p> </div> </div> </footer> </body></html>`;
}, "C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
