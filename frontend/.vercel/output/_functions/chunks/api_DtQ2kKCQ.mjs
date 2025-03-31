const API_URL = "http://localhost:3000/api";
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  console.log(`Intentando conectar a: ${url}`);
  try {
    const response = await fetch(url, {
      ...options,
      // Añadir modo CORS explícito
      mode: "cors",
      headers: {
        ...options.headers,
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      console.error(`Error en respuesta API (${response.status}): ${response.statusText}`);
      const errorText = await response.text();
      console.error(`Detalles del error: ${errorText}`);
      throw new Error(`Error API: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(`Respuesta exitosa de ${url}:`, data);
    return data;
  } catch (error) {
    console.error(`Error al conectar con ${url}:`, error);
    throw error;
  }
}
const StreamersAPI = {
  getAll: () => fetchAPI("/streamers"),
  getTop: (limit = 10) => fetchAPI(`/streamers/top?limit=${limit}`),
  getByName: (name) => fetchAPI(`/streamers/${name}`),
  getGrowth: (name, days = 7) => fetchAPI(`/streamers/${name}/growth?days=${days}`),
  getAllGrowth: (days = 7) => fetchAPI(`/streamers/growth/all?days=${days}`),
  getAdvancedStats: (name, timeRange = "7d") => fetchAPI(`/streamers/${name}/advanced-stats?time_range=${timeRange}`)
};
const GamesAPI = {
  getAll: () => fetchAPI("/games"),
  getTop: (limit = 10) => fetchAPI(`/games/top?limit=${limit}`),
  getByName: (name) => fetchAPI(`/games/${name}`)
};
async function testAPIConnection() {
  try {
    try {
      const healthResponse = await fetch(`${API_URL}/health`, {
        mode: "cors",
        headers: { "Content-Type": "application/json" }
      });
      if (healthResponse.ok) {
        const data = await healthResponse.json();
        console.log("API health check exitoso:", data);
        return { success: true, message: "Conexión exitosa con la API", data };
      }
    } catch (healthError) {
      console.log("Health check falló, intentando con otro endpoint...");
    }
    const response = await fetch(`${API_URL}/streamers/top?limit=1`, {
      mode: "cors",
      headers: { "Content-Type": "application/json" }
    });
    if (response.ok) {
      const data = await response.json();
      console.log("Conexión exitosa con la API:", data);
      return { success: true, message: "Conexión exitosa con la API", data };
    } else {
      const errorText = await response.text();
      console.error(`Error en respuesta API (${response.status}): ${errorText}`);
      return {
        success: false,
        message: `Error en la respuesta: ${response.status} ${response.statusText}`,
        details: errorText
      };
    }
  } catch (error) {
    console.error("Error al conectar con la API:", error);
    return {
      success: false,
      message: `Error de conexión: ${error.message}`,
      details: error.toString()
    };
  }
}

export { GamesAPI as G, StreamersAPI as S, testAPIConnection as t };
