"use client"

import { useState, useEffect } from "react"
import { StreamersAPI } from "../lib/api"
import TimeRangeSelector from "./TimeRangeSelector"

export default function StreamerTable({ limit = 20 }) {
  const [streamers, setStreamers] = useState([])
  const [timeRange, setTimeRange] = useState("7d")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState("peak_viewers")
  const [sortDirection, setSortDirection] = useState("desc")
  const [dataSource, setDataSource] = useState("real") // 'real' o 'fallback'

  useEffect(() => {
    async function fetchStreamers() {
      try {
        setLoading(true)
        console.log("Intentando obtener top streamers...")

        // Primero obtenemos la lista de top streamers
        const topStreamers = await StreamersAPI.getTop(limit)
        console.log("Top streamers obtenidos:", topStreamers)

        // Verificar si son datos de fallback
        if (topStreamers.length === 1 && topStreamers[0].streamer_name === "Ejemplo") {
          setError("No se pudieron cargar los datos reales de streamers.")
          setDataSource("fallback")
          setLoading(false)
          return
        }

        if (topStreamers.length === 0) {
          setError("No hay datos de streamers disponibles")
          setStreamers([])
          setLoading(false)
          return
        }

        // Luego obtenemos las estadísticas avanzadas para cada uno
        try {
          console.log("Obteniendo estadísticas avanzadas para streamers...")
          const streamerPromises = topStreamers.map((streamer) =>
            StreamersAPI.getAdvancedStats(streamer.streamer_name, timeRange).catch((err) => {
              console.error(`Error al obtener estadísticas para ${streamer.streamer_name}:`, err)
              // Devolver datos basados en el streamer básico
              return {
                streamer_name: streamer.streamer_name,
                hours_streamed: 0,
                avg_viewers: streamer.viewers_count || 0,
                peak_viewers: streamer.viewers_count || 0,
                games_streamed: [streamer.game || "Sin datos"],
                active_days: 0,
                time_range: timeRange,
              }
            }),
          )

          const streamerStats = await Promise.all(streamerPromises)
          console.log("Estadísticas avanzadas obtenidas:", streamerStats)

          setStreamers(streamerStats)
          setDataSource("real")
          setError(null)
        } catch (err) {
          console.error("Error al procesar estadísticas de streamers:", err)
          setError("Error al procesar estadísticas de streamers")

          // Crear datos basados en los streamers básicos
          const fallbackStats = topStreamers.map((streamer) => ({
            streamer_name: streamer.streamer_name,
            hours_streamed: 0,
            avg_viewers: streamer.viewers_count || 0,
            peak_viewers: streamer.viewers_count || 0,
            games_streamed: [streamer.game || "Sin datos"],
            active_days: 0,
            time_range: timeRange,
          }))

          setStreamers(fallbackStats)
          setDataSource("partial")
        }
      } catch (err) {
        console.error("Error al obtener streamers:", err)
        setError("No se pudieron cargar los datos de streamers")
        setStreamers([])
        setDataSource("fallback")
      } finally {
        setLoading(false)
      }
    }

    fetchStreamers()
  }, [timeRange, limit])

  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange)
  }

  const handleSort = (column) => {
    if (sortBy === column) {
      // Si ya estamos ordenando por esta columna, cambiamos la dirección
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Si es una nueva columna, ordenamos descendente por defecto
      setSortBy(column)
      setSortDirection("desc")
    }
  }

  const sortedStreamers = [...streamers].sort((a, b) => {
    const valueA = a[sortBy]
    const valueB = b[sortBy]

    // Para el caso de streamer_name, ordenamos alfabéticamente
    if (sortBy === "streamer_name") {
      return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
    }

    // Para valores numéricos
    return sortDirection === "asc" ? valueA - valueB : valueB - valueA
  })

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Top Streamers</h2>
        <p className="text-gray-600 mb-6">Estadísticas para los {formatTimeRange(timeRange)}</p>

        {error && (
          <div
            className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <strong className="font-bold">Atención:</strong>
            <span className="block sm:inline"> {error}</span>
            <p className="mt-2">
              Verifica la conexión con la API y asegúrate de que el servidor esté funcionando correctamente.
              <a href="/diagnostico" className="underline font-medium ml-2">
                Ir a la página de diagnóstico
              </a>
            </p>
          </div>
        )}

        {dataSource === "partial" && !error && (
          <div
            className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <strong className="font-bold">Información:</strong>
            <span className="block sm:inline"> Algunos datos pueden estar incompletos o ser aproximados.</span>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Período de tiempo:</label>
          <TimeRangeSelector selectedRange={timeRange} onChange={handleTimeRangeChange} />
        </div>
      </div>

      {streamers.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">No se encontraron streamers para mostrar.</span>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("streamer_name")}
                  >
                    <div className="flex items-center">
                      Streamer
                      {sortBy === "streamer_name" && (
                        <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("hours_streamed")}
                  >
                    <div className="flex items-center">
                      Horas Streameadas
                      {sortBy === "hours_streamed" && (
                        <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("avg_viewers")}
                  >
                    <div className="flex items-center">
                      Media de Viewers
                      {sortBy === "avg_viewers" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("peak_viewers")}
                  >
                    <div className="flex items-center">
                      Peak Viewers
                      {sortBy === "peak_viewers" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("active_days")}
                  >
                    <div className="flex items-center">
                      Días Activos
                      {sortBy === "active_days" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Juegos
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedStreamers.map((streamer) => (
                  <tr key={streamer.streamer_name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={`/streamer/${streamer.streamer_name}`}
                        className="text-purple-600 hover:text-purple-900 font-medium"
                      >
                        {streamer.streamer_name}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{streamer.hours_streamed}h</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {streamer.avg_viewers.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {streamer.peak_viewers.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{streamer.active_days}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {streamer.games_streamed.slice(0, 2).join(", ")}
                      {streamer.games_streamed.length > 2 && "..."}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

