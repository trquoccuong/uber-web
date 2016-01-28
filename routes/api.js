"use strict";
var express = require("express");
var router = express.Router();
var config = require("../config");
var request = require("request");

router.post("/autocomplete", function (req, res) {
    var location = encodeURIComponent(req.body.location);
    var googleURL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${location}&types=address&location=HaNoi&language=vi&key=${config.apiKey}`;
    request.get(googleURL, function (err, response, body) {
        res.json(body);
    });
});
router.post("/distance", function (req, res) {
    var location = encodeURIComponent(req.body.location);
    var destination = encodeURIComponent(req.body.destination);
    var googleURL = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${location}&destinations=${destination}&key=${config.apiKey}`;
    request.get(googleURL, function (err, response, body) {
        body = JSON.parse(body);
        if (body && body.rows && body.rows[0] && body.rows[0].elements) {
            res.json(body.rows[0].elements);
        } else {
            res.json();
        }
    });
});

module.exports = router;