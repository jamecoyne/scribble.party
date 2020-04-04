var express = require('express');
var socket = require('socket.io');

const db = require("monk")(process.env.MONGODB_URI || "mongodb://localhost:27017/mydb");
const drawingsCollection = db.get("drawings");

var app = express();
var server = app.listen(process.env.PORT || 3000);

var io = socket(server);

io.sockets.on('connection', newConnection);

var tempdata = {};

function newConnection(socket){
    console.log('new connection ' + socket.id);

    // on first connection
    socket.on('requestData', 
    function(){
        drawingsCollection.find({})
        .then(function(res){
            socket.emit('requestData', res);
        })
    })

    // on mouse move
    socket.on('mouse', 
        function (data){
            data.id = socket.id;
            socket.broadcast.emit('mouse', data);
            tempdata[data.id].drawing.push({x: data.x, y: data.y});
        }
    );
    
    // on mouse down
    socket.on('mouseDown', 
        function (data){
            data.id = socket.id;
            socket.broadcast.emit('mouseDown', data);
            data.drawing = [];
            tempdata[data.id] = data;
        }
    );

    // on mouse released
    socket.on('mouseReleased',
        function(){
            drawingsCollection.count({}, function(error, numOfDocs) {
                // console.log('I have '+numOfDocs+' documents in my collection');
                // ..
            });
            drawingsCollection.insert(tempdata[socket.id]);
        }
    );

}

app.use(express.static('public'));