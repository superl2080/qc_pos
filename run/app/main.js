
const path = require('path');


module.exports = {

  run: async function (app) {
    console.log(__filename + '\n[CALL] run');

    app.get('/*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  },

};

