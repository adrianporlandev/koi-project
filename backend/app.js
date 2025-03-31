import express from "express"
import cors from "cors"
import dotenv from "dotenv"

// Import routes
import streamerRoutes from "./routes/streamers.js"
import gameRoutes from "./routes/games.js"
import statisticsRoutes from "./routes/statistics.js"

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(
  cors({
    // Permitir solicitudes desde cualquier origen en desarrollo
    origin: "*",
    // O especificar orígenes permitidos:
    // origin: ['http://localhost:3000', 'http://localhost:4321'],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

app.use(express.json())

// Log requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
  next()
})

// Routes
app.use("/api/streamers", streamerRoutes)
app.use("/api/games", gameRoutes)
app.use("/api/stats", statisticsRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    message: "API funcionando correctamente",
    version: "1.0.0",
    table_name: "stats", // Nombre correcto de la tabla
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Internal server error", details: err.message })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app

