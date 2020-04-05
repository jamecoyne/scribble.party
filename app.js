var express = require('express');
var socket = require('./socket/index');
var drawing = require('./drawing/index');

global.tempdata = require('./tempdata');

var app = express();
var server = app.listen(process.env.PORT || 3000);
socket.listen(server);

app.get('/background', (req, res) => {drawing.getLastDrawing((img) => res.send(img))})

app.use(express.static('public'));