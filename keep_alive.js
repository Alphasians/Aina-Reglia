const http = require('http')

http.createServer(function (req, res) {
  res.write("Hello, I'm alive")
  res.end()
}).listen(8080)
