const axios = require('axios');
const jsdom = require("jsdom");
const express = require('express')
const app = express();
const { JSDOM } = jsdom;

// Check for user 'af' to test for new users
let leet = require('./Platforms/leetcode');
// https://github.com/akarsh1995/leetcode-graphql-queries/tree/main

app.get('/leetcode/:handle', leet.leetcode);

app.get('/:platform/:handle', async (req, res) => {
    // console.log(req.params.platform);
    // console.log(req.params.handle);
    // console.log(req.headers.host);
    
    try{
        if(req.params.platform.toLowerCase() === "codechef"){
            try {
                let data = await axios.get(`https://www.codechef.com/users/${req.params.handle}`);
                let dom = new JSDOM(data.data);
                let document = dom.window.document;
                
                res.status(200).send({
                    // Test on this user (New account): sanjanas
                    success: true,

                    userAvatar: document.querySelector('.user-details-container').children[0].children[0].src,

                    userName: document.querySelector('.user-details-container').children[0].children[1].textContent,

                    currentRating: parseInt(document.querySelector(".rating-number").textContent) || "0",

                    highestRating: parseInt(document.querySelector(".rating-number").parentNode.children[4].textContent.split('Rating')[1]),

                    countryFlag: document.querySelector('.user-country-flag').src || "none",

                    countryName: document.querySelector('.user-country-name').textContent || "none",

                    isStudentorProfessional: document.querySelector('.user-details').children[0].children[2].children[1].textContent,

                    institutionName: document.querySelector('.user-details').children[0].children[3].children[1].textContent,

                    totalContestParticipated: parseInt(document.querySelector('.contest-participated-count').children[0].textContent),

                    globalRank: parseInt(document.querySelector('.rating-ranks').children[0].children[0].children[0].children[0].innerHTML) || "Inactive" ,

                    countryRank: parseInt(document.querySelector('.rating-ranks').children[0].children[1].children[0].children[0].innerHTML) || "Inactive",

                    stars: document.querySelector('.rating').textContent || "unrated",
                    
                    // Returns an int array in order of solved problems of: Practice problems, contest, learning path, practice path. Last entry will be null of Contributions, ignore that
                    allProblemsSolved:  Array.from(document.querySelectorAll('.rating-data-section.problems-solved h3')).map(element => parseInt(element.textContent.match(/\d+/))),
                    
                    // SubmissionInOrder:  Array.from(document.getElementsByClassName("highcharts-text-outline")).map(element => element.textContent),
                    
                });
            } catch (err) {
                res.send({ 
                    success: false, 
                    error: err,
                    message: "Username not found"
                });
            }
        }
        else if(req.params.platform.toLowerCase() === "geeksforgeeks"){
            try {
                let data = await axios.get(`https://auth.geeksforgeeks.org/user/${req.params.handle}/practice`);
                let dom = new JSDOM(data.data);
                let document = dom.window.document;
                
                res.status(200).send({
                    // Test on this user (New account): 
                    success: true,

                    instituteRank: document.querySelector('.rankNum').children[0].textContent,

                    instituteNameAndLanguagesUsed: Array.from(document.querySelectorAll('.basic_details_data')).map(e => e.textContent),
                    
                    ocsAndtpsAndmcs: Array.from(document.querySelectorAll('.score_card_value')).map(e => parseInt(e.textContent)),

                    streak: parseInt(document.querySelector('.streakCnt.tooltipped').textContent.split('/')),
                    
                    totalStreakDays: parseInt(document.querySelector('.streakCnt.tooltipped').textContent.split('/')[1]),

                    // Returns array with problems solved according to this order: School, basic ,easy, medium, hard
                    allProblemsSolved:  Array.from(document.querySelectorAll('.tabs.tabs-fixed-width.linksTypeProblem li a')).map(element => parseInt(element.textContent.match(/\d+/))),

                });
            } catch (err) {
                res.send({ 
                    success: false, 
                    error: err,
                    message: "Username not found"
                });
            }
        }
        else if(req.params.platform.toLowerCase() === "codeforces"){
            try {
                // https://codeforces.com/api/{methodName}
                let userInfo = await axios.get(`https://codeforces.com/api/user.info?handles=${req.params.handle}`);
                let userRatingChange = await axios.get(`https://codeforces.com/api/user.rating?handle=${req.params.handle}`);
                userInfo = userInfo.data;
                userRatingChange = userRatingChange.data;
                
                res.status(200).send({
                    success: true,
                    userInfo: userInfo,
                    userRatingChange: userRatingChange
                });
            } catch (err) {
                res.send({ 
                    success: false, 
                    error: err,
                    message: "Username not found"
                });
            }
        }
        else{
            throw new Error("Platform name is invalid!")
        }
    }
    catch (err){
        res.send({ 
            success: false, 
            error: err.message,
        });
    }

    
})

app.get('/', (req, res) => {
    res.status(200).send("Home Page of API");
})

const PORT = process.env.PORT || 8800;
app.listen(PORT, ()=>{
    console.log(`App is running at port ${PORT}!`);
});