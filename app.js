var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "host",
    user: "user",
    password: "password"
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/www/index.html");
});

io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('chat message', function(msg) {
        console.log('message: ' + msg)
        var sql = "INSERT INTO chat.mensagem (mensagem_user_id, mensagem_text) VALUES (1, '" + msg + "');";
        con.connect(function(err) {
            if (err) throw err;
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log("Result: " + result);
            });
        });
        io.emit('chat message', msg);
    });

    socket.on('disconnect', function() {
        console.log('a user disconnected');
    })
});

http.listen(3000, function() {
    console.log("listening on *:3000");
});