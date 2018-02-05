
const path = require('path');


module.exports = {

  async run(app) {
    console.log(__filename);
    console.log('[CALL] run');

    app.get('/*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  },

};

