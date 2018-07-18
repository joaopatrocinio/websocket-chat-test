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
    res.sendFile(__dirname + "/www/index.html");
});

io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('chat message', function(msg) {
        console.log('message: ' + msg)
        var sql = "INSERT INTO mensagem (mensagem_user_id, mensagem_text) VALUES (1, '" + msg + "');";
        con.query(sql, function (err, result) {
            if (err) throw err;
        });
        io.emit('chat message', msg);
    });

    socket.on('get messages', function() {
        console.log('sending messages to user');
        var sql = "SELECT * FROM mensagem";
        con.query(sql, function (err, result) {
            if (err) throw err;
            io.emit('get messages', result);
        });
    });

    socket.on('disconnect', function() {
        console.log('a user disconnected');
    })
});

http.listen(3000, function() {
    console.log("listening on *:3000");
});