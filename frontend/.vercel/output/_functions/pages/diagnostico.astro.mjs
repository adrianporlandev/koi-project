import { c as createComponent, b as createAstro, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Rbl2tHtw.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_B6RRkINA.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { t as testAPIConnection } from '../chunks/api_DtQ2kKCQ.mjs';
export { renderers } from '../renderers.mjs';

function APIConnectionTest() {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState("");
  useEffect(() => {
    const url = "http://localhost:3000/api";
    setApiUrl(url);
  }, []);
  const runTest = async () => {
    setLoading(true);
    try {
      const result = await testAPIConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: "Error al ejecutar la prueba",
        details: error.toString()
      });
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-md p-6 my-8", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-4", children: "Diagnóstico de Conexión API" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-gray-700 mb-2", children: "URL de la API configurada:" }),
      /* @__PURE__ */ jsx("code", { className: "bg-gray-100 px-2 py-1 rounded text-purple-700", children: apiUrl })
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: runTest,
        disabled: loading,
        className: "bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50",
        children: loading ? "Probando conexión..." : "Probar conexión con la API"
      }
    ),
    testResult && /* @__PURE__ */ jsxs("div", { className: `mt-6 p-4 rounded ${testResult.success ? "bg-green-100" : "bg-red-100"}`, children: [
      /* @__PURE__ */ jsx("h3", { className: `font-bold ${testResult.success ? "text-green-800" : "text-red-800"}`, children: testResult.success ? "✅ Conexión exitosa" : "❌ Error de conexión" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2", children: testResult.message }),
      testResult.details && /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Detalles:" }),
        /* @__PURE__ */ jsx("pre", { className: "bg-gray-800 text-white p-3 rounded mt-2 overflow-x-auto text-sm", children: typeof testResult.details === "object" ? JSON.stringify(testResult.details, null, 2) : testResult.details })
      ] }),
      testResult.data && /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Datos recibidos:" }),
        /* @__PURE__ */ jsx("pre", { className: "bg-gray-800 text-white p-3 rounded mt-2 overflow-x-auto text-sm", children: JSON.stringify(testResult.data, null, 2) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 border-t pt-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-bold text-gray-800 mb-2", children: "Soluciones comunes:" }),
      /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 space-y-2 text-gray-700", children: [
        /* @__PURE__ */ jsx("li", { children: "Verifica que la API esté ejecutándose en la URL correcta" }),
        /* @__PURE__ */ jsx("li", { children: "Asegúrate de que no haya problemas de CORS en el backend" }),
        /* @__PURE__ */ jsx("li", { children: "Comprueba que los endpoints de la API coincidan con los que espera el frontend" }),
        /* @__PURE__ */ jsx("li", { children: "Verifica que no haya firewalls o proxies bloqueando las conexiones" }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Nombre de tabla correcto:" }),
          ' La API está configurada para usar la tabla "stats"'
        ] })
      ] })
    ] })
  ] });
}

const $$Astro = createAstro();
const $$Diagnostico = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Diagnostico;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Diagn\xF3stico de Conexi\xF3n - Twitch Stats" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-12"> <h1 class="text-3xl font-bold text-gray-800 mb-8">Diagnóstico de Conexión</h1> <p class="text-gray-700 mb-8">
Esta página te ayudará a diagnosticar problemas de conexión entre el frontend y la API.
</p> ${renderComponent($$result2, "APIConnectionTest", APIConnectionTest, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/src/components/APIConnectionTest.jsx", "client:component-export": "default" })} <div class="bg-white rounded-lg shadow-md p-6 mt-8"> <h2 class="text-2xl font-bold text-gray-800 mb-4">Configuración del Entorno</h2> <div class="mb-4"> <h3 class="font-bold text-gray-800 mb-2">1. Verifica tu archivo .env</h3> <p class="text-gray-700">
Asegúrate de tener un archivo <code class="bg-gray-100 px-1 rounded">.env</code> en la raíz de tu proyecto frontend con la siguiente variable:
</p> <pre class="bg-gray-100 p-3 rounded mt-2 text-sm">PUBLIC_API_URL=http://localhost:3000/api</pre> <p class="text-gray-700 mt-2">
Ajusta la URL según donde esté alojada tu API.
</p> </div> <div class="mb-4"> <h3 class="font-bold text-gray-800 mb-2">2. Configuración CORS en el Backend</h3> <p class="text-gray-700">
Asegúrate de que tu API tenga configurado CORS correctamente para permitir solicitudes desde tu frontend:
</p> <pre class="bg-gray-100 p-3 rounded mt-2 text-sm"></pre> </div> <div> <h3 class="font-bold text-gray-800 mb-2">3. Reinicia ambos servidores</h3> <p class="text-gray-700">
Después de hacer cambios, reinicia tanto el servidor de la API como el servidor de desarrollo de Astro.
</p> </div> </div> </div> ` })}`;
}, "C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/src/pages/diagnostico.astro", void 0);

const $$file = "C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/src/pages/diagnostico.astro";
const $$url = "/diagnostico";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Diagnostico,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
