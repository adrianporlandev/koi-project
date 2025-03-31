import * as gameQueries from "../queries/gameQueries.js"

export const getAllGames = async (limit) => {
  return await gameQueries.getGames(limit)
}

export const getGameByName = async (name) => {
  return await gameQueries.getGameByName(name)
}

export const getTopGames = async (limit) => {
  return await gameQueries.getTopGames(limit)
}

