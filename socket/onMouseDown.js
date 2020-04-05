module.exports = (socket) => {
    socket.on('mouseDown', (data) => {
        // console.log('MOUSE DOWN FROM: ' + socket.id)
        data.id = socket.id;
        socket.broadcast.emit('mouseDown', data);
        
        data.drawing = [];
        tempdata[data.id] = data;
    });
}