import express from "express"
import * as streamerService from "../services/streamerService.js"
import { optionalAuthMiddleware } from "../middlewares/authMiddleware.js"

const router = express.Router()

// Apply optional auth to all routes
router.use(optionalAuthMiddleware)

// Get all streamers
router.get("/", async (req, res) => {
  try {
    const { limit } = req.query
    const streamers = await streamerService.getAllStreamers(limit)
    res.json(streamers)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get top streamers
router.get("/top", async (req, res) => {
  try {
    const { limit = 10 } = req.query
    const topStreamers = await streamerService.getTopStreamers(limit)
    res.json(topStreamers)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get streamer by name
router.get("/:name", async (req, res) => {
  try {
    const { name } = req.params
    const streamer = await streamerService.getStreamerByName(name)
    res.json(streamer)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get streamer growth
router.get("/:name/growth", async (req, res) => {
  try {
    const { name } = req.params
    const { days = 7 } = req.query
    const growth = await streamerService.getStreamerGrowth(name, days)
    res.json(growth)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get all streamers growth
router.get("/growth/all", async (req, res) => {
  try {
    const { days = 7 } = req.query
    const growth = await streamerService.getAllStreamersGrowth(days)
    res.json(growth)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get advanced statistics for a streamer
router.get("/:name/advanced-stats", async (req, res) => {
  try {
    const { name } = req.params
    const { time_range = "7d" } = req.query

    // Validar el rango de tiempo
    const validRanges = ["7d", "1m", "3m", "all"]
    if (!validRanges.includes(time_range)) {
      return res.status(400).json({
        error: "Invalid time range. Valid values are: 7d, 1m, 3m, all",
      })
    }

    const stats = await streamerService.getStreamerAdvancedStats(name, time_range)
    res.json(stats)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router

