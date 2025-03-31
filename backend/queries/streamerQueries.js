import supabase from "../utils/supabaseClient.js"

// Corregido: nombre de tabla correcto
const TABLE_NAME = "stats"

export const getStreamers = async (limit = 100) => {
  const { data, error } = await supabase.from(TABLE_NAME).select("streamer_name").order("streamer_name").limit(limit)

  if (error) throw error

  // Remove duplicates
  const uniqueStreamers = [...new Set(data.map((item) => item.streamer_name))]
  return uniqueStreamers.map((name) => ({ streamer_name: name }))
}

export const getStreamerByName = async (name) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .ilike("streamer_name", `%${name}%`)
    .order("snapshot_at", { ascending: false })

  if (error) throw error
  return data
}

export const getTopStreamers = async (limit = 10) => {
  const { data, error } = await supabase.rpc("get_top_streamers", { limit_count: limit });

  if (error) throw error;

  return data || [];
};

export const getStreamerGrowth = async (streamerName, days = 7) => {
  // Validar parámetros
  if (!streamerName) {
    throw new Error("El nombre del streamer es obligatorio")
  }

  // Asegurarse de que days sea un número
  const daysNum = Number.parseInt(days) || 7

  // Calculate the date from X days ago
  const daysAgo = new Date()
  daysAgo.setDate(daysAgo.getDate() - daysNum)

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("streamer_name", streamerName)
    .gte("snapshot_at", daysAgo.toISOString())
    .order("snapshot_at", { ascending: true })

  if (error) throw error
  return data
}

export const getAllStreamersGrowth = async (days = 7) => {
  // Asegurarse de que days sea un número
  const daysNum = Number.parseInt(days) || 7

  // Calculate the date from X days ago
  const daysAgo = new Date()
  daysAgo.setDate(daysAgo.getDate() - daysNum)

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .gte("snapshot_at", daysAgo.toISOString())
    .order("snapshot_at", { ascending: true })

  if (error) throw error
  return data
}

export const getStreamerAdvancedStats = async (streamerName, timeRange) => {
  // Validar parámetros
  if (!streamerName) {
    throw new Error("El nombre del streamer es obligatorio")
  }

  // Calcular la fecha de inicio según el rango de tiempo
  const startDate = calculateStartDate(timeRange)

  // Si timeRange es 'all', no aplicamos filtro de fecha
  let query = supabase.from(TABLE_NAME).select("*").eq("streamer_name", streamerName)

  if (timeRange !== "all") {
    query = query.gte("snapshot_at", startDate.toISOString())
  }

  // Ordenar por fecha para cálculos posteriores
  query = query.order("snapshot_at", { ascending: true })

  const { data, error } = await query

  if (error) throw error
  return data
}

// Función auxiliar para calcular la fecha de inicio según el rango
function calculateStartDate(timeRange) {
  const now = new Date()
  switch (timeRange) {
    case "7d":
      const sevenDaysAgo = new Date(now)
      sevenDaysAgo.setDate(now.getDate() - 7)
      return sevenDaysAgo
    case "1m":
      const oneMonthAgo = new Date(now)
      oneMonthAgo.setMonth(now.getMonth() - 1)
      return oneMonthAgo
    case "3m":
      const threeMonthsAgo = new Date(now)
      threeMonthsAgo.setMonth(now.getMonth() - 3)
      return threeMonthsAgo
    case "all":
    default:
      // Para 'all', retornamos una fecha muy antigua
      return new Date(0)
  }
}

