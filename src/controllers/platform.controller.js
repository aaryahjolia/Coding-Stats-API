const codechefService = require('../services/codechef.service');
const gfgService = require('../services/gfg.service');
const codeforcesService = require('../services/codeforces.service');
const leetcodeService = require('../services/leetcode.service');

exports.getPlatformData = async (req, res, next) => {
    const { platform, handle } = req.params;

    try {
        let data;
        switch (platform.toLowerCase()) {
            case 'codechef':
                data = await codechefService.fetchData(handle);
                break;
            case 'geeksforgeeks':
                data = await gfgService.fetchData(handle);
                break;
            case 'codeforces':
                data = await codeforcesService.fetchData(handle);
                break;
            case 'leetcode':
                data = await leetcodeService.fetchData(handle);
                break;
            default:
                return res.status(400).send({
                    success: false,
                    error: 'Invalid platform name!'
                });
        }

        res.status(200).send({
            success: true,
            ...data
        });
    } catch (error) {
        next(error);
    }
};
