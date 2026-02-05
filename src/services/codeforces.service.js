const axios = require('axios');
const config = require('../config');

exports.fetchData = async (handle) => {
    try {
        const [userInfo, userRatingChange] = await Promise.all([
            axios.get(`${config.PLATFORMS.CODEFORCES.USER_INFO}?handles=${handle}`),
            axios.get(`${config.PLATFORMS.CODEFORCES.USER_RATING}?handle=${handle}`)
        ]);

        return {
            userInfo: userInfo.data,
            userRatingChange: userRatingChange.data
        };
    } catch (error) {
        throw new Error("Username not found on Codeforces");
    }
};
