import express from "express"
import * as gameService from "../services/gameService.js"
import { optionalAuthMiddleware } from "../middlewares/authMiddleware.js"

const router = express.Router()

// Apply optional auth to all routes
router.use(optionalAuthMiddleware)

// Get all games
router.get("/", async (req, res) => {
  try {
    const { limit } = req.query
    const games = await gameService.getAllGames(limit)
    res.json(games)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get top games
router.get("/top", async (req, res) => {
  try {
    const { limit = 10 } = req.query
    const topGames = await gameService.getTopGames(limit)
    res.json(topGames)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get game by name
router.get("/:name", async (req, res) => {
  try {
    const { name } = req.params
    const game = await gameService.getGameByName(name)
    res.json(game)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router

