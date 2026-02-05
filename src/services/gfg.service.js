const axios = require('axios');
const { JSDOM } = require('jsdom');
const config = require('../config');

exports.fetchData = async (handle) => {
    try {
        // 1. Fetch the main profile page (SSR content)
        const profileResponse = await axios.get(`${config.PLATFORMS.GEEKSFORGEEKS}/${handle}?tab=activity`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        });
        const data = profileResponse.data;

        // 2. Fetch the difficulty breakdown from the Practice API
        // This data is not present in the static HTML stream
        let difficultyBreakdown = {
            School: 0,
            Basic: 0,
            Easy: 0,
            Medium: 0,
            Hard: 0
        };

        try {
            const apiResponse = await axios.post('https://practiceapi.geeksforgeeks.org/api/v1/user/problems/submissions/', {
                handle: handle,
                requestType: "",
                year: "",
                month: ""
            }, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Origin': 'https://www.geeksforgeeks.org',
                    'Referer': `https://www.geeksforgeeks.org/profile/${handle}?tab=activity`
                }
            });
            console.log(apiResponse.data);

            if (apiResponse.data && apiResponse.data.result) {
                const ps = apiResponse.data.result;
                difficultyBreakdown = {
                    School: Object.keys(ps.School || {}).length,
                    Basic: Object.keys(ps.Basic || {}).length,
                    Easy: Object.keys(ps.Easy || {}).length,
                    Medium: Object.keys(ps.Medium || {}).length,
                    Hard: Object.keys(ps.Hard || {}).length
                };
            }
        } catch (apiError) {
            console.error("GFG Practice API Error:", apiError.message);
            // Fallback to 0s if API fails
        }

        // Regex helper to extract data from the raw HTML streaming scripts
        const extract = (regex) => {
            const match = data.match(regex);
            return match ? match[1] : null;
        };

        // Pinpoint stats from the SSR data
        const name = extract(/\\"userData\\":\{.*?\\"name\\":\\"(.*?)\\"/) || extract(/\\"mentor\\":\{.*?\\"name\\":\\"(.*?)\\"/);
        const score = extract(/\\"score\\":(\d+)/);
        const totalProblemsSolved = extract(/\\"total_problems_solved\\":(\d+)/);
        const instituteRank = extract(/\\"institute_rank\\":(\d+)/);
        const podSolvedLongestStreak = extract(/\\"pod_solved_longest_streak\\":(\d+)/);
        const podCorrectSubmissionsCount = extract(/\\"pod_correct_submissions_count\\":(\d+)/);
        const podSolvedCurrentStreak = extract(/\\"pod_solved_current_streak\\":(\d+)/);
        const headline = extract(/\\"headline\\":\\"(.*?)\\"/);
        const instituteName = extract(/\\"institute_name\\":\\"(.*?)\\"/);

        // Fallback to DOM for specific fields if needed
        const dom = new JSDOM(data);
        const document = dom.window.document;

        return {
            name: name || document.querySelector('h2[class*="NewProfile_name_"]')?.textContent || "",
            designation: headline || document.querySelector('div[class*="NewProfile_designation"]')?.textContent || "",
            codingScore: score || "0",
            totalProblemsSolved: totalProblemsSolved || "0",
            instituteRank: instituteRank || "0",
            instituteName: instituteName || "",
            articlesPublished: extract(/\\"total_articles_published\\":(\d+)/) || "0",
            currentStreak: podSolvedCurrentStreak || "0",
            longestStreak: podSolvedLongestStreak || "0",
            totalPOTDSolved: podCorrectSubmissionsCount || "0",
            difficultyBreakdown: difficultyBreakdown,

            // Keeping these for legacy/compatibility
            // schoolProblemsSolved: difficultyBreakdown.School.toString(),
            // basicProblemsSolved: difficultyBreakdown.Basic.toString(),
            // easyProblemsSolved: difficultyBreakdown.Easy.toString(),
            // mediumProblemsSolved: difficultyBreakdown.Medium.toString(),
            // hardProblemsSolved: difficultyBreakdown.Hard.toString(),
        };
    } catch (error) {
        console.error("GFG Service Error:", error.message);
        throw new Error("Username not found on GeeksForGeeks");
    }
};
