'use strict';
var socketIO = require('socket.io');
var listOffer ={};

module.exports = function (server) {
    var io = socketIO(server);
    io.on('connection', function (socket) {
        socket.on("subscribe", function (data) {
            socket.room = data.type;
            socket.join(data.type);
        });

        socket.on("disconnect", function () {
            socket.leave(socket.room);
        });

        socket.on("needDriver", function (data) {
            Trip.findById(data.tripId, function (err,data) {
                listOffer[data.tripId] = socket.id;
                io.to("driver").emit("newOffer",data)
            })
        });

        socket.on("acceptOffer", function (data) {
            Trip.findById(data.tripId, function (err,tripData) {
                if(tripData.status === "finding") {
                    tripData.status = "offered";
                    tripData.save(function (err) {
                        if(!err) {
                            io.to(listOffer[data.tripId]).emit("haveDriver",tripData);
                            io.to(socket.id).emit("getSuccess",tripData);
                            delete listOffer[data.tripId]
                        } else {
                            io.to(socket.id).emit("fail");
                        }
                    })
                }
            })
        })
    });
};