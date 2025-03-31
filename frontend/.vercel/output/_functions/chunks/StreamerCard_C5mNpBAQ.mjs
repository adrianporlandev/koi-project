import { jsx, jsxs } from 'react/jsx-runtime';

function StreamerCard({ streamer }) {
  return /* @__PURE__ */ jsx(
    "a",
    {
      href: `/streamer/${streamer.streamer_name}`,
      className: "block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow",
      children: /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-purple-900 mb-2", children: streamer.streamer_name }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-gray-600 mb-3", children: [
          /* @__PURE__ */ jsx("span", { children: streamer.game || "Sin juego" }),
          /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
            streamer.viewers_count?.toLocaleString(),
            " viewers"
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 truncate", children: streamer.title || "Sin título" })
      ] })
    }
  );
}

export { StreamerCard as S };
