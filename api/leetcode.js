export default async function handler(req, res) {
  const username = "vishnupriyan_34";

  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(
      "https://leetcode.com/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query,
          variables: {
            username
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error("LeetCode API request failed");
    }

    const result = await response.json();

    const stats =
      result?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum;

    if (!stats) {
      throw new Error("LeetCode statistics not found");
    }

    const formattedStats = {};

    stats.forEach((item) => {
      formattedStats[item.difficulty] = item.count;
    });

    return res.status(200).json({
      totalSolved: formattedStats.All || 0,
      easySolved: formattedStats.Easy || 0,
      mediumSolved: formattedStats.Medium || 0,
      hardSolved: formattedStats.Hard || 0
    });

  } catch (error) {
    console.error("LeetCode API Error:", error);

    return res.status(500).json({
      error: "Failed to fetch LeetCode statistics"
    });
  }
}
