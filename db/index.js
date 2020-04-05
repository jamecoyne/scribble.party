const db = require("monk")(process.env.MONGODB_URI || "mongodb://localhost:27017/mydb");
const drawingsCollection = db.get("drawings");

function getLatestDrawing(callback){
    drawingsCollection.find({}, { sort: {date: -1}, limit: 1 })
    .then((res) => {callback(res)})
}

function insertDrawing(canvasBuffer){
    // append the date and save the image in the database
    drawingsCollection.insert({
        date: Date.now(),
        buffer: canvasBuffer
    });
}

module.exports = {getLatestDrawing, insertDrawing}