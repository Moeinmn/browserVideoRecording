const express = require('express');
const httpProxy = require('http-proxy');

const targetUrl = 'http://localhost:8080/'; // Replace with the target URL you want to proxy

const proxy = httpProxy.createProxyServer({});

const app = express();

app.use((req, res) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');

  //console.log({req});
  //req.setHeader("Access-Control-Allow-Origin", "https://plotset.com/")
  proxy.web(req, res, { target: targetUrl });
});

app.listen(8081, () => {
  console.log('Proxy server listening on port 3000');
});
