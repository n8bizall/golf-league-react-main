const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api", // Replace with your API route
    createProxyMiddleware({
      target: "https://firestore.googleapis.com", // Firestore API endpoint
      changeOrigin: true,
      secure: true,
      pathRewrite: {
        "^/api": "", // Optional: remove '/api' prefix from requests
      },
    })
  );
};
