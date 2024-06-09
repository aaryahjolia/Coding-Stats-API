// Contest History Query
const historyQuery = `
querygetUserProfile($username: String!) {
  userContestRankingHistory(username: $username) {
    attended
    trendDirection
    problemsSolved
    totalProblems
    finishTimeInSeconds
    rating
    ranking
    contest {
      title
      startTime
    }
  }
}
`

//graphql query
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

//fetching the data
exports.leetcode = (req, res) => {
    let user = req.params.handle;
    fetch("https://leetcode.com/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Referer: "https://leetcode.com",
        },
        body: JSON.stringify({
            query: query,
            variables: {
                username: user,
                limit: 5,
                year: 2024
            },
        }),
    })
        .then((result) => result.json())
        .then((data) => {
            if (data.errors) {
                res.send({
                    success: false
                });
            } else {
                res.send(data);
            }
        })
        .catch((err) => {
            console.error("Error", err);
            res.send(err);
        });
};
