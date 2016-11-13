const {join} = require('path');
const {list, off, offAll, vibrate, vibrateAll} = require('xbox-ctrl');
const {version} = require('../package.json');
const {app, Menu, Tray} = require('electron');

const getControllersMenuItems = () => {
  const controllers = list();

  if (!controllers.length) {
    return [{
      label: 'No controllers connected',
      enabled: false
    }];
  }

  return [
    {
      label: 'Turn off all controllers',
      click () {
        offAll();
      }
    },
    {
      label: 'Vibrate all controllers',
      click () {
        vibrateAll();
      }
    },
    ...(controllers.map(controller => ({
      label: `Controller ${controller}`,
      submenu: [
        {
          label: 'Turn Off',
          click () {
            off(controller);
          }
        },
        {
          label: 'Vibrate',
          click () {
            vibrate(controller);
          }
        }
      ]
    })))
  ];
};

const buildMenu = () => {
  const controllerMenuItems = getControllersMenuItems();
  const exitMenuItems = [
    {type: 'separator'},
    {
      label: 'Options',
      submenu: [
        {
          label: 'Open on startup',
          type: 'checkbox',
          checked: true,
          click () {
            console.log('startup');
          }
        },
        {
          label: 'About',
          click () {
            console.log('about');
          }
        }
      ]
    },
    {role: 'quit'}
  ];

  return Menu.buildFromTemplate([...controllerMenuItems, ...exitMenuItems]);
};

app.on('ready', () => {
  const tray = new Tray(join(__dirname, 'icon.png'));

  tray.setToolTip(`xbox-ctrl-tray version ${version}`);

  tray.on('right-click', () => {
    tray.popUpContextMenu(buildMenu());
  });
});

