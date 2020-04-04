// #######################
// canvas setup
// #######################

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var painting = document.getElementById('paint');
var paint_style = getComputedStyle(painting);

canvas.width = parseInt(paint_style.getPropertyValue('width'));
canvas.height = parseInt(paint_style.getPropertyValue('height'));
ctx.lineJoin = 'round';
ctx.lineCap = 'round';

// #######################
// global variables
// #######################

var currentTool = "1";

var state = {
    me: {
        pos:{
            x: 0,
            y: 0
        },
        color: "#000",
        brushSize: 1
    }
};

// #######################
// server side listeners
// #######################

var socket = io.connect(window.location.origin)
// when a clients mouse moves
socket.on('mouse', function(data){
    var oldPos = state[data.id].pos;
    var color = state[data.id].color;
    var brushSize = state[data.id].brushSize;

    strokeWeight(brushSize);
    stroke(color);
    line(data.x, data.y, oldPos.x, oldPos.y);
    state[data.id].pos = {x: data.x, y: data.y}
});

// when a clients mouse is down
socket.on('mouseDown', function(data){
    state[data.id] = data;
});

// request data when the page first loads
socket.on('requestData', function(data){
    for(var drawing in data){
        var currentDrawing = data[drawing];
        strokeWeight(currentDrawing.brushSize);
        stroke(currentDrawing.color);

        var oldPos = currentDrawing.pos;
        for(pos in currentDrawing.drawing){
            var pos = currentDrawing.drawing[pos];
            line(oldPos.x, oldPos.y, pos.x, pos.y);
            oldPos = pos;
        }
    }
});
socket.emit('requestData', {});

// #######################
// server side listeners
// #######################

function mouseDragged(){
    console.log('mouse dragged')
    stroke(state.me.color);
    strokeWeight(state.me.brushSize);
    line(state.me.pos.x, state.me.pos.y, mouseX, mouseY);
    state.me.pos = {
        x: mouseX,
        y: mouseY
    }
    socket.emit('mouse', state.me.pos);
}

function mousePressed(){
    console.log('mouse down');
    state.me.pos = {
        x: mouseX,
        y: mouseY
    }
    socket.emit('mouseDown', state.me);
}

function mouseReleased(){
    socket.emit('mouseReleased', {});
}
 

// #######################
// UI functions
// #######################

function onBrushSizeChange(selector){
    state.me.brushSize = selector.value;
}

function setCurrentColor() {
    state.me.color = $("#current-color").val();
}

function updateCurrentTools() {
    $("#brush-size-options").addClass("no-display");
    $("#eraser-size-options").addClass("no-display");

    if (currentTool == "1") {
        $("#tool-selected").html("Pencil");
    } 
    else if (currentTool == "2") {
        $("#brush-size-options").removeClass("no-display");
        $("#tool-selected").html("Brush");
    } 
    else if (currentTool == "5") {
        $("#eraser-size-options").removeClass("no-display")
        $("#tool-selected").html("Eraser");
    }
}

$(".tool").click(function(e) {
    var target = e.target;
    var id = $(target).attr("id");
    currentTool = id;
    setCurrentColor();
    switch(currentTool){
        case "1":
            state.me.brushSize = 2;
        break;
        case "2":
            var selector = document.getElementById("brush-sizes");
            onBrushSizeChange(selector.options[selector.selectedIndex])
        break;
        case "5":
            var selector = document.getElementById("eraser-sizes");
            onBrushSizeChange(selector.options[selector.selectedIndex])
            state.me.color = '#fff'
        break;
    }
    updateCurrentTools();
})

updateCurrentTools();

// #######################
// drawing helper function
// #######################

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

var mouseIsPressed = false;
var mouseX = 0;
var mouseY = 0;

canvas.addEventListener('mousemove', function(e) {
    mouseX = e.clientX - painting.offsetLeft;
    mouseY = e.clientY - painting.offsetTop;
    if(mouseIsPressed){
        mouseDragged();
    }
}, false);

canvas.addEventListener('mousedown', function(e) {
    mouseX = e.clientX - painting.offsetLeft;
    mouseY = e.clientY - painting.offsetTop;
    mouseIsPressed = true;
    mousePressed();
}, false);

canvas.addEventListener('mouseup', function() {
    mouseIsPressed = false;
    mouseReleased();
}, false);