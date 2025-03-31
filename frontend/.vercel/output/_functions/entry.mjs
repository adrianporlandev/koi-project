import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_DnndTaCy.mjs';
import { manifest } from './manifest_DfxDtYA2.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/diagnostico.astro.mjs');
const _page3 = () => import('./pages/games/_game_.astro.mjs');
const _page4 = () => import('./pages/games.astro.mjs');
const _page5 = () => import('./pages/streamer/_name_.astro.mjs');
const _page6 = () => import('./pages/streamers.astro.mjs');
const _page7 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/diagnostico.astro", _page2],
    ["src/pages/games/[game].astro", _page3],
    ["src/pages/games.astro", _page4],
    ["src/pages/streamer/[name].astro", _page5],
    ["src/pages/streamers.astro", _page6],
    ["src/pages/index.astro", _page7]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "d3921e52-bd6b-4c72-848d-25b8752a8df9",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
