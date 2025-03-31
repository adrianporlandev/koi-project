import axios from "axios";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

// Configurar Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Configurar credenciales de Twitch
const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const STREAMERS = [
  "ibai", "knekro", "reventxz", "tvander", "pandarina", 
  "pausenapii", "karchez", "skain", "sergiofferra", "jaimemellado_", 
  "rodenasink", "riopaser", "pokealexvgc", "suja", "perxitaa", "theakaleina",
];

// Función para obtener el token de acceso de Twitch
async function getTwitchToken() {
  const res = await axios.post("https://id.twitch.tv/oauth2/token", null, {
    params: {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "client_credentials",
    },
  });
  return res.data.access_token;
}

// Ajustar la secuencia para que siga después del último ID registrado
async function resetSequence() {
  const { data, error } = await supabase
    .from("stats")
    .select("id")
    .order("id", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error obteniendo el último ID:", error.message);
    return;
  }

  const lastId = data.length > 0 ? data[0].id : 2790; // Si no hay datos, empezar desde 2790

  const { error: sequenceError } = await supabase.rpc("setval", {
    seq_name: "stats_id_seq",
    seq_value: lastId + 1,
  });

  if (sequenceError) {
    console.error("Error al ajustar la secuencia:", sequenceError.message);
  }
}

// Función para obtener los streamers activos y guardarlos en Supabase
async function fetchStreamers() {
  try {
    const token = await getTwitchToken();
    const headers = { "Client-ID": CLIENT_ID, Authorization: `Bearer ${token}` };

    // Obtener IDs de los streamers
    const usersRes = await axios.get("https://api.twitch.tv/helix/users", {
      headers,
      params: { login: STREAMERS },
    });
    const userIds = usersRes.data.data.map(user => user.id);

    if (userIds.length === 0) {
      console.log("No se encontraron IDs de streamers.");
      return;
    }

    // Obtener datos de streams activos
    const streamsRes = await axios.get("https://api.twitch.tv/helix/streams", {
      headers,
      params: { user_id: userIds },
    });

    if (streamsRes.data.data.length === 0) {
      console.log("No hay streams activos.");
      return;
    }

    // Asegurar que la secuencia esté ajustada antes de insertar
    await resetSequence();

    // Insertar datos en Supabase sin especificar `id`
    const streamData = streamsRes.data.data.map(stream => ({
      streamer_name: stream.user_name,
      viewers_count: stream.viewer_count,
      title: stream.title,
      game: stream.game_name,
      started_at: stream.started_at,
      snapshot_at: new Date().toLocaleString("sv-SE", { timeZone: "Europe/Madrid" }),
    }));

    const { error } = await supabase.from("stats").insert(streamData);

    if (error) throw error;

    console.log("Datos actualizados correctamente.");
  } catch (error) {
    console.error("Error al obtener datos de streamers:", error.message);
  }
}

// Ejecutar cada 5 minutos
setInterval(fetchStreamers, 5 * 60 * 1000);
fetchStreamers(); // Llamada inicial
