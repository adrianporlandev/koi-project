import * as streamerQueries from "../queries/streamerQueries.js"

export const getAllStreamers = async (limit) => {
  return await streamerQueries.getStreamers(limit)
}

export const getStreamerByName = async (name) => {
  return await streamerQueries.getStreamerByName(name)
}

export const getTopStreamers = async (limit) => {
  return await streamerQueries.getTopStreamers(limit)
}

export const getStreamerGrowth = async (streamerName, days) => {
  const data = await streamerQueries.getStreamerGrowth(streamerName, days)
  return processStreamerGrowthData(data)
}

export const getAllStreamersGrowth = async (days) => {
  const data = await streamerQueries.getAllStreamersGrowth(days)
  return processAllStreamersGrowthData(data)
}

// Helper function to process growth data for a single streamer
const processStreamerGrowthData = (data) => {
  if (!data || data.length === 0) return []

  // Group by day
  const dailyData = {}

  data.forEach((record) => {
    const date = new Date(record.snapshot_at).toISOString().split("T")[0]

    if (!dailyData[date]) {
      dailyData[date] = {
        date,
        streamer_name: record.streamer_name,
        total_viewers: 0,
        count: 0,
        average_viewers: 0,
      }
    }

    dailyData[date].total_viewers += record.viewers_count
    dailyData[date].count += 1
  })

  // Calculate averages and growth
  return Object.values(dailyData).map((day, index, array) => {
    day.average_viewers = Math.round(day.total_viewers / day.count)

    if (index > 0) {
      const previousDay = array[index - 1]
      day.growth = day.average_viewers - previousDay.average_viewers
      day.growth_percentage =
        previousDay.average_viewers > 0
          ? (((day.average_viewers - previousDay.average_viewers) / previousDay.average_viewers) * 100).toFixed(2)
          : 0
    } else {
      day.growth = 0
      day.growth_percentage = 0
    }

    return day
  })
}

// Helper function to process growth data for all streamers
const processAllStreamersGrowthData = (data) => {
  if (!data || data.length === 0) return []

  // Group by streamer
  const streamerData = {}

  data.forEach((record) => {
    if (!streamerData[record.streamer_name]) {
      streamerData[record.streamer_name] = {
        streamer_name: record.streamer_name,
        first_record: null,
        last_record: null,
        records: [],
      }
    }

    streamerData[record.streamer_name].records.push(record)
  })

  // Find first and last record for each streamer
  Object.values(streamerData).forEach((streamer) => {
    if (streamer.records.length < 2) {
      delete streamerData[streamer.streamer_name]
      return
    }

    streamer.records.sort((a, b) => new Date(a.snapshot_at) - new Date(b.snapshot_at))
    streamer.first_record = streamer.records[0]
    streamer.last_record = streamer.records[streamer.records.length - 1]

    streamer.growth = streamer.last_record.viewers_count - streamer.first_record.viewers_count
    streamer.growth_percentage =
      streamer.first_record.viewers_count > 0
        ? (
            ((streamer.last_record.viewers_count - streamer.first_record.viewers_count) /
              streamer.first_record.viewers_count) *
            100
          ).toFixed(2)
        : 0

    delete streamer.records
  })

  return Object.values(streamerData).sort((a, b) => b.growth_percentage - a.growth_percentage)
}

export const getStreamerAdvancedStats = async (streamerName, timeRange = "7d") => {
  const data = await streamerQueries.getStreamerAdvancedStats(streamerName, timeRange)

  if (!data || data.length === 0) {
    return {
      streamer_name: streamerName,
      hours_streamed: 0,
      avg_viewers: 0,
      peak_viewers: 0,
      games_streamed: [],
      active_days: 0,
      time_range: timeRange,
    }
  }

  // Calcular horas streameadas
  // Nota: Esto asume que cada registro representa un punto en el tiempo
  // Para un cálculo más preciso, necesitaríamos datos de inicio/fin de stream
  const streamSessions = identifyStreamSessions(data)
  const hoursStreamed = calculateTotalStreamHours(streamSessions)

  // Calcular media de viewers
  const totalViewers = data.reduce((sum, record) => sum + record.viewers_count, 0)
  const avgViewers = Math.round(totalViewers / data.length)

  // Encontrar peak viewers
  const peakViewers = Math.max(...data.map((record) => record.viewers_count))

  // Obtener juegos únicos streameados
  const gamesStreamed = [...new Set(data.map((record) => record.game))].filter(Boolean)

  // Calcular días activos (días únicos con streams)
  const activeDays = countActiveDays(data)

  return {
    streamer_name: streamerName,
    hours_streamed: hoursStreamed,
    avg_viewers: avgViewers,
    peak_viewers: peakViewers,
    games_streamed: gamesStreamed,
    active_days: activeDays,
    time_range: timeRange,
  }
}

// Función para identificar sesiones de stream basadas en gaps en los datos
function identifyStreamSessions(data) {
  if (!data || data.length === 0) return []

  // Ordenar por timestamp
  const sortedData = [...data].sort((a, b) => new Date(a.snapshot_at) - new Date(b.snapshot_at))

  const sessions = []
  let currentSession = [sortedData[0]]

  for (let i = 1; i < sortedData.length; i++) {
    const currentRecord = sortedData[i]
    const prevRecord = sortedData[i - 1]

    // Calcular diferencia de tiempo en minutos
    const timeDiff = (new Date(currentRecord.snapshot_at) - new Date(prevRecord.snapshot_at)) / (1000 * 60)

    // Si la diferencia es mayor a 30 minutos, consideramos que es una nueva sesión
    if (timeDiff > 30) {
      sessions.push(currentSession)
      currentSession = [currentRecord]
    } else {
      currentSession.push(currentRecord)
    }
  }

  // Añadir la última sesión
  if (currentSession.length > 0) {
    sessions.push(currentSession)
  }

  return sessions
}

// Calcular horas totales de stream
function calculateTotalStreamHours(sessions) {
  let totalHours = 0

  sessions.forEach((session) => {
    if (session.length < 2) {
      // Si solo hay un registro en la sesión, asumimos 15 minutos
      totalHours += 0.25
    } else {
      const startTime = new Date(session[0].snapshot_at)
      const endTime = new Date(session[session.length - 1].snapshot_at)
      const durationHours = (endTime - startTime) / (1000 * 60 * 60)
      totalHours += durationHours
    }
  })

  return Math.round(totalHours * 10) / 10 // Redondear a 1 decimal
}

// Contar días activos (días únicos con streams)
function countActiveDays(data) {
  const uniqueDays = new Set()

  data.forEach((record) => {
    const date = new Date(record.snapshot_at).toISOString().split("T")[0]
    uniqueDays.add(date)
  })

  return uniqueDays.size
}

