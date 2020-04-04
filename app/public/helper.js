// drawing helper methods
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

var mouseIsDown = false;
var mouseX = 0;
var mouseY = 0;

canvas.addEventListener('mousemove', function(e) {
    console.log('mouse moved')
    mouseX = e.clientX - painting.offsetLeft;
    mouseY = e.clientY - painting.offsetLeft;
    if(mouseIsDown){
        mouseDragged();
    }
}, false);