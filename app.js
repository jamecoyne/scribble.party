var express = require('express');
var socket = require('socket.io');
// var fs = require("fs");
const { createCanvas, loadImage, createImageData, Image } = require('canvas')
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
        // drawingsCollection.find({})
        
        // socket.emit('requestData', 'hello');
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
                getLastDrawing( (lastImg) => {
                    // drawing helper functions
                    function line(x1, y1, x2, y2){
                        ctx.beginPath();
                        ctx.moveTo(x1, y1);
                        ctx.lineTo(x2, y2);
                        ctx.stroke();
                    }
                    
                    function stroke(colorParam){
                        ctx.strokeStyle = colorParam;   
                    }
                    
                    function strokeWeight(size){
                        ctx.lineWidth = size;
                    }

                    // var pastCanvas = res.pop();
                    // var lastImg = pastCanvas.buffer;
                    
                    // create canvas
                    const canvas = createCanvas(1152, 700)
                    const ctx = canvas.getContext('2d')
                    ctx.lineJoin = 'round';
                    ctx.lineCap = 'round';

                    // load last image
                    var img = new Image()
                    img.onload = () => ctx.drawImage(img, 0, 0)
                    img.onerror = err => { throw err }
                    img.src = lastImg;
                    // img.src = "data:image/png;base64," + Buffer.from(pastCanvas.buffer.buffer).toString('base64');

                    //variable to hold the drawing that has been finished
                    var currentDrawing = tempdata[socket.id];

                    // draw the drawing
                    strokeWeight(currentDrawing.brushSize);
                    stroke(currentDrawing.color);

                    var oldPos = currentDrawing.pos;
                    for(pos in currentDrawing.drawing){
                        var pos = currentDrawing.drawing[pos];
                        line(oldPos.x, oldPos.y, pos.x, pos.y);
                        oldPos = pos;
                    }

                    // save the image in the database
                    var buf = {
                        date: Date.now(),
                        buffer: canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE })
                    }
                    drawingsCollection.insert(buf);

                    // optional: output the image
                    // fs.writeFileSync(Date.now()+".png", buf.buffer);
                }
            )
        }  
    );

}

function getLastDrawing(callback){
    drawingsCollection.find({}, { sort: {date: -1}, limit: 1 })
    .then((res) => callback("data:image/png;base64," + Buffer.from(res.pop().buffer.buffer).toString('base64')))
}

app.get('/background', function (req, res) {getLastDrawing((img) => res.send(img))})

app.use(express.static('public'));