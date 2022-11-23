const express = require('express');
const http = require('http');

const app = express()
const port = process.env.PORT || 80

app.use(express.static("public"))
app.set('trust proxy', true)

app.get('/ip', (req, res) => {
  res.setHeader("Content-Type", "text/plain");
console.log(req.headers)
  res.end((req.headers['x-forwarded-for'] || '').split(',').pop().trim() || req.socket.remoteAddress)
})

app.get('/google', (client_req, client_res) => {
  var options = {
    hostname: 'www.google.com',
    path: "/search?q=" + client_req.query.q,
    method: "GET",
  };

  var proxy = http.request(options, function (res) {
    client_res.writeHead(res.statusCode, res.headers)
    res.pipe(client_res, {
      end: true
    });
  });

  client_req.pipe(proxy, {
    end: true
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

