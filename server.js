const express = require('express');
const http = require('http');

const app = express()
const port = process.env.PORT || 80

app.use(express.static("public"))

app.get('/api/ip', (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.end(getRequestIpAddress(req));
})

app.get('/api/google', (client_req, client_res) => {
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


const IP_HEADERS = [
    'Forwarded',
    'Forwarded-For',
    'X-Forwarded',
    'X-Forwarded-For',     // may contain multiple IP addresses in the format: 'client IP, proxy 1 IP, proxy 2 IP' - we use first one
    'X-Client-IP',
    'X-Real-IP',           // Nginx proxy, FastCGI
    'X-Cluster-Client-IP', // Rackspace LB, Riverbed Stingray
    'Proxy-Client-IP',
    'CF-Connecting-IP',    // Cloudflare
    'Fastly-Client-Ip',    // Fastly CDN and Firebase hosting header when forwared to a cloud function
    'True-Client-Ip',      // Akamai and Cloudflare
    'WL-Proxy-Client-IP',
    'HTTP_X_FORWARDED_FOR',
    'HTTP_X_FORWARDED',
    'HTTP_X_CLUSTER_CLIENT_IP',
    'HTTP_CLIENT_IP',
    'HTTP_FORWARDED_FOR',
    'HTTP_FORWARDED',
    'HTTP_VIA',
    'REMOTE_ADDR'

    // you can add more matching headers here ...
];

const getRequestIpAddress = request => {
    const headers = request.headers;
    for (const header of IP_HEADERS) {
        const value = headers[header];
        if (value) {
            const parts = value.split(/\s*,\s*/g);
            return parts[0] ?? null;
        }
    }
    const client = request.connection ?? request.socket ?? request.info;
    if (client) {
        return client.remoteAddress ?? null;
    }
    return null;
};

