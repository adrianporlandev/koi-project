import supabase from "../utils/supabaseClient.js"

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "No token provided" })
  }

  try {
    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) {
      return res.status(401).json({ error: "Invalid or expired token" })
    }

    req.user = data.user
    next()
  } catch (error) {
    return res.status(500).json({ error: "Authentication error" })
  }
}

// Optional middleware for routes that can be accessed with or without authentication
export const optionalAuthMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]

  if (!token) {
    return next()
  }

  try {
    const { data } = await supabase.auth.getUser(token)
    if (data?.user) {
      req.user = data.user
    }
    next()
  } catch (error) {
    next()
  }
}

