const express = require('express');
const httpProxy = require('http-proxy');

// const targetUrl = 'http://localhost:8080/'; // Replace with the target URL you want to proxy

const targetUrl = 'http://localhost:8080'

const proxy = httpProxy.createProxyServer({secure: false});

const app = express();

app.use((req, res) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  //console.log({req});
  //req.set("Access-Control-Allow-Origin", "https://plotset.com/")
  proxy.web(req, res, { target: targetUrl });
});

app.listen(6565, () => {
  console.log('Proxy server listening on port 6565');
});
