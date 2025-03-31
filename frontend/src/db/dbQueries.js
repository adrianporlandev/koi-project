import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Inicializa el cliente de Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Obtiene datos de un streamer por nombre
export async function getStreamerByName(name) {
  const { data, error } = await supabase
    .from('stats')
    .select('*')
    .eq('streamer_name', name);
  if (error) throw error;
  return data;
}

// Obtiene todos los streamers
export async function getAllStreamers() {
  const { data, error } = await supabase
    .from('stats')
    .select('*');
  if (error) throw error;
  return data;
}

// Obtiene los top streamers con un límite
export async function getTopStreamers(limit) {
  const { data, error } = await supabase
    .from('stats')
    .select('streamer_name, viewers_count, game, title')
    .order('viewers_count', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

// Obtiene streamers por juego
export async function getStreamerByCategory(game) {
  const { data, error } = await supabase
    .from('stats')
    .select('*')
    .eq('game', game);
  if (error) throw error;
  return data;
}

// Obtiene streamers en un rango de fechas
export async function getStreamersByDateRange(startDate, endDate) {
  const { data, error } = await supabase
    .from('stats')
    .select('*')
    .gte('started_at', startDate)
    .lte('started_at', endDate);
  if (error) throw error;
  return data;
}

//Obten los streamers activos los ultimos 5 minutos
export async function getActiveStreamers() {
  const { data, error } = await supabase.rpc("get_active_streamers");
  if (error) throw error;
  return data;
}

// Obtiene la media de viewers de un streamer
export async function getAverageViewers(name) {
  const { data, error } = await supabase
    .from('stats')
    .select('viewers_count')
    .eq('streamer_name', name);
  if (error) throw error;

  if (data.length === 0) return { averageViewers: 0 };

  const totalViewers = data.reduce((sum, row) => sum + row.viewers_count, 0);
  const averageViewers = totalViewers / data.length;

  return { averageViewers };
}

// Obtiene el historial de un streamer agrupado por fecha
export async function getStreamerHistoryByName(name) {
  const { data, error } = await supabase
    .from('stats')
    .select('snapshot_at, viewers_count')
    .eq('streamer_name', name)
    .order('snapshot_at', { ascending: true });
  if (error) throw error;
  return data;
}

// Obtiene sesiones de streaming agrupadas por día y juego
export async function getStreamingSessions() {
  const { data, error } = await supabase
    .from('stats')
    .select('started_at, game, viewers_count')
    .order('started_at', { ascending: true });
  if (error) throw error;
  return data;
}

// Obtiene estadísticas globales por juego
export async function getGameStats() {
  const { data, error } = await supabase
    .from('stats')
    .select('game, avg(viewers_count) as average_viewers, count(*) as sessions')
    .group('game');
  if (error) throw error;
  return data;
}

// Obtiene los últimos registros insertados
export async function getLatestStats(limit) {
  const { data, error } = await supabase
    .from('stats')
    .select('*')
    .order('snapshot_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}