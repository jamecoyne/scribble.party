var db = require('../db/index');

module.exports = (callback) => {
    db.getLatestDrawing((res) => {
        if(res.length > 0) callback("data:image/png;base64," + Buffer.from(res.pop().buffer.buffer).toString('base64'));
        else callback("NONE");
    })
}