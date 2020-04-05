var drawing = require('../drawing/index');

module.exports = (socket) => {
    // console.log('MOUSE RELEASE FROM: ' + socket.id)
    socket.on('mouseReleased', () => drawing.getLastDrawing((lastImg) => drawing.addNewDrawing(lastImg, socket.id)));
}