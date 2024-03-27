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

// format data
const formatData = (data) => {
    try{
        let sendData = {
            success: true,
            attendedContestsCount: data.userContestRanking.attendedContestsCount,
            rating: data.userContestRanking.rating,

            // totalSolved: data.matchedUser.submitStats.acSubmissionNum[0].count,
            // totalSubmissions: data.matchedUser.submitStats.totalSubmissionNum,
            // totalQuestions: data.allQuestionsCount[0].count,
            // easySolved: data.matchedUser.submitStats.acSubmissionNum[1].count,
            // totalEasy: data.allQuestionsCount[1].count,
            // mediumSolved: data.matchedUser.submitStats.acSubmissionNum[2].count,
            // totalMedium: data.allQuestionsCount[2].count,
            // hardSolved: data.matchedUser.submitStats.acSubmissionNum[3].count,
            // totalHard: data.allQuestionsCount[3].count,
            // ranking: data.matchedUser.profile.ranking,
            // contributionPoint: data.matchedUser.contributions.points,
            // reputation: data.matchedUser.profile.reputation,
            // submissionCalendar: JSON.parse(data.matchedUser.submissionCalendar),
        };
        return sendData;
    }
    catch(err){
        return {
            success: false
        };
    }
};

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
