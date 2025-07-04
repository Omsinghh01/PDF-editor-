const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // File dialogs
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  
  // Menu events - listen for menu actions
  onMenuAction: (callback) => {
    const handleMenuAction = (event, action, data) => {
      callback(action, data);
    };
    
    // Register listeners for all menu events
    ipcRenderer.on('menu-new-file', (event) => handleMenuAction(event, 'new-file'));
    ipcRenderer.on('menu-open-file', (event, filePath) => handleMenuAction(event, 'open-file', filePath));
    ipcRenderer.on('menu-save-file', (event) => handleMenuAction(event, 'save-file'));
    ipcRenderer.on('menu-add-text', (event) => handleMenuAction(event, 'add-text'));
    ipcRenderer.on('menu-add-image', (event) => handleMenuAction(event, 'add-image'));
    ipcRenderer.on('menu-add-shape', (event) => handleMenuAction(event, 'add-shape'));
    ipcRenderer.on('menu-merge-pdfs', (event) => handleMenuAction(event, 'merge-pdfs'));
    ipcRenderer.on('menu-split-pdf', (event) => handleMenuAction(event, 'split-pdf'));
    
    // Return a cleanup function
    return () => {
      ipcRenderer.removeAllListeners('menu-new-file');
      ipcRenderer.removeAllListeners('menu-open-file');
      ipcRenderer.removeAllListeners('menu-save-file');
      ipcRenderer.removeAllListeners('menu-add-text');
      ipcRenderer.removeAllListeners('menu-add-image');
      ipcRenderer.removeAllListeners('menu-add-shape');
      ipcRenderer.removeAllListeners('menu-merge-pdfs');
      ipcRenderer.removeAllListeners('menu-split-pdf');
    };
  },
  
  // Platform detection
  platform: process.platform,
  isElectron: true,
  
  // Window controls
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  maximizeWindow: () => ipcRenderer.send('maximize-window'),
  closeWindow: () => ipcRenderer.send('close-window'),
  
  // File system operations (for desktop app features)
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath, data) => ipcRenderer.invoke('write-file', filePath, data),
  
  // Notifications
  showNotification: (title, body) => {
    if (window.Notification && Notification.permission === 'granted') {
      new Notification(title, { body });
    } else if (window.Notification && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, { body });
        }
      });
    }
  }
});

// Expose a subset of Node.js path module for file handling
contextBridge.exposeInMainWorld('path', {
  join: (...args) => require('path').join(...args),
  basename: (path, ext) => require('path').basename(path, ext),
  dirname: (path) => require('path').dirname(path),
  extname: (path) => require('path').extname(path)
});

// Enhanced features for desktop app
contextBridge.exposeInMainWorld('desktopFeatures', {
  // Check if running in Electron
  isDesktop: true,
  
  // Get system info
  getSystemInfo: () => ({
    platform: process.platform,
    arch: process.arch,
    version: process.versions.electron
  }),
  
  // Desktop-specific file operations
  openFileManager: (path) => ipcRenderer.send('open-file-manager', path),
  
  // Keyboard shortcuts info
  getShortcuts: () => ({
    newFile: process.platform === 'darwin' ? 'Cmd+N' : 'Ctrl+N',
    openFile: process.platform === 'darwin' ? 'Cmd+O' : 'Ctrl+O',
    saveFile: process.platform === 'darwin' ? 'Cmd+S' : 'Ctrl+S',
    addText: process.platform === 'darwin' ? 'Cmd+T' : 'Ctrl+T',
    addImage: process.platform === 'darwin' ? 'Cmd+I' : 'Ctrl+I',
    addShape: process.platform === 'darwin' ? 'Cmd+Shift+S' : 'Ctrl+Shift+S'
  })
});