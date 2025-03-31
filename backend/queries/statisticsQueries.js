import supabase from "../utils/supabaseClient.js"

// Corregido: nombre de tabla correcto
const TABLE_NAME = "stats"

export const getAllStats = async (limit = 100) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .order("snapshot_at", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export const getStatsByDateRange = async (startDate, endDate) => {
  // Validar que las fechas no sean nulas
  if (!startDate || !endDate) {
    throw new Error("Las fechas de inicio y fin son obligatorias")
  }

  // Validar formato de fecha
  if (!isValidISODate(startDate) || !isValidISODate(endDate)) {
    throw new Error("Las fechas deben estar en formato ISO (YYYY-MM-DDTHH:MM:SSZ)")
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .gte("snapshot_at", startDate)
    .lte("snapshot_at", endDate)
    .order("snapshot_at", { ascending: false })

  if (error) throw error
  return data
}

export const getLatestStats = async () => {
  // Get the most recent snapshot_at timestamp
  const { data: latestSnapshot, error: latestError } = await supabase
    .from(TABLE_NAME)
    .select("snapshot_at")
    .order("snapshot_at", { ascending: false })
    .limit(1)

  if (latestError) throw latestError

  if (!latestSnapshot || latestSnapshot.length === 0) {
    return []
  }

  const latestTimestamp = latestSnapshot[0].snapshot_at

  // Get all records with that timestamp
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("snapshot_at", latestTimestamp)
    .order("viewers_count", { ascending: false })

  if (error) throw error
  return data
}

export const addStats = async (statsData) => {
  // Validación
  if (!statsData.streamer_name || !statsData.viewers_count || !statsData.game) {
    throw new Error("Missing required fields: streamer_name, viewers_count, and game are required")
  }

  // Asegurarse de que snapshot_at sea una fecha válida
  const timestamp = statsData.snapshot_at ? new Date(statsData.snapshot_at) : new Date()

  // Verificar si la fecha es válida
  if (isNaN(timestamp.getTime())) {
    throw new Error("Invalid timestamp format")
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([
      {
        ...statsData,
        snapshot_at: timestamp.toISOString(), // Usar formato ISO para timestamp
      },
    ])
    .select()

  if (error) throw error
  return data[0]
}

// Función auxiliar para validar formato de fecha ISO
function isValidISODate(dateString) {
  if (!dateString) return false

  try {
    const date = new Date(dateString)
    return !isNaN(date.getTime())
  } catch (e) {
    return false
  }
}

