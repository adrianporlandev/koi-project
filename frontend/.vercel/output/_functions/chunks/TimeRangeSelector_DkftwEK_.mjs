import { jsx } from 'react/jsx-runtime';

const timeRangeOptions = [
  { value: "7d", label: "7 días" },
  { value: "1m", label: "1 mes" },
  { value: "3m", label: "3 meses" },
  { value: "all", label: "Todo" }
];
function TimeRangeSelector({ selectedRange, onChange }) {
  return /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: timeRangeOptions.map((option) => /* @__PURE__ */ jsx(
    "button",
    {
      onClick: () => onChange(option.value),
      className: `px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedRange === option.value ? "bg-purple-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"}`,
      children: option.label
    },
    option.value
  )) });
}

export { TimeRangeSelector as T };
