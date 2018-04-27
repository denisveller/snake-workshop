var events = require('events');
var eventEmitter = new events.EventEmitter();
var server = require('http').createServer(handler);
var io = require('socket.io')(server);
var fs = require('fs');
var url = require('url');
server.listen(process.env.PORT || process.env.port || 8080);

function handler(req, res) {
  var q = url.parse(req.url, true);
  var filename = "." + q.pathname
  if (filename === "./files") {
    fs.readFile(__dirname + '/index.html',
      function (err, data) {
        if (err) {
          res.writeHead(500);
          return res.end('Error loading flies');
        }

        res.writeHead(200);
        res.end(data);

      });

  } else {
    fs.readFile(__dirname + '/snake.html',
      function (err, data) {
        if (err) {
          res.writeHead(500);
          return res.end('Error loading snake.html');
        }

        res.writeHead(200);
        res.end(data);

      });
  }
}
var score = 0;
var username;
var recordObject = { score, username };
recordObject.score = 0;
io.on('connection', function (socket) {
  io.emit('setRecords', recordObject);
  socket.on('score', function (scoreObject) {
    if (scoreObject.score > recordObject.score) {
      recordObject = scoreObject;
      io.emit('newRecord', recordObject);
    }
  });
});