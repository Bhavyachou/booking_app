const express = require('express');
const RoomsRoutes = express.Router();

// Require Item model in our routes module
const Rooms = require('../models/rooms');
const Equipements = require('../models/equipements');
const Booking = require('../models/booking');
const moment = require('moment');
var fs = require('fs');

function generateJson(item) {
    Booking.find({_id: item._id})
        .populate({
            path: 'room_id',
            populate: { path: "equipements.reference"}
        })
        .exec(function (err, book) {
            if (err) {
                console.log(err);
            }
            else {
                var json = book;
                fs.writeFile('server/JSON/'+ item._id+'.json', json, { flag: 'w' }, function(err) {
                        if (err) throw err;
                        console.log('complete');
                    }
                );
            }
        });
}

RoomsRoutes.route('/').get(function (req, res) {
    Rooms.find()
        .sort('name')
        .exec(function (err, room) {
            if (err) {
                console.log(err);
            }
            else {
                res.json(room);
            }
        });
});

RoomsRoutes.route('/search').post(function (req, res) {
    let body = req.body;
    let criteria = {};
    if (body.equipements.length > 0)
        criteria = {"equipements.reference":  { $all: body.equipements } };
    if (body.capacity != null)
        criteria.capacity = { $gte: body.capacity};
    let datestart = moment(body.date.slice(0,10) + ' ' + body.start, 'YYYY-MM-DD HH:mm').toDate();
    let dateend = moment(body.date.slice(0,10) + ' ' + body.end, 'YYYY-MM-DD HH:mm').toDate();
    Rooms.find(criteria)
        .populate("equipements.reference")
        .exec(function (err, room) {
            if (err) {
                console.log(err);
            }
            else {
                let arr = [];
                let updates = [];
                room.forEach(function (r) {
                    let updatePromise = Booking.find({room_id: r._id,$or: [ { "reserved.from":   {$gte: datestart, $lte: dateend}},{ "reserved.to":  {$gte: datestart, $lte: dateend}}]});
                    updates.push(updatePromise);
                });

                Promise.all(updates).then(function (results) {
                    results.filter(function (el) {
                        if (el.length > 0)
                        {
                            for (var i=0; i < room.length; i++) {
                                if (room[i]._id === el[0].room_id) {
                                   room.splice(i, 1)
                                }
                            }
                        }
                        return el;
                    });
                    res.json(room);
                });
            }
        });
});

RoomsRoutes.route('/booking/add').post(function (req, res) {
    let body = req.body;
    let datestart = moment(body.date.slice(0,10) + ' ' + body.start, 'YYYY-MM-DD HH:mm').format();
    let dateend = moment(body.date.slice(0,10) + ' ' + body.end, 'YYYY-MM-DD HH:mm').format();

    let book = new Booking();
    book.room_id = body.room_id;
    book.reserved = {
        to: datestart,
        from: dateend
    };
    Booking.find({room_id: book.room_id,$or: [ { "reserved.from":   {$gte: datestart, $lte: dateend}},{ "reserved.to":  {$gte: datestart, $lte: dateend}}]})
        .exec(function(err, item) {
           if (item.length === 0)
           {
               book.save()
                   .then(function(item){
                       generateJson(item);
                       res.status(200).json({'success': true});
                   })
                   .catch(function(err) {
                       res.status(200).json({'success': false});
                   });
           }
           else
           {
               res.status(200).json({'success': false});
           }
        });
});

module.exports = RoomsRoutes;
