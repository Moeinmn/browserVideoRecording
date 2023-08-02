const express = require('express');
const httpProxy = require('http-proxy');

// const targetUrl = 'http://localhost:8080/'; // Replace with the target URL you want to proxy

const targetUrl = 'https://pss.pro.ai/api/embed/67abc8c5-35f3-4317-8884-8dd8daf136b8?crossOriginIsolated=true&enableCors=true'

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

app.listen(8081, () => {
  console.log('Proxy server listening on port 3000');
});
