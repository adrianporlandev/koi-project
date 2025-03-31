import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Rbl2tHtw.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_B6RRkINA.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { S as StreamersAPI } from '../chunks/api_DtQ2kKCQ.mjs';
import { T as TimeRangeSelector } from '../chunks/TimeRangeSelector_DkftwEK_.mjs';
export { renderers } from '../renderers.mjs';

function StreamerTable({ limit = 20 }) {
  const [streamers, setStreamers] = useState([]);
  const [timeRange, setTimeRange] = useState("7d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("peak_viewers");
  const [sortDirection, setSortDirection] = useState("desc");
  const [dataSource, setDataSource] = useState("real");
  useEffect(() => {
    async function fetchStreamers() {
      try {
        setLoading(true);
        console.log("Intentando obtener top streamers...");
        const topStreamers = await StreamersAPI.getTop(limit);
        console.log("Top streamers obtenidos:", topStreamers);
        if (topStreamers.length === 1 && topStreamers[0].streamer_name === "Ejemplo") {
          setError("No se pudieron cargar los datos reales de streamers.");
          setDataSource("fallback");
          setLoading(false);
          return;
        }
        if (topStreamers.length === 0) {
          setError("No hay datos de streamers disponibles");
          setStreamers([]);
          setLoading(false);
          return;
        }
        try {
          console.log("Obteniendo estadísticas avanzadas para streamers...");
          const streamerPromises = topStreamers.map(
            (streamer) => StreamersAPI.getAdvancedStats(streamer.streamer_name, timeRange).catch((err) => {
              console.error(`Error al obtener estadísticas para ${streamer.streamer_name}:`, err);
              return {
                streamer_name: streamer.streamer_name,
                hours_streamed: 0,
                avg_viewers: streamer.viewers_count || 0,
                peak_viewers: streamer.viewers_count || 0,
                games_streamed: [streamer.game || "Sin datos"],
                active_days: 0,
                time_range: timeRange
              };
            })
          );
          const streamerStats = await Promise.all(streamerPromises);
          console.log("Estadísticas avanzadas obtenidas:", streamerStats);
          setStreamers(streamerStats);
          setDataSource("real");
          setError(null);
        } catch (err) {
          console.error("Error al procesar estadísticas de streamers:", err);
          setError("Error al procesar estadísticas de streamers");
          const fallbackStats = topStreamers.map((streamer) => ({
            streamer_name: streamer.streamer_name,
            hours_streamed: 0,
            avg_viewers: streamer.viewers_count || 0,
            peak_viewers: streamer.viewers_count || 0,
            games_streamed: [streamer.game || "Sin datos"],
            active_days: 0,
            time_range: timeRange
          }));
          setStreamers(fallbackStats);
          setDataSource("partial");
        }
      } catch (err) {
        console.error("Error al obtener streamers:", err);
        setError("No se pudieron cargar los datos de streamers");
        setStreamers([]);
        setDataSource("fallback");
      } finally {
        setLoading(false);
      }
    }
    fetchStreamers();
  }, [timeRange, limit]);
  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
  };
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("desc");
    }
  };
  const sortedStreamers = [...streamers].sort((a, b) => {
    const valueA = a[sortBy];
    const valueB = b[sortBy];
    if (sortBy === "streamer_name") {
      return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    }
    return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
  });
  const formatTimeRange = (range) => {
    switch (range) {
      case "7d":
        return "últimos 7 días";
      case "1m":
        return "último mes";
      case "3m":
        return "últimos 3 meses";
      case "all":
        return "todo el tiempo";
      default:
        return range;
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center h-64", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-md p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-4", children: "Top Streamers" }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-600 mb-6", children: [
        "Estadísticas para los ",
        formatTimeRange(timeRange)
      ] }),
      error && /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-6",
          role: "alert",
          children: [
            /* @__PURE__ */ jsx("strong", { className: "font-bold", children: "Atención:" }),
            /* @__PURE__ */ jsxs("span", { className: "block sm:inline", children: [
              " ",
              error
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "mt-2", children: [
              "Verifica la conexión con la API y asegúrate de que el servidor esté funcionando correctamente.",
              /* @__PURE__ */ jsx("a", { href: "/diagnostico", className: "underline font-medium ml-2", children: "Ir a la página de diagnóstico" })
            ] })
          ]
        }
      ),
      dataSource === "partial" && !error && /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-6",
          role: "alert",
          children: [
            /* @__PURE__ */ jsx("strong", { className: "font-bold", children: "Información:" }),
            /* @__PURE__ */ jsx("span", { className: "block sm:inline", children: " Algunos datos pueden estar incompletos o ser aproximados." })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Período de tiempo:" }),
        /* @__PURE__ */ jsx(TimeRangeSelector, { selectedRange: timeRange, onChange: handleTimeRangeChange })
      ] })
    ] }),
    streamers.length === 0 ? /* @__PURE__ */ jsx("div", { className: "bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative", role: "alert", children: /* @__PURE__ */ jsx("span", { className: "block sm:inline", children: "No se encontraron streamers para mostrar." }) }) : /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow-md overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx(
          "th",
          {
            scope: "col",
            className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer",
            onClick: () => handleSort("streamer_name"),
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
              "Streamer",
              sortBy === "streamer_name" && /* @__PURE__ */ jsx("span", { className: "ml-1", children: sortDirection === "asc" ? "↑" : "↓" })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          "th",
          {
            scope: "col",
            className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer",
            onClick: () => handleSort("hours_streamed"),
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
              "Horas Streameadas",
              sortBy === "hours_streamed" && /* @__PURE__ */ jsx("span", { className: "ml-1", children: sortDirection === "asc" ? "↑" : "↓" })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          "th",
          {
            scope: "col",
            className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer",
            onClick: () => handleSort("avg_viewers"),
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
              "Media de Viewers",
              sortBy === "avg_viewers" && /* @__PURE__ */ jsx("span", { className: "ml-1", children: sortDirection === "asc" ? "↑" : "↓" })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          "th",
          {
            scope: "col",
            className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer",
            onClick: () => handleSort("peak_viewers"),
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
              "Peak Viewers",
              sortBy === "peak_viewers" && /* @__PURE__ */ jsx("span", { className: "ml-1", children: sortDirection === "asc" ? "↑" : "↓" })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          "th",
          {
            scope: "col",
            className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer",
            onClick: () => handleSort("active_days"),
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
              "Días Activos",
              sortBy === "active_days" && /* @__PURE__ */ jsx("span", { className: "ml-1", children: sortDirection === "asc" ? "↑" : "↓" })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          "th",
          {
            scope: "col",
            className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
            children: "Juegos"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: sortedStreamers.map((streamer) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx(
          "a",
          {
            href: `/streamer/${streamer.streamer_name}`,
            className: "text-purple-600 hover:text-purple-900 font-medium",
            children: streamer.streamer_name
          }
        ) }),
        /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-gray-700", children: [
          streamer.hours_streamed,
          "h"
        ] }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-gray-700", children: streamer.avg_viewers.toLocaleString() }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-gray-700", children: streamer.peak_viewers.toLocaleString() }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-gray-700", children: streamer.active_days }),
        /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-gray-700", children: [
          streamer.games_streamed.slice(0, 2).join(", "),
          streamer.games_streamed.length > 2 && "..."
        ] })
      ] }, streamer.streamer_name)) })
    ] }) }) })
  ] });
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "KOI Stats - Estad\xEDsticas de Streamers" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="bg-gradient-to-r from-purple-900 to-purple-700 text-white py-16"> <div class="container mx-auto px-4 text-center"> <h1 class="text-4xl md:text-5xl font-bold mb-4">KOI Stats</h1> <p class="text-xl md:text-2xl max-w-3xl mx-auto">
Estadísticas detalladas y análisis de los streamers más populares de KOI
</p> </div> </div> ${renderComponent($$result2, "StreamerTable", StreamerTable, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/src/components/StreamerTable.jsx", "client:component-export": "default" })} ` })}`;
}, "C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/src/pages/index.astro", void 0);

const $$file = "C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
