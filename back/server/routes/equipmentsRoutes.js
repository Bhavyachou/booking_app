const express = require('express');
const EquipementsRoutes = express.Router();

// Require Item model in our routes module
const Equipements = require('../models/equipements');

EquipementsRoutes.route('/').get(function (req, res) {
    Equipements.find()
        .sort('item')
        .exec(function (err, equip) {
            if (err) {
                console.log(err);
            }
            else {
                res.json(equip);
            }
        });
});

module.exports = EquipementsRoutes;
