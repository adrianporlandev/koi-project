import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Rbl2tHtw.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_B6RRkINA.mjs';
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "P\xE1gina no encontrada - Twitch Stats" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-16 text-center"> <h1 class="text-6xl font-bold text-purple-900 mb-4">404</h1> <h2 class="text-2xl font-semibold text-gray-700 mb-8">Página no encontrada</h2> <p class="text-gray-600 mb-8">Lo sentimos, la página que estás buscando no existe o ha sido movida.</p> <a href="/" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
Volver al inicio
</a> </div> ` })}`;
}, "C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/src/pages/404.astro", void 0);

const $$file = "C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
