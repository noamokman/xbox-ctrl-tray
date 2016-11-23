const {BrowserWindow} = require('electron');

let window;

module.exports = {
  show () {
    if (!window || window.isDestroyed()) {
      window = new BrowserWindow({
        width: 400,
        height: 300,
        maximizable: false,
        minimizable: false,
        resizable: false
      });
      window.setMenu(null);

      window.loadURL(`file://${__dirname}/about.html`);
    }

    window.focus();
  }
};