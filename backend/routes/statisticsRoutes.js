import express from "express";
import * as statisticsService from "../services/statisticsService.js";

const router = express.Router();

router.get("/stats", async (req, res) => {
  const { limit } = req.query;

  try {
    const stats = await statisticsService.getAllStats(limit);
    res.status(200).json(stats);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/stats/date-range", async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const stats = await statisticsService.getStatsByDateRange(startDate, endDate);
    res.status(200).json(stats);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/stats/latest", async (req, res) => {
  try {
    const stats = await statisticsService.getLatestStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/stats", async (req, res) => {
  const statsData = req.body;

  try {
    const newStats = await statisticsService.addStats(statsData);
    res.status(201).json(newStats);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Nueva ruta para obtener estadísticas de un streamer
router.get("/streamers/:streamerName/stats", async (req, res) => {
  const { streamerName } = req.params;
  const { timeRange } = req.query;

  try {
    const stats = await statisticsService.getStreamerStats(streamerName, timeRange);
    res.status(200).json(stats);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;