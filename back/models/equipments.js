const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
const config = require('../DB');
const connection = mongoose.createConnection(config.DB, { useNewUrlParser: true });

mongoose.set('useCreateIndex', true);
autoIncrement.initialize(connection);

// Equipements models
var Equipements = new Schema ({
    item: {
        type: String
    }
},{
    collection: 'equipements'
});
Equipements.plugin(autoIncrement.plugin, 'Equipements');
module.exports = mongoose.model('Equipements', Equipements);
