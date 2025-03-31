import express from "express";
import * as statisticsService from "../services/statisticsService.js";
import { authMiddleware, optionalAuthMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply optional auth to GET routes
router.get("*", optionalAuthMiddleware);

// Get all statistics
router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    const stats = await statisticsService.getAllStats(limit);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get statistics by date range
router.get("/date-range", async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    try {
      const stats = await statisticsService.getStatsByDateRange(start_date, end_date);
      res.json(stats);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get latest statistics
router.get("/latest", async (req, res) => {
  try {
    const stats = await statisticsService.getLatestStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Apply auth middleware to POST routes
router.post("*", authMiddleware);

// Add new statistics
router.post("/", async (req, res) => {
  try {
    try {
      const newStats = await statisticsService.addStats(req.body);
      res.status(201).json(newStats);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
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

