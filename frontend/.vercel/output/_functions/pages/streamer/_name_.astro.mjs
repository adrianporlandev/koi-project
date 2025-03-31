import { c as createComponent, b as createAstro, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Rbl2tHtw.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_B6RRkINA.mjs';
import { S as StreamersAPI } from '../../chunks/api_DtQ2kKCQ.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { T as TimeRangeSelector } from '../../chunks/TimeRangeSelector_DkftwEK_.mjs';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
export { renderers } from '../../renderers.mjs';

function StatCard({ title, value, icon, color = "purple" }) {
  const colorClasses = {
    purple: "bg-purple-100 text-purple-800",
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    orange: "bg-orange-100 text-orange-800"
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-md p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-4", children: [
      /* @__PURE__ */ jsx("div", { className: `p-3 rounded-full ${colorClasses[color]}`, children: icon }),
      /* @__PURE__ */ jsx("h3", { className: "ml-4 text-lg font-semibold text-gray-700", children: title })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-gray-800", children: value })
  ] });
}

function GamesList({ games }) {
  if (!games || games.length === 0) {
    return /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "No hay datos de juegos disponibles." });
  }
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3", children: games.map((game, index) => /* @__PURE__ */ jsx("div", { className: "bg-gray-100 rounded-lg p-3 text-gray-800 hover:bg-purple-100 transition-colors", children: /* @__PURE__ */ jsx("a", { href: `/games/${encodeURIComponent(game)}`, className: "block", children: game }) }, index)) });
}

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
function ViewersChart({ streamerName, timeRange }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const days = timeRange === "7d" ? 7 : timeRange === "1m" ? 30 : timeRange === "3m" ? 90 : 365;
        const data = await StreamersAPI.getGrowth(streamerName, days);
        if (data && data.length > 0) {
          const labels = data.map((item) => {
            const date = new Date(item.date);
            return date.toLocaleDateString();
          });
          setChartData({
            labels,
            datasets: [
              {
                label: "Viewers Promedio",
                data: data.map((item) => item.average_viewers),
                borderColor: "rgb(124, 58, 237)",
                backgroundColor: "rgba(124, 58, 237, 0.5)",
                tension: 0.3
              }
            ]
          });
        } else {
          const today = /* @__PURE__ */ new Date();
          const labels = Array(7).fill().map((_, i) => {
            const date = new Date(today);
            date.setDate(date.getDate() - (6 - i));
            return date.toLocaleDateString();
          });
          setChartData({
            labels,
            datasets: [
              {
                label: "Viewers Promedio (Sin datos reales)",
                data: Array(7).fill(0),
                borderColor: "rgb(156, 163, 175)",
                backgroundColor: "rgba(156, 163, 175, 0.5)",
                tension: 0.3
              }
            ]
          });
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setError("No se pudieron cargar los datos del gráfico. Verifica que la API esté en funcionamiento.");
        const today = /* @__PURE__ */ new Date();
        const labels = Array(7).fill().map((_, i) => {
          const date = new Date(today);
          date.setDate(date.getDate() - (6 - i));
          return date.toLocaleDateString();
        });
        setChartData({
          labels,
          datasets: [
            {
              label: "Viewers Promedio (Sin datos reales)",
              data: Array(7).fill(0),
              borderColor: "rgb(156, 163, 175)",
              backgroundColor: "rgba(156, 163, 175, 0.5)",
              tension: 0.3
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [streamerName, timeRange]);
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      title: {
        display: true,
        text: `Tendencia de Viewers - ${streamerName}`
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Viewers Promedio"
        }
      },
      x: {
        title: {
          display: true,
          text: "Fecha"
        }
      }
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center h-64", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600" }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative", role: "alert", children: /* @__PURE__ */ jsx("span", { className: "block sm:inline", children: error }) });
  }
  if (!chartData) {
    return /* @__PURE__ */ jsx("div", { className: "bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative", role: "alert", children: /* @__PURE__ */ jsx("span", { className: "block sm:inline", children: "No hay suficientes datos para mostrar el gráfico." }) });
  }
  return /* @__PURE__ */ jsx(Line, { data: chartData, options });
}

function StreamerStats({ streamerName }) {
  const [stats, setStats] = useState(null);
  const [timeRange, setTimeRange] = useState("7d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const data = await StreamersAPI.getAdvancedStats(streamerName, timeRange);
        setStats(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("No se pudieron cargar las estadísticas. Verifica que la API esté en funcionamiento.");
        setStats({
          streamer_name: streamerName,
          hours_streamed: 0,
          avg_viewers: 0,
          peak_viewers: 0,
          games_streamed: ["Sin datos disponibles"],
          active_days: 0,
          time_range: timeRange
        });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [streamerName, timeRange]);
  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center h-64", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600" }) });
  }
  if (error) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative", role: "alert", children: [
      /* @__PURE__ */ jsx("strong", { className: "font-bold", children: "Error:" }),
      /* @__PURE__ */ jsxs("span", { className: "block sm:inline", children: [
        " ",
        error
      ] })
    ] });
  }
  if (!stats) {
    return /* @__PURE__ */ jsx("div", { className: "bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative", role: "alert", children: /* @__PURE__ */ jsx("span", { className: "block sm:inline", children: "No hay datos disponibles para este streamer." }) });
  }
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
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-md p-6", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold text-gray-800 mb-4", children: [
        "Estadísticas de ",
        streamerName
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-600 mb-6", children: [
        "Datos para los ",
        formatTimeRange(timeRange)
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Período de tiempo:" }),
        /* @__PURE__ */ jsx(TimeRangeSelector, { selectedRange: timeRange, onChange: handleTimeRangeChange })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [
      /* @__PURE__ */ jsx(
        StatCard,
        {
          title: "Horas Streameadas",
          value: `${stats.hours_streamed}h`,
          icon: /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              className: "h-6 w-6",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                }
              )
            }
          ),
          color: "purple"
        }
      ),
      /* @__PURE__ */ jsx(
        StatCard,
        {
          title: "Media de Viewers",
          value: stats.avg_viewers.toLocaleString(),
          icon: /* @__PURE__ */ jsxs(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              className: "h-6 w-6",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
              children: [
                /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  }
                )
              ]
            }
          ),
          color: "blue"
        }
      ),
      /* @__PURE__ */ jsx(
        StatCard,
        {
          title: "Peak Viewers",
          value: stats.peak_viewers.toLocaleString(),
          icon: /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              className: "h-6 w-6",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
              children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" })
            }
          ),
          color: "green"
        }
      ),
      /* @__PURE__ */ jsx(
        StatCard,
        {
          title: "Días Activos",
          value: stats.active_days,
          icon: /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              className: "h-6 w-6",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                }
              )
            }
          ),
          color: "orange"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-md p-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-800 mb-4", children: "Juegos Streameados" }),
      /* @__PURE__ */ jsx(GamesList, { games: stats.games_streamed })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-md p-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-800 mb-4", children: "Tendencia de Viewers" }),
      /* @__PURE__ */ jsx(ViewersChart, { streamerName, timeRange })
    ] })
  ] });
}

