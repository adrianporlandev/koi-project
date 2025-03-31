// Asegúrate de que esta URL coincida exactamente con la URL de tu API
const API_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:3000/api"

// Función mejorada para depurar problemas de conexión
export async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`

  console.log(`Intentando conectar a: ${url}`)

  try {
    const response = await fetch(url, {
      ...options,
      // Añadir modo CORS explícito
      mode: "cors",
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error(`Error en respuesta API (${response.status}): ${response.statusText}`)
      const errorText = await response.text()
      console.error(`Detalles del error: ${errorText}`)
      throw new Error(`Error API: ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`Respuesta exitosa de ${url}:`, data)
    return data
  } catch (error) {
    console.error(`Error al conectar con ${url}:`, error)

    // Ya no devolvemos datos de fallback automáticamente
    // para que los componentes puedan manejar los errores explícitamente
    throw error
  }
}

export const StreamersAPI = {
  getAll: () => fetchAPI("/streamers"),
  getTop: (limit = 10) => fetchAPI(`/streamers/top?limit=${limit}`),
  getByName: (name) => fetchAPI(`/streamers/${name}`),
  getGrowth: (name, days = 7) => fetchAPI(`/streamers/${name}/growth?days=${days}`),
  getAllGrowth: (days = 7) => fetchAPI(`/streamers/growth/all?days=${days}`),
  getAdvancedStats: (name, timeRange = "7d") => fetchAPI(`/streamers/${name}/advanced-stats?time_range=${timeRange}`),
}

export const GamesAPI = {
  getAll: () => fetchAPI("/games"),
  getTop: (limit = 10) => fetchAPI(`/games/top?limit=${limit}`),
  getByName: (name) => fetchAPI(`/games/${name}`),
}

export const StatsAPI = {
  getAll: (limit = 100) => fetchAPI(`/stats?limit=${limit}`),
  getByDateRange: (startDate, endDate) => fetchAPI(`/stats/date-range?start_date=${startDate}&end_date=${endDate}`),
  getLatest: () => fetchAPI("/stats/latest"),
}

// Función para verificar la conexión con la API
export async function testAPIConnection() {
  try {
    // Intentar con el endpoint de health check primero
    try {
      const healthResponse = await fetch(`${API_URL}/health`, {
        mode: "cors",
        headers: { "Content-Type": "application/json" },
      })

      if (healthResponse.ok) {
        const data = await healthResponse.json()
        console.log("API health check exitoso:", data)
        return { success: true, message: "Conexión exitosa con la API", data }
      }
    } catch (healthError) {
      console.log("Health check falló, intentando con otro endpoint...")
    }

    // Si el health check falla, intentar con otro endpoint
    const response = await fetch(`${API_URL}/streamers/top?limit=1`, {
      mode: "cors",
      headers: { "Content-Type": "application/json" },
    })

    if (response.ok) {
      const data = await response.json()
      console.log("Conexión exitosa con la API:", data)
      return { success: true, message: "Conexión exitosa con la API", data }
    } else {
      const errorText = await response.text()
      console.error(`Error en respuesta API (${response.status}): ${errorText}`)
      return {
        success: false,
        message: `Error en la respuesta: ${response.status} ${response.statusText}`,
        details: errorText,
      }
    }
  } catch (error) {
    console.error("Error al conectar con la API:", error)
    return {
      success: false,
      message: `Error de conexión: ${error.message}`,
      details: error.toString(),
    }
  }
}

// Función para verificar el estado de la API
export async function checkAPIStatus() {
  try {
    const response = await fetch(`${API_URL}/health`, {
      mode: "cors",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      console.error(`Error en respuesta API (${response.status}): ${response.statusText}`)
      return { online: false, message: `Error: ${response.status} ${response.statusText}` }
    }

    const data = await response.json()
    console.log("API health check exitoso:", data)
    return { online: true, message: "API en línea", data }
  } catch (error) {
    console.error("Error al conectar con la API:", error)
    return { online: false, message: `Error de conexión: ${error.message}` }
  }
}

