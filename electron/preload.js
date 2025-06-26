const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Example: Send message to main process
  sendMessage: (message) => ipcRenderer.invoke('send-message', message),
  
  // Example: Listen for messages from main process
  onMessage: (callback) => ipcRenderer.on('message', callback),
  
  // Example: Get app version
  getVersion: () => ipcRenderer.invoke('get-version'),
  
  // Example: Minimize window
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  
  // Example: Close window
  closeWindow: () => ipcRenderer.invoke('close-window'),
  
  // Example: Toggle fullscreen
  toggleFullscreen: () => ipcRenderer.invoke('toggle-fullscreen')
});