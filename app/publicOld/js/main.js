var socket;

function setup() {
    createCanvas(windowWidth, windowHeight);

    socket = io.connect('http://localhost:3000')
    socket.on('mouse', newDrawing);
    socket.on('mouseDown', detectNewDrawing);
    socket.on('requestData', firstConnection);
    socket.emit('requestData', {});
}

var connectedClientsData = {
    me: {
        pos:{

        },
        color: {
            r: 255,
            g: 255,
            b: 255
        },
        brushSize: 5
    }
};

// #######################
// server side functions
// #######################

function firstConnection(data){
    for(var drawing in data){
        var currentDrawing = data[drawing];
        strokeWeight(currentDrawing.brushSize);
        stroke(currentDrawing.color.r, currentDrawing.color.g, currentDrawing.color.b);
        var oldPos = currentDrawing.pos;
        for(pos in currentDrawing.drawing){
            var pos = currentDrawing.drawing[pos];
            line(oldPos.x, oldPos.y, pos.x, pos.y);
            oldPos = pos;
        }
    }
}

function detectNewDrawing(data){
    connectedClientsData[data.id] = data;
}

function newDrawing(data){
    var oldPos = connectedClientsData[data.id].pos;
    var color = connectedClientsData[data.id].color;
    var brushSize = connectedClientsData[data.id].brushSize;

    strokeWeight(brushSize);
    stroke(color.r, color.g, color.b);
    line(data.x, data.y, oldPos.x, oldPos.y);
    connectedClientsData[data.id].pos = {x: data.x, y: data.y}
}

// #######################
// client side functions
// #######################
function mouseDragged(){
    var me = connectedClientsData["me"];

    stroke(me.color.r, me.color.g, me.color.b);
    strokeWeight(me.brushSize);
    var data = {
        x: mouseX,
        y: mouseY
    }

    line(me.pos.x, me.pos.y, data.x, data.y);
    connectedClientsData.me.pos = data;
    socket.emit('mouse', data);
}

function mousePressed(){

    connectedClientsData.me.pos = {
        x: mouseX,
        y: mouseY
    }

    socket.emit('mouseDown', connectedClientsData.me);
}

function mouseReleased(){
    socket.emit('mouseReleased', {});
}