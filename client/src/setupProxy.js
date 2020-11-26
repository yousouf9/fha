const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/',
    createProxyMiddleware({
      target: 'https://tranquil-refuge-23268.herokuapp.com',
      changeOrigin: true,
    })
  );
};