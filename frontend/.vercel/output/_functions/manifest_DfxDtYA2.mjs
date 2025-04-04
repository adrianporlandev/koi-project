import 'kleur/colors';
import { h as decodeKey } from './chunks/astro/server_Rbl2tHtw.mjs';
import 'clsx';
import 'cookie';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_Pa7JS0Dk.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/","cacheDir":"file:///C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/node_modules/.astro/","outDir":"file:///C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/dist/","srcDir":"file:///C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/src/","publicDir":"file:///C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/public/","buildClientDir":"file:///C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/dist/client/","buildServerDir":"file:///C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/diagnostico.BqR0Rk9T.css"}],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/diagnostico.BqR0Rk9T.css"}],"routeData":{"route":"/diagnostico","isIndex":false,"type":"page","pattern":"^\\/diagnostico\\/?$","segments":[[{"content":"diagnostico","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/diagnostico.astro","pathname":"/diagnostico","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/diagnostico.BqR0Rk9T.css"}],"routeData":{"route":"/games/[game]","isIndex":false,"type":"page","pattern":"^\\/games\\/([^/]+?)\\/?$","segments":[[{"content":"games","dynamic":false,"spread":false}],[{"content":"game","dynamic":true,"spread":false}]],"params":["game"],"component":"src/pages/games/[game].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/diagnostico.BqR0Rk9T.css"}],"routeData":{"route":"/games","isIndex":false,"type":"page","pattern":"^\\/games\\/?$","segments":[[{"content":"games","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/games.astro","pathname":"/games","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/diagnostico.BqR0Rk9T.css"}],"routeData":{"route":"/streamer/[name]","isIndex":false,"type":"page","pattern":"^\\/streamer\\/([^/]+?)\\/?$","segments":[[{"content":"streamer","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"params":["name"],"component":"src/pages/streamer/[name].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/diagnostico.BqR0Rk9T.css"}],"routeData":{"route":"/streamers","isIndex":false,"type":"page","pattern":"^\\/streamers\\/?$","segments":[[{"content":"streamers","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/streamers.astro","pathname":"/streamers","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/diagnostico.BqR0Rk9T.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/src/pages/404.astro",{"propagation":"none","containsHead":true}],["C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/src/pages/diagnostico.astro",{"propagation":"none","containsHead":true}],["C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/src/pages/games.astro",{"propagation":"none","containsHead":true}],["C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/src/pages/games/[game].astro",{"propagation":"none","containsHead":true}],["C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/src/pages/streamer/[name].astro",{"propagation":"none","containsHead":true}],["C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/src/pages/streamers.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-page:src/pages/404@_@astro":"pages/404.astro.mjs","\u0000@astro-page:src/pages/games/[game]@_@astro":"pages/games/_game_.astro.mjs","\u0000@astro-page:src/pages/games@_@astro":"pages/games.astro.mjs","\u0000@astro-page:src/pages/streamers@_@astro":"pages/streamers.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-page:src/pages/diagnostico@_@astro":"pages/diagnostico.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:src/pages/streamer/[name]@_@astro":"pages/streamer/_name_.astro.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_DLYH--I4.mjs","\u0000@astrojs-manifest":"manifest_DfxDtYA2.mjs","C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/src/components/APIConnectionTest.jsx":"_astro/APIConnectionTest.BraleRBs.js","C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/src/components/StreamerStats.jsx":"_astro/StreamerStats.sB3zITau.js","C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/src/components/StreamerTable.jsx":"_astro/StreamerTable.oHQmXp9_.js","@astrojs/react/client.js":"_astro/client.BMIDVuEk.js","C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts":"_astro/ClientRouter.astro_astro_type_script_index_0_lang.CMTcOisY.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/diagnostico.BqR0Rk9T.css","/favicon.svg","/koi-logo.webp","/_astro/api.R820zOtF.js","/_astro/APIConnectionTest.BraleRBs.js","/_astro/client.BMIDVuEk.js","/_astro/ClientRouter.astro_astro_type_script_index_0_lang.CMTcOisY.js","/_astro/index.BJfUAbRs.js","/_astro/StreamerStats.sB3zITau.js","/_astro/StreamerTable.oHQmXp9_.js","/_astro/TimeRangeSelector.Ctx6NCK6.js"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"6AjqwIJEXulcVEFniji3p0L3vdUSu+OqCK5BL88DRDM="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
