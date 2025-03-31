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

export default function ViewersChart({ streamerName, timeRange }) {
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Convertir timeRange a días para la API de growth
        const days = timeRange === "7d" ? 7 : timeRange === "1m" ? 30 : timeRange === "3m" ? 90 : 365

        const data = await StreamersAPI.getGrowth(streamerName, days)

        if (data && data.length > 0) {
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
                borderColor: "rgb(124, 58, 237)",
                backgroundColor: "rgba(124, 58, 237, 0.5)",
                tension: 0.3,
              },
            ],
          })
        } else {
          // Crear datos de ejemplo si no hay datos reales
          const today = new Date()
          const labels = Array(7)
            .fill()
            .map((_, i) => {
              const date = new Date(today)
              date.setDate(date.getDate() - (6 - i))
              return date.toLocaleDateString()
            })

          setChartData({
            labels,
            datasets: [
              {
                label: "Viewers Promedio (Sin datos reales)",
                data: Array(7).fill(0),
                borderColor: "rgb(156, 163, 175)",
                backgroundColor: "rgba(156, 163, 175, 0.5)",
                tension: 0.3,
              },
            ],
          })
        }

        setError(null)
      } catch (err) {
        console.error("Error fetching chart data:", err)
        setError("No se pudieron cargar los datos del gráfico. Verifica que la API esté en funcionamiento.")

        // Crear datos de ejemplo para que el gráfico no se rompa
        const today = new Date()
        const labels = Array(7)
          .fill()
          .map((_, i) => {
            const date = new Date(today)
            date.setDate(date.getDate() - (6 - i))
            return date.toLocaleDateString()
          })

        setChartData({
          labels,
          datasets: [
            {
              label: "Viewers Promedio (Sin datos reales)",
              data: Array(7).fill(0),
              borderColor: "rgb(156, 163, 175)",
              backgroundColor: "rgba(156, 163, 175, 0.5)",
              tension: 0.3,
            },
          ],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [streamerName, timeRange])

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    )
  }

  if (!chartData) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">No hay suficientes datos para mostrar el gráfico.</span>
      </div>
    )
  }

  return <Line data={chartData} options={options} />
}

