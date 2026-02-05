module.exports = {
    PORT: process.env.PORT || 8800,
    PLATFORMS: {
        CODECHEF: 'https://www.codechef.com/users',
        GEEKSFORGEEKS: 'https://www.geeksforgeeks.org/profile',
        CODEFORCES: {
            USER_INFO: 'https://codeforces.com/api/user.info',
            USER_RATING: 'https://codeforces.com/api/user.rating'
        },
        LEETCODE: 'https://leetcode.com/graphql'
    },
    CACHE_TTL: 3600 // 1 hour in seconds
};
