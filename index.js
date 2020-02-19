const express = require('express')
const app = express()
const port = 3000
var Promise = require("bluebird");
const request = require('request');
var twitterCall = {
    url: "https://takehome.io/twitter",
    headers: {
        "Accept": "application/json"
    }
};

var instaCall = {
    url: "https://takehome.io/instagram",
    headers: {
        "Accept": "application/json"
    }
};

var fbCall = {
    url: "https://takehome.io/facebook",
    headers: {
        "Accept": "application/json"
    }
};

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
async function getAll(res) {
    let twitter = await getRemoteData(twitterCall);
    let facebook = await getRemoteData(fbCall);
    let instagram = await getRemoteData(instaCall);
    res.send({ "twitter": twitter, "facebook": facebook, "instagram": instagram });
}
app.get("/", async function(req, res) {

    var ok = false
    var counter = 1;
    while (!ok) {
        try {
            await getAll(res);
            ok = true
            counter = 1
            console.log("**********************");
        } catch (err) {
            console.log(" Try# :" + counter)
            counter++;
            //console.log("Error occured in one of the API call: ", err);
        };
    }
});


app.listen(port, () => console.log(`Awesome app listening on port ${port}!`));