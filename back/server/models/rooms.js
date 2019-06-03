const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
const config = require('../DB');
const connection = mongoose.createConnection(config.DB, { useNewUrlParser: true });

mongoose.set('useCreateIndex', true);
autoIncrement.initialize(connection);

// Meeting-Room model
var Rooms = new Schema ({
    name: {
        type: String
    },
    description: {
        type: String
    },
    capacity: {
        type: Number
    },
    equipements: [{
        reference: { type: Number, ref: 'Equipements' }
    }],
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    }
},{
    collection: 'rooms'
});
Rooms.plugin(autoIncrement.plugin, 'Rooms');
module.exports = mongoose.model('Rooms', Rooms);
