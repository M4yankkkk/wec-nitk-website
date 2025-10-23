module.exports = ({ env }) => ({
  'io': {
    enabled: true,
    config: {
      cors: {
      origin: [
        "http://localhost:3000",
        "http://localhost:5000",
        "http://127.0.0.1:3000",
          "http://127.0.0.1:5000"
         ],
         methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
         headers: ["Content-Type", "Authorization"],
         credentials: true
       },
      contentTypes: [],
    },
  },
});