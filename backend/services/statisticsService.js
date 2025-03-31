import * as statisticsQueries from "../queries/statisticsQueries.js"

export const getAllStats = async (limit) => {
  return await statisticsQueries.getAllStats(limit)
}

export const getStatsByDateRange = async (startDate, endDate) => {
  if (!startDate || !endDate) {
    throw new Error("Both start_date and end_date are required")
  }

  return await statisticsQueries.getStatsByDateRange(startDate, endDate)
}

export const getLatestStats = async () => {
  return await statisticsQueries.getLatestStats()
}

export const addStats = async (statsData) => {
  // Validation
  if (!statsData.streamer_name || !statsData.viewers_count || !statsData.game) {
    throw new Error("Missing required fields: streamer_name, viewers_count, and game are required")
  }

  return await statisticsQueries.addStats(statsData)
}

export const getStreamerStats = async (streamerName, timeRange) => {
  if (!streamerName || !timeRange) {
    throw new Error("Both streamerName and timeRange are required");
  }

  const validRanges = ["7d", "1m", "3m", "all"];
  if (!validRanges.includes(timeRange)) {
    throw new Error(`Invalid timeRange. Valid options are: ${validRanges.join(", ")}`);
  }

  return await statisticsQueries.getStreamerStats(streamerName, timeRange);
};