const $$Astro = createAstro();
const $$name = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$name;
  const { name } = Astro2.params;
  let streamerExists = false;
  try {
    const streamerData = await StreamersAPI.getByName(name);
    streamerExists = streamerData && streamerData.length > 0;
  } catch (error) {
    console.error(`Error al verificar el streamer ${name}:`, error);
    streamerExists = true;
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${name} - Estad\xEDsticas de Twitch` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="bg-gradient-to-r from-purple-900 to-purple-700 text-white py-12"> <div class="container mx-auto px-4"> <h1 class="text-3xl md:text-4xl font-bold">${name}</h1> <p class="mt-2 text-purple-200">Estadísticas detalladas y análisis</p> </div> </div> <div class="container mx-auto px-4 py-12"> ${!streamerExists ? renderTemplate`<div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert"> <strong class="font-bold">Atención:</strong> <span class="block sm:inline"> No se encontró información para el streamer "${name}". Verifica que el nombre sea correcto.</span> <div class="mt-4"> <a href="/streamers" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
Ver todos los streamers
</a> </div> </div>` : renderTemplate`${renderComponent($$result2, "StreamerStats", StreamerStats, { "streamerName": name, "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/src/components/StreamerStats.jsx", "client:component-export": "default" })}`} </div> ` })}`;
}, "C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/src/pages/streamer/[name].astro", void 0);

const $$file = "C:/Users/Adrian/Dev/webs/koi-stats-definitivo/frontend/src/pages/streamer/[name].astro";
const $$url = "/streamer/[name]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$name,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
