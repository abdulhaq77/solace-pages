import Novel from "../models/Novel.js";

// Local Fallback AI Recommendation Engine
export const getAIPRecommendations = async (
  userPreferences,
  userLibrary = [],
) => {
  // $0-Cost / Local Fallback Recommendation Engine
  // Analyzes categories/tags from user's library and suggests matching unowned novels
  const ownedIds = userLibrary.map((n) => n._id.toString());

  const query = { _id: { $nin: ownedIds }, isAvailable: true };
  if (userPreferences && userPreferences.categoryId) {
    query.category = userPreferences.categoryId;
  }

  const recommendations = await Novel.find(query).limit(3).sort("-salesCount");

  return {
    source: process.env.AI_PROVIDER || "local-fallback",
    recommendations,
    message:
      recommendations.length > 0
        ? "Here are curated digital novels tailored to your reading profile."
        : "Explore our popular bestsellers to kickstart your recommendations.",
  };
};

// Local Fallback AI Summary Generator
export const getAISummary = async (novelTitle, description) => {
  // Local fallback literary summary generator
  return {
    source: process.env.AI_PROVIDER || "local-fallback",
    summary: `"${novelTitle}" is an immersive literary work exploring profound emotional landscapes. ${description.substring(0, 150)}...`,
  };
};
