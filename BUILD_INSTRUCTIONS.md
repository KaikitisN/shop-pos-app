# Building the Installer - Fix for Symbolic Link Error

## The Problem
Windows requires administrator privileges to create symbolic links, which electron-builder needs.

## Solution: Enable Developer Mode

### Option 1: Enable Developer Mode (Recommended - Easy & Safe)

1. Press `Windows + I` to open Settings
2. Go to **Settings** → **Privacy & Security** → **For developers**
3. Toggle **Developer Mode** to **On**
4. Restart your computer
5. Run the build command again: `npm run build:win`

### Option 2: Run PowerShell as Administrator

1. Close your current PowerShell window
2. Right-click on **PowerShell** or **Windows Terminal**
3. Select **Run as Administrator**
4. Navigate to your project folder:
   ```powershell
   cd C:\Users\Neophytos\Desktop\ApplicationTesting
   ```
5. Run: `npm run build:win`

### Option 3: Use Portable Build (No Installer)

If you just want a portable .exe without an installer:

1. Edit `package.json` and change the build target from `nsis` to `portable`:
   ```json
   "win": {
     "target": [
       {
         "target": "portable",
         "arch": ["x64"]
       }
     ]
   }
   ```
2. Run: `npm run build:win`
3. This creates a single portable `.exe` file in `dist` folder

## After Building Successfully

Your installer will be in: `dist\Shop POS Setup 1.0.0.exe`

You can then:
- Install it on this computer
- Copy the .exe to other Windows computers
- Distribute it however you need

## File Size
The installer will be approximately 150-200 MB because it includes:
- Electron runtime
- Chromium browser engine
- Your application code
- React libraries
