const express = require('express')
const app = express()
const port = 3000
    //for Promises in Expres JS
var Promise = require("bluebird");
//To fetch data from external APIs
const request = require('request');
//Call for Twitter
var twitterCall = {
    url: "https://takehome.io/twitter",
    headers: {
        "Accept": "application/json"
    }
};
//Call for Instagram
var instaCall = {
    url: "https://takehome.io/instagram",
    headers: {
        "Accept": "application/json"
    }
};
//Call for Facebook
var fbCall = {
    url: "https://takehome.io/facebook",
    headers: {
        "Accept": "application/json"
    }
};
//if call succeeds, get response
function getRemoteData(callObject) {
    return new Promise((resolve, reject) => {
        request(callObject, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                resolve(JSON.parse(body));
            }

            reject(error);
        });

    });
}
// Execute all calls ASYNC and combine data and send it to response
async function getAll(res) {
    let twitter = await getRemoteData(twitterCall);
    let facebook = await getRemoteData(fbCall);
    let instagram = await getRemoteData(instaCall);
    res.send({ "twitter": twitter, "facebook": facebook, "instagram": instagram });
}
//Entry point
app.get("/", async function(req, res) {

    //to check if call succeeds
    var ok = false
        //how many retry ?  we may keep an upper limit if required (as of now : no)
    var counter = 1;
    //keep trying
    while (!ok) {
        try {
            //await for async function
            await getAll(res);
            //if success, break lopp
            ok = true
                //and reset counter to 1
            counter = 1
            console.log("**********************");
        } catch (err) {
            console.log(" Try# :" + counter)
            counter++;
            //console.log("Error occured in one of the API call: ", err);
        };
    }
});

//Start the awesome app
app.listen(port, () => console.log(`Awesome app listening on port ${port}!`));