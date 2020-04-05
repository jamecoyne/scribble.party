const { createCanvas, Image} = require('canvas')
var db = require('../db/index');

// create canvas
const canvas = createCanvas(1152, 700)
const ctx = canvas.getContext('2d')
ctx.lineJoin = 'round';
ctx.lineCap = 'round';

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

// da meat n' potatoes 
// load previous image, append new drawing to it and save in database
module.exports = (lastImage, sourceID) => {
    
    // load last image
    if(lastImage != "NONE"){
        var img = new Image()
        img.onload = () => ctx.drawImage(img, 0, 0)
        img.onerror = err => { throw err }
        img.src = lastImage;
    }
    
    // draw the drawing
    
    // if for whatever reason the drawing doesn't exist in the tempdata store
    if(tempdata[sourceID] !== undefined){
        var currentDrawing = tempdata[sourceID];
        strokeWeight(currentDrawing.brushSize);
        stroke(currentDrawing.color);
    
        var oldPos = currentDrawing.pos;
        for(pos in currentDrawing.drawing){
            var pos = currentDrawing.drawing[pos];
            line(oldPos.x, oldPos.y, pos.x, pos.y);
            oldPos = pos;
        }

        // save the drawing in the database
        var canvasBuffer = canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE })
        db.insertDrawing(canvasBuffer);
    }

    // optional: output the image
    // fs.writeFileSync(Date.now()+".png", buf.buffer);
}