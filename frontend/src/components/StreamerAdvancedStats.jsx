"use client"

import { useState, useEffect } from "react"
import { StreamersAPI } from "../lib/api"

export default function StreamerAdvancedStats({ streamerName, initialTimeRange = "7d" }) {
  const [stats, setStats] = useState(null)
  const [timeRange, setTimeRange] = useState(initialTimeRange)
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
        console.error("Error fetching advanced stats:", err)
        setError("No se pudieron cargar las estadísticas avanzadas")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [streamerName, timeRange])

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
    <div className="streamer-advanced-stats">
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

      {loading && <div className="loading">Cargando estadísticas...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Horas Streameadas</h3>
            <div className="stat-value">{stats.hours_streamed}h</div>
            <div className="stat-period">{formatTimeRange(stats.time_range)}</div>
          </div>

          <div className="stat-card">
            <h3>Media de Viewers</h3>
            <div className="stat-value">{stats.avg_viewers.toLocaleString()}</div>
            <div className="stat-period">{formatTimeRange(stats.time_range)}</div>
          </div>

          <div className="stat-card">
            <h3>Peak Viewers</h3>
            <div className="stat-value">{stats.peak_viewers.toLocaleString()}</div>
            <div className="stat-period">{formatTimeRange(stats.time_range)}</div>
          </div>

          <div className="stat-card">
            <h3>Días Activos</h3>
            <div className="stat-value">{stats.active_days}</div>
            <div className="stat-period">{formatTimeRange(stats.time_range)}</div>
          </div>

          <div className="stat-card games">
            <h3>Juegos Streameados</h3>
            <div className="games-list">
              {stats.games_streamed.length > 0 ? (
                <ul>
                  {stats.games_streamed.slice(0, 5).map((game, index) => (
                    <li key={index}>{game}</li>
                  ))}
                  {stats.games_streamed.length > 5 && (
                    <li className="more-games">+{stats.games_streamed.length - 5} más</li>
                  )}
                </ul>
              ) : (
                <p>No hay datos de juegos</p>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .streamer-advanced-stats {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .time-range-selector {
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
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .stat-card {
          background: white;
          border-radius: 6px;
          padding: 1rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
        }
        
        .stat-card.games {
          grid-column: 1 / -1;
        }
        
        .stat-value {
          font-size: 2rem;
          font-weight: bold;
          margin: 0.5rem 0;
          color: #6441a5;
        }
        
        .stat-period {
          font-size: 0.8rem;
          color: #666;
        }
        
        .games-list ul {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 0.5rem;
          padding: 0;
          list-style: none;
        }
        
        .games-list li {
          background: #f0f0f0;
          padding: 0.5rem;
          border-radius: 4px;
          font-size: 0.9rem;
        }
        
        .more-games {
          color: #6441a5;
          font-style: italic;
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

