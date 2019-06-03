const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
const config = require('../DB');
const connection = mongoose.createConnection(config.DB, { useNewUrlParser: true });

mongoose.set('useCreateIndex', true);
autoIncrement.initialize(connection);

// Booking models
var Booking = new Schema ({
    room_id: {
        type: Number, ref: 'Rooms'
    },
    reserved: {
        from: { type: Date },
        to: { type: Date }
    }
},{
    collection: 'booking'
});
Booking.plugin(autoIncrement.plugin, 'Booking');
module.exports = mongoose.model('Booking', Booking);
