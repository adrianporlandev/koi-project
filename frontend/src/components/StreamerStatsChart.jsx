"use client"

import { useState, useEffect } from "react"
import { StreamersAPI } from "../lib/api"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function StreamerStatsChart({ streamerName, timeRange = "7d" }) {
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        // Usamos el endpoint existente que devuelve datos históricos
        const data = await StreamersAPI.getGrowth(
          streamerName,
          timeRange === "7d" ? 7 : timeRange === "1m" ? 30 : timeRange === "3m" ? 90 : 365,
        )

        prepareChartData(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching chart data:", err)
        setError("No se pudieron cargar los datos del gráfico")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [streamerName, timeRange])

  const prepareChartData = (data) => {
    if (!data || data.length === 0) {
      setChartData(null)
      return
    }

    const labels = data.map((item) => {
      const date = new Date(item.date)
      return date.toLocaleDateString()
    })

    setChartData({
      labels,
      datasets: [
        {
          label: "Viewers Promedio",
          data: data.map((item) => item.average_viewers),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          tension: 0.3,
        },
      ],
    })
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Tendencia de Viewers - ${streamerName}`,
      },
      tooltip: {
        callbacks: {
          label: (context) => `Viewers: ${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Viewers Promedio",
        },
      },
      x: {
        title: {
          display: true,
          text: "Fecha",
        },
      },
    },
  }

  if (loading) return <div className="loading">Cargando gráfico...</div>
  if (error) return <div className="error">{error}</div>
  if (!chartData) return <div>No hay datos suficientes para mostrar el gráfico</div>

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
    </div>
  )
}

