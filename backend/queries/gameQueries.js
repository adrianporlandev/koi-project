import supabase from "../utils/supabaseClient.js"

// Corregido: nombre de tabla correcto
const TABLE_NAME = "stats"

export const getGames = async (limit = 100) => {
  const { data, error } = await supabase.from(TABLE_NAME).select("game").order("game").limit(limit)

  if (error) throw error

  // Remove duplicates
  const uniqueGames = [...new Set(data.map((item) => item.game))].filter(Boolean)
  return uniqueGames.map((game) => ({ game }))
}

export const getGameByName = async (name) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .ilike("game", `%${name}%`)
    .order("snapshot_at", { ascending: false })

  if (error) throw error
  return data
}

export const getTopGames = async (limit = 10) => {
  const { data, error } = await supabase.rpc("get_top_games", { limit_count: limit });
  
  if (error) throw error;
  
  return data || [];
}

