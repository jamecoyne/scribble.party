var socket = require('socket.io');

module.exports.listen = (server) => {
    socket(server).sockets.on('connection', (socket) => {
        console.log('new connection ' + socket.id);
        require('./onMouseMove')(socket)
        require('./onMouseDown')(socket)
        require('./onMouseReleased')(socket)
    });
}