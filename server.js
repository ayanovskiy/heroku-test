const express = require('express')
const app = express()
const port = process.env.PORT || 80

app.use(express.static("public"))

app.get('/api/ip', (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.end(req.ip);
})

app.get('/api/google', (req, res) => {
  res.setHeader("Content-Type", "text/html");
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

