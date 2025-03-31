"use client"

import { useState, useEffect } from "react"
import { StreamersAPI } from "../lib/api"

export default function StreamersStatsTable({ initialTimeRange = "7d", limit = 20 }) {
  const [streamers, setStreamers] = useState([])
  const [timeRange, setTimeRange] = useState(initialTimeRange)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState("peak_viewers")
  const [sortDirection, setSortDirection] = useState("desc")

  useEffect(() => {
    async function fetchStreamers() {
      try {
        setLoading(true)
        // Primero obtenemos la lista de top streamers
        const topStreamers = await StreamersAPI.getTop(limit)

        // Luego obtenemos las estadísticas avanzadas para cada uno
        const streamerPromises = topStreamers.map((streamer) =>
          StreamersAPI.getAdvancedStats(streamer.streamer_name, timeRange),
        )

        const streamerStats = await Promise.all(streamerPromises)
        setStreamers(streamerStats)
        setError(null)
      } catch (err) {
        console.error("Error fetching streamers stats:", err)
        setError("No se pudieron cargar las estadísticas de los streamers")
      } finally {
        setLoading(false)
      }
    }

    fetchStreamers()
  }, [timeRange, limit])

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

  // Función para formatear el rango de tiempo para mostrar
  const formatTimeRange = (range) => {
    switch (range) {
      case "7d":
        return "Últimos 7 días"
      case "1m":
        return "Último mes"
      case "3m":
        return "Últimos 3 meses"
      case "all":
        return "Todo el tiempo"
      default:
        return range
    }
  }

  return (
    <div className="streamers-stats-table">
      <div className="table-controls">
        <div className="time-range-selector">
          <label>Período de tiempo:</label>
          <div className="time-buttons">
            <button className={timeRange === "7d" ? "active" : ""} onClick={() => setTimeRange("7d")}>
              7 días
            </button>
            <button className={timeRange === "1m" ? "active" : ""} onClick={() => setTimeRange("1m")}>
              1 mes
            </button>
            <button className={timeRange === "3m" ? "active" : ""} onClick={() => setTimeRange("3m")}>
              3 meses
            </button>
            <button className={timeRange === "all" ? "active" : ""} onClick={() => setTimeRange("all")}>
              Todo
            </button>
          </div>
        </div>
      </div>

      {loading && <div className="loading">Cargando estadísticas de streamers...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th
                  onClick={() => handleSort("streamer_name")}
                  className={sortBy === "streamer_name" ? `sorted-${sortDirection}` : ""}
                >
                  Streamer
                </th>
                <th
                  onClick={() => handleSort("hours_streamed")}
                  className={sortBy === "hours_streamed" ? `sorted-${sortDirection}` : ""}
                >
                  Horas Streameadas
                </th>
                <th
                  onClick={() => handleSort("avg_viewers")}
                  className={sortBy === "avg_viewers" ? `sorted-${sortDirection}` : ""}
                >
                  Media de Viewers
                </th>
                <th
                  onClick={() => handleSort("peak_viewers")}
                  className={sortBy === "peak_viewers" ? `sorted-${sortDirection}` : ""}
                >
                  Peak Viewers
                </th>
                <th
                  onClick={() => handleSort("active_days")}
                  className={sortBy === "active_days" ? `sorted-${sortDirection}` : ""}
                >
                  Días Activos
                </th>
                <th>Juegos Principales</th>
              </tr>
            </thead>
            <tbody>
              {sortedStreamers.map((streamer, index) => (
                <tr key={index}>
                  <td>
                    <a href={`/streamer/${streamer.streamer_name}`}>{streamer.streamer_name}</a>
                  </td>
                  <td>{streamer.hours_streamed}h</td>
                  <td>{streamer.avg_viewers.toLocaleString()}</td>
                  <td>{streamer.peak_viewers.toLocaleString()}</td>
                  <td>{streamer.active_days}</td>
                  <td>
                    {streamer.games_streamed.slice(0, 2).join(", ")}
                    {streamer.games_streamed.length > 2 && "..."}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .streamers-stats-table {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .table-controls {
          margin-bottom: 1.5rem;
        }
        
        .time-buttons {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        
        .time-buttons button {
          padding: 0.5rem 1rem;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .time-buttons button.active {
          background: #6441a5;
          color: white;
          border-color: #6441a5;
        }
        
        .table-container {
          overflow-x: auto;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        th, td {
          padding: 0.75rem 1rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        
        th {
          background: #f5f5f5;
          font-weight: 600;
          cursor: pointer;
          position: relative;
        }
        
        th.sorted-asc::after {
          content: "↑";
          margin-left: 5px;
        }
        
        th.sorted-desc::after {
          content: "↓";
          margin-left: 5px;
        }
        
        tbody tr:hover {
          background: #f9f9f9;
        }
        
        td a {
          color: #6441a5;
          text-decoration: none;
          font-weight: 500;
        }
        
        td a:hover {
          text-decoration: underline;
        }
        
        .loading, .error {
          padding: 2rem;
          text-align: center;
        }
        
        .error {
          color: #e53935;
        }
      `}</style>
    </div>
  )
}

