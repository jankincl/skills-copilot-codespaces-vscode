// Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var mysql = require('mysql');

// Create a connection to the database
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "comments"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to the database!");
});

// Create a server
http.createServer(function (req, res) {
  var q = url.parse(req.url, true);
  var filename = "." + q.pathname;

  if (q.pathname == '/comments') {
    con.query("SELECT * FROM comments", function (err, result, fields) {
      if (err) throw err;
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(result));
      res.end();
    });
  } else if (q.pathname == '/add_comment') {
    var qdata = q.query;
    var sql = "INSERT INTO comments (name, comment) VALUES ('" + qdata.name + "', '" + qdata.comment + "')";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Comment added");
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end("Comment added");
    });
  } else {
    fs.readFile('comments.html', function(err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        return res.end("404 Not Found");
      }
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      return res.end();
    });
  }
}).listen(8080);