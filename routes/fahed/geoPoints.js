var express = require("express");
var router = express.Router();

const {orderByDistance}= require('geolib')

router.post('/',async (req, res)=>{
    // let order = orderByDistance({ latitude: 36.7948624, longitude: 10.0732373 }, [
    //     { latitude: 35.8283295, longitude: 10.5830349 },
    //     { latitude: 33.9186755, longitude: 8.084821 },
    //     { latitude: 35.504731, longitude: 11.0345474 },
    // ])
    let order = await orderByDistance(req.body.start, req.body.points)
    numberPoints = order.length
    let points = {
        start : req.body.start,
        waypoints : order
    }
    res.send(points)
})

module.exports = router;