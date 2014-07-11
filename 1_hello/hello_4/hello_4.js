var http = require('http');
var connect = require('connect')
var app = connect();

app.use(connect.static('www'));
http.createServer(app).listen(3000);
