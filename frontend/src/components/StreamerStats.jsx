"use client"

import { useState, useEffect } from "react"
import { StreamersAPI } from "../lib/api"
import TimeRangeSelector from "./TimeRangeSelector"
import StatCard from "./StatCard"
import GamesList from "./GamesList"
import ViewersChart from "./ViewersChart"

export default function StreamerStats({ streamerName }) {
  const [stats, setStats] = useState(null)
  const [timeRange, setTimeRange] = useState("7d")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        const data = await StreamersAPI.getAdvancedStats(streamerName, timeRange)
        setStats(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching stats:", err)
        setError("No se pudieron cargar las estadísticas. Verifica que la API esté en funcionamiento.")

        // Proporcionar datos de fallback para que la UI no se rompa
        setStats({
          streamer_name: streamerName,
          hours_streamed: 0,
          avg_viewers: 0,
          peak_viewers: 0,
          games_streamed: ["Sin datos disponibles"],
          active_days: 0,
          time_range: timeRange,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [streamerName, timeRange])

  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange)
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
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">No hay datos disponibles para este streamer.</span>
      </div>
    )
  }

  const formatTimeRange = (range) => {
    switch (range) {
      case "7d":
        return "últimos 7 días"
      case "1m":
        return "último mes"
      case "3m":
        return "últimos 3 meses"
      case "all":
        return "todo el tiempo"
      default:
        return range
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Estadísticas de {streamerName}</h2>
        <p className="text-gray-600 mb-6">Datos para los {formatTimeRange(timeRange)}</p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Período de tiempo:</label>
          <TimeRangeSelector selectedRange={timeRange} onChange={handleTimeRangeChange} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Horas Streameadas"
          value={`${stats.hours_streamed}h`}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          color="purple"
        />

        <StatCard
          title="Media de Viewers"
          value={stats.avg_viewers.toLocaleString()}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          }
          color="blue"
        />

        <StatCard
          title="Peak Viewers"
          value={stats.peak_viewers.toLocaleString()}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
          color="green"
        />

        <StatCard
          title="Días Activos"
          value={stats.active_days}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
          color="orange"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Juegos Streameados</h3>
        <GamesList games={stats.games_streamed} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Tendencia de Viewers</h3>
        <ViewersChart streamerName={streamerName} timeRange={timeRange} />
      </div>
    </div>
  )
}

