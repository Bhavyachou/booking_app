const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    config = require('./server/DB');

// routes
const RoomsRoutes = require('./server/routes/roomsRoutes'),
    EquipementsRoutes = require('./server/routes/equipementsRoutes');

// connection
mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true })
    .then(function(success, err){
            if (success) {
                console.log("Connection Successful");
            }
            else {
                console.log(err);
            }
        });

//init app
const app = express();
//app.use(jwtCheck);

// Parsers
app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(cors());

// routes use
app.use('/api/rooms', RoomsRoutes);
app.use('/api/equipements', EquipementsRoutes);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static('public'));

const port = process.env.PORT || 4200;

const server = app.listen(port, function(){
    console.log('Listening on port ' + port);
});
