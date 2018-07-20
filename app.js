var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');
require('dotenv').config();

var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

con.connect(function(err) {
    if (err) throw err;
});

app.get('/', function(req, res) {
    res.send(new Date());
});

io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('chat message', function(data) {
        // var date[]
        // 0 - message
        // 1 - javascript date object
        // 2 - user id

        console.log('message: ' + data[0])
        var sql = "INSERT INTO message (message_user_id, message_text, message_datetime) VALUES (?, ?, ?);";
        con.query(sql, [data[2], data[0], data[1]], function (err, result) {
            if (err) throw err;
        });
        io.emit('chat message', data);
    });

    socket.on('get messages', function() {
        console.log('sending messages to user');
        var sql = "SELECT * FROM message";
        con.query(sql, function (err, result) {
            if (err) throw err;
            io.to(socket.id).emit('get messages', result);
        });
    });

    socket.on('disconnect', function() {
        console.log('a user disconnected');
    })
});

http.listen(3000, function() {
    console.log("listening on *:3000");
});