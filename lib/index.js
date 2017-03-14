const {join} = require('path');
const {list, off, offAll, vibrate, vibrateAll} = require('xbox-ctrl');
const {version} = require('../package.json');
const {app, Menu, Tray} = require('electron');
const opn = require('opn');
const AutoLaunch = require('auto-launch');
const noop = require('noop3');
const isDev = require('electron-is-dev');
const {autoUpdater} = require('electron-updater');

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall();
});

const launcher = new AutoLaunch({
  name: 'xbox-ctrl'
});

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
  return launcher.isEnabled()
    .then(enabled => {
      const menuItems = [
        ...getControllersMenuItems(),
        {type: 'separator'},
        {
          label: 'Options',
          submenu: [
            {
              label: 'Open on startup',
              type: 'checkbox',
              checked: enabled,
              click () {
                if (enabled) {
                  launcher.disable();

                  return;
                }

                launcher.enable();
              }
            },
            {
              label: 'View on github',
              click () {
                opn('https://github.com/noamokman/xbox-ctrl-tray');
              }
            }
          ]
        },
        {role: 'quit'}
      ];

      return Menu.buildFromTemplate(menuItems);
    });
};

const shouldQuit = app.makeSingleInstance(noop);

if (shouldQuit) {
  app.quit();
}

let tray;

app.on('ready', () => {
  if (!isDev) {
    autoUpdater.checkForUpdates();
  }

  tray = new Tray(join(__dirname, 'icon.png'));

  tray.setToolTip(`xbox-ctrl-tray ${version}`);

  tray.on('right-click', () => {
    buildMenu()
      .then(menu => {
        tray.popUpContextMenu(menu);
      });
  });
});

app.on('window-all-closed', noop);
