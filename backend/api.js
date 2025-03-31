import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { 
  getStreamerByName, 
  getAllStreamers, 
  getTopStreamers, 
  getStreamerByCategory, 
  getStreamersByDateRange,
  getActiveStreamers,
  getAverageViewers,
  getStreamerHistoryByName,
  getStreamingSessions,
  getGameStats,
  getLatestStats
} from './src/db/dbQueries.js';

dotenv.config();
const app = express();
app.use(cors());

// Endpoint para obtener datos de un streamer por nombre
app.get('/api/streamers/:name', async (req, res) => {
  const name = req.params.name;
  try {
    const rows = await getStreamerByName(name);
    res.json(rows);
  } catch (error) {
    console.error('Error en consulta para streamer:', error);
    res.status(500).json({ error: 'Error al obtener los datos del streamer' });
  }
});

// Endpoint para obtener todos los streamers
app.get('/api/streamers', async (req, res) => {
  try {
    const rows = await getAllStreamers();
    res.json(rows);
  } catch (error) {
    console.error('Error en consulta de todos los streamers:', error);
    res.status(500).json({ error: 'Error al obtener la lista de streamers' });
  }
});

// Endpoint para obtener los top streamers (opcionalmente con parámetro limit)
app.get('/api/streamers/top', async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  try {
    const rows = await getTopStreamers(limit);
    res.json(rows);
  } catch (error) {
    console.error('Error en consulta de top streamers:', error);
    res.status(500).json({ error: 'Error al obtener los top streamers' });
  }
});

// Endpoint para obtener streamers por categoría
app.get('/api/streamers/category/:category', async (req, res) => {
  const category = req.params.category;
  try {
    const rows = await getStreamerByCategory(category);
    res.json(rows);
  } catch (error) {
    console.error('Error en consulta por categoría:', error);
    res.status(500).json({ error: 'Error al obtener los streamers por categoría' });
  }
});

// Endpoint para obtener streamers en un rango de fechas
app.get('/api/streamers/daterange', async (req, res) => {
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'Se requieren startDate y endDate.' });
  }
  try {
    const rows = await getStreamersByDateRange(startDate, endDate);
    res.json(rows);
  } catch (error) {
    console.error('Error en consulta por rango de fechas:', error);
    res.status(500).json({ error: 'Error al obtener los streamers por rango de fechas' });
  }
});

// Endpoint para obtener streamers activos
app.get('/api/streamers/active', async (req, res) => {
  try {
    const rows = await getActiveStreamers();
    res.json(rows);
  } catch (error) {
    console.error('Error en consulta de streamers activos:', error);
    res.status(500).json({ error: 'Error al obtener los streamers activos' });
  }
});

// Endpoint para obtener la media de viewers de un streamer
app.get('/api/streamers/:name/average', async (req, res) => {
  const name = req.params.name;
  try {
    const rows = await getAverageViewers(name);
    res.json(rows);
  } catch (error) {
    console.error('Error en consulta de media de viewers:', error);
    res.status(500).json({ error: 'Error al obtener la media de viewers' });
  }
});

// Endpoint para obtener el historial de un streamer (agrupado por hora)
app.get('/api/streamers/:name/history', async (req, res) => {
  const name = req.params.name;
  try {
    const rows = await getStreamerHistoryByName(name);
    res.json(rows);
  } catch (error) {
    console.error('Error en consulta del historial del streamer:', error);
    res.status(500).json({ error: 'Error al obtener el historial del streamer' });
  }
});

// Endpoint para obtener sesiones de streaming agrupadas por día y juego
app.get('/api/sessions', async (req, res) => {
  try {
    const rows = await getStreamingSessions();
    res.json(rows);
  } catch (error) {
    console.error('Error en consulta de sesiones de streaming:', error);
    res.status(500).json({ error: 'Error al obtener las sesiones de streaming' });
  }
});

// Endpoint para obtener estadísticas globales por juego
app.get('/api/games', async (req, res) => {
  try {
    const rows = await getGameStats();
    res.json(rows);
  } catch (error) {
    console.error('Error en consulta de estadísticas de juegos:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas de juegos' });
  }
});

// Endpoint para obtener los últimos registros insertados
app.get('/api/latest', async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : 5;
  try {
    const rows = await getLatestStats(limit);
    res.json(rows);
  } catch (error) {
    console.error('Error en consulta de últimos registros:', error);
    res.status(500).json({ error: 'Error al obtener los últimos registros' });
  }
});

app.listen(3001, () => {
  console.log('Servidor escuchando en el puerto 3001');
});