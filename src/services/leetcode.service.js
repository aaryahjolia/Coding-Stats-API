const axios = require('axios');
const config = require('../config');

const query = `
query getUserProfile($username: String!, $limit: Int!, $year: Int) {
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      totalParticipants
      topPercentage
      badge {
        name
      }
    }
    matchedUser(username: $username) {
      userCalendar(year: $year) {
        activeYears
        streak
        totalActiveDays
      }
      languageProblemCount {
        languageName
        problemsSolved
      }
      username
      githubUrl
      twitterUrl
      linkedinUrl
      contributions {
        points
      }
      profile {
        reputation
        ranking
        userAvatar
        realName
        aboutMe
        school
        websites
        countryName
        company
        jobTitle
        skillTags
        postViewCount
        postViewCountDiff
        reputation
        reputationDiff
        solutionCount
        solutionCountDiff
        categoryDiscussCount
        categoryDiscussCountDiff
      }
      submitStats {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      }
      tagProblemCounts {
        advanced {
          tagName
          tagSlug
          problemsSolved
        }
        intermediate {
          tagName
          tagSlug
          problemsSolved
        }
        fundamental {
          tagName
          tagSlug
          problemsSolved
        }
      }
    }
    allQuestionsCount {
      difficulty
      count
    }
    recentAcSubmissionList(username: $username, limit: $limit) {
      id
      title
      titleSlug
      timestamp
    }
  }
`;

exports.fetchData = async (handle) => {
    try {
        const { data } = await axios.post(config.PLATFORMS.LEETCODE, {
            query: query,
            variables: {
                username: handle,
                limit: 5,
                year: new Date().getFullYear()
            },
        }, {
            headers: {
                "Content-Type": "application/json",
                Referer: "https://leetcode.com",
            }
        });

        if (data.errors) {
            throw new Error("Username not found on LeetCode");
        }

        return data;
    } catch (error) {
        throw new Error(error.message || "Error fetching data from LeetCode");
    }
};
