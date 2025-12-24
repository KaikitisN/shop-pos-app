const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

let mainWindow;

// Configure auto-updater
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

// Auto-updater event handlers
autoUpdater.on('checking-for-update', () => {
    console.log('Checking for updates...');
});

autoUpdater.on('update-available', (info) => {
    console.log('Update available:', info.version);
    dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Update Available',
        message: `A new version ${info.version} is available. Do you want to download it now?`,
        buttons: ['Download', 'Later']
    }).then((result) => {
        if (result.response === 0) {
            autoUpdater.downloadUpdate();
        }
    });
});

autoUpdater.on('update-not-available', (info) => {
    console.log('Update not available. Current version is the latest:', info.version);
});

autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Update Ready',
        message: 'Update downloaded. The application will restart to install the update.',
        buttons: ['Restart Now', 'Later']
    }).then((result) => {
        if (result.response === 0) {
            autoUpdater.quitAndInstall();
        }
    });
});

autoUpdater.on('error', (error) => {
    console.error('Update error:', error);
});

autoUpdater.on('download-progress', (progressObj) => {
    console.log(`Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}%`);
});

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        icon: path.join(__dirname, 'icon.png')
    });

    mainWindow.loadFile('index.html');
    
    // Open DevTools to see console logs
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', () => {
    createWindow();
    
    // Check for updates after app is ready
    setTimeout(() => {
        autoUpdater.checkForUpdates();
    }, 3000);
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

// Handle print receipt
ipcMain.on('print-receipt', (event, receiptData) => {
    const printWindow = new BrowserWindow({
        width: 302,
        height: 793,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    const receiptHTML = generateReceiptHTML(receiptData);
    
    printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(receiptHTML)}`);
    
    printWindow.webContents.on('did-finish-load', () => {
        printWindow.webContents.print({
            silent: false,
            printBackground: true,
            margins: {
                marginType: 'none'
            }
        }, (success, failureReason) => {
            if (!success) {
                console.log('Print failed:', failureReason);
            }
            printWindow.close();
        });
    });
});

function generateReceiptHTML(data) {
    const itemsHTML = data.items.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>€${item.price.toFixed(2)}</td>
            <td>€${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
    `).join('');

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                    width: 80mm;
                    margin: 0;
                    padding: 10mm;
                }
                h1 {
                    text-align: center;
                    font-size: 18px;
                    margin: 0 0 10px 0;
                }
                .store-info {
                    text-align: center;
                    margin-bottom: 15px;
                    border-bottom: 2px dashed #000;
                    padding-bottom: 10px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 15px 0;
                }
                th {
                    text-align: left;
                    border-bottom: 1px solid #000;
                    padding: 5px 0;
                }
                td {
                    padding: 5px 0;
                }
                .total-section {
                    border-top: 2px solid #000;
                    margin-top: 10px;
                    padding-top: 10px;
                }
                .total {
                    font-size: 16px;
                    font-weight: bold;
                    text-align: right;
                    margin: 10px 0;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    border-top: 2px dashed #000;
                    padding-top: 10px;
                }
            </style>
        </head>
        <body>
            <h1>SHOP POS</h1>
            <div class="store-info">
                <div>Your Shop Name</div>
                <div>Address Line 1</div>
                <div>Phone: +123 456 7890</div>
                <div>Date: ${new Date().toLocaleString()}</div>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHTML}
                </tbody>
            </table>
            
            <div class="total-section">
                <div class="total">TOTAL: €${data.total.toFixed(2)}</div>
            </div>
            
            <div class="footer">
                <div>Thank you for your purchase!</div>
                <div>Please come again</div>
            </div>
        </body>
        </html>
    `;
}
