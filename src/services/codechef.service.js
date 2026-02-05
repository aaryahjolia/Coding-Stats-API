const axios = require('axios');
const { JSDOM } = require('jsdom');
const config = require('../config');

exports.fetchData = async (handle) => {
    try {
        const { data } = await axios.get(`${config.PLATFORMS.CODECHEF}/${handle}`);
        const dom = new JSDOM(data);
        const document = dom.window.document;

        return {
            userAvatar: document.querySelector('.user-details-container')?.children[0]?.children[0]?.src || '',
            userName: document.querySelector('.user-details-container')?.children[0]?.children[1]?.textContent || handle,
            currentRating: parseInt(document.querySelector(".rating-number")?.textContent) || 0,
            highestRating: parseInt(document.querySelector(".rating-number")?.parentNode?.children[4]?.textContent?.split('Rating')[1]) || 0,
            countryFlag: document.querySelector('.user-country-flag')?.src || "none",
            countryName: document.querySelector('.user-country-name')?.textContent || "none",
            isStudentorProfessional: document.querySelector('.user-details')?.children[0]?.children[2]?.children[1]?.textContent || "Unknown",
            institutionName: document.querySelector('.user-details')?.children[0]?.children[3]?.children[1]?.textContent || "Unknown",
            totalContestParticipated: parseInt(document.querySelector('.contest-participated-count')?.children[0]?.textContent) || 0,
            globalRank: parseInt(document.querySelector('.rating-ranks')?.children[0]?.children[0]?.children[0]?.children[0]?.innerHTML) || "Inactive",
            countryRank: parseInt(document.querySelector('.rating-ranks')?.children[0]?.children[1]?.children[0]?.children[0]?.innerHTML) || "Inactive",
            stars: document.querySelector('.rating')?.textContent || "unrated",
            allProblemsSolved: Array.from(document.querySelectorAll('.rating-data-section.problems-solved h3')).map(element => parseInt(element.textContent.match(/\d+/))),
        };
    } catch (error) {
        throw new Error("Username not found on CodeChef");
    }
};
