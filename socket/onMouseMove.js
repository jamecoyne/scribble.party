module.exports = (socket) => {
    socket.on('mouse', (data) => {
        // console.log('MOUSE MOVE FROM: ' + socket.id)
        data.id = socket.id;
        socket.broadcast.emit('mouse', data);
        
        tempdata[data.id].drawing.push({x: data.x, y: data.y});
    });
}