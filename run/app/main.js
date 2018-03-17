
const path = require('path');
const request = require('request');

module.exports = {

  run: async function (app) {
    console.log(__filename + '\n[CALL] run');

    app.use('/pos/getCurrentEnv', (req, res, next) => {
      res.send(process.env);
    });

    app.use('/pos/*', (req, res, next) => {
      request({
        url: process.env.SERVICE_URL + req.originalUrl,
        method: req.method,
        body: JSON.stringify(req.body),
      }).pipe(res);
    });

    app.get('/*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  },

};

