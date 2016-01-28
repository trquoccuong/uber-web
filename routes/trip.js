var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/trips', function (req, res) {
    if (req.isAuthenticated()) {
        var newTrip = new Trip();
        newTrip.passenger_id = req.user._id;
        newTrip.location = req.body.location;
        newTrip.destination = req.body.destination;
        newTrip.distance = req.body.distance;
        newTrip.duration = req.body.duration;
        newTrip.price = req.body.price;
        newTrip.status = "finding";
        newTrip.save(function (err,data) {
            if (err) {
                res.json({message: "You cant make trip"});
            } else {
                res.json({trip : data._id});
            }
        })
    } else {
        res.json({message: "You must login"});
    }


});

module.exports = router;
