const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api', 
    createProxyMiddleware({
      target: 'https://flask-two-gamma.vercel.app', 
      changeOrigin: true,
    })
  );
};