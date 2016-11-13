const path = require('path');
const {app, Menu, Tray} = require('electron');

let tray = null;

const buildMenu = () => {
  const items = [];

  items.push({type: 'separator'});
  items.push({role: 'quit'});

  return Menu.buildFromTemplate(items);
};

app.on('ready', () => {
  tray = new Tray(path.join(__dirname, 'icon.png'));

  tray.setToolTip('This is my application.');
  tray.setContextMenu(buildMenu());
});