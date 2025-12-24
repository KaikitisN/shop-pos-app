# Shop POS Application

A desktop point-of-sale (POS) application built with Electron and React.

## Features

- **Product Display**: Grid view of all products with prices
- **Category Filtering**: Filter products by categories (Fruits, Dairy, Bakery, Meat, Vegetables, Beverages)
- **Shopping Cart**: Add products, adjust quantities, and remove items
- **Receipt Printing**: Generate and print professional receipts
- **Real-time Total**: Automatic calculation of cart total

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

Start the application:
```bash
npm start
```

## How to Use

1. **Browse Products**: View products in the center grid
2. **Filter by Category**: Click category buttons on the right sidebar
3. **Add to Cart**: Click any product to add it to the cart (left sidebar)
4. **Adjust Quantities**: Use +/- buttons in the cart
5. **Checkout**: Click "Checkout & Print" to generate and print a receipt
6. **Clear Cart**: Remove all items with the "Clear Cart" button

## Customization

### Adding Products

Edit the `SAMPLE_PRODUCTS` array in [renderer.js](renderer.js):
```javascript
{ id: 1, name: 'Product Name', price: 9.99, category: 'Category' }
```

### Store Information

Update store details in [main.js](main.js) `generateReceiptHTML()` function.

## Building for Distribution

### Install electron-builder (already installed):
```bash
npm install --save-dev electron-builder
```

### Build the installer:

**For Windows:**
```bash
npm run build:win
```
This creates an `.exe` installer in the `dist` folder.

**For Mac:**
```bash
npm run build:mac
```
Creates a `.dmg` installer.

**For Linux:**
```bash
npm run build:linux
```
Creates `.AppImage` and `.deb` files.

**Or build for your current platform:**
```bash
npm run build
```

### After building:
- Find your installer in the `dist` folder
- The installer will be named something like `Shop POS Setup 1.0.0.exe`
- You can distribute this file to any Windows computer
- Users can double-click to install the app

### Installation options:
- Choose installation directory
- Desktop shortcut
- Start menu shortcut

## Auto-Updates

The app includes automatic update functionality. When you publish a new version, users will be notified automatically.

### How to Publish Updates:

1. **Update version number** in [package.json](package.json):
   ```json
   "version": "1.0.1"
   ```

2. **Configure GitHub repository** in [package.json](package.json) (already set up):
   ```json
   "publish": [
     {
       "provider": "github",
       "owner": "your-github-username",
       "repo": "shop-pos-app"
     }
   ]
   ```
   Replace `your-github-username` with your actual GitHub username.

3. **Create a GitHub Personal Access Token:**
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate new token with `repo` scope
   - Set as environment variable:
     ```bash
     $env:GH_TOKEN="your_token_here"
     ```

4. **Build and publish:**
   ```bash
   npm run build:win
   ```
   Then publish to GitHub:
   ```bash
   npx electron-builder --win --publish always
   ```

5. **Create a GitHub Release:**
   - The build files will be automatically uploaded to GitHub Releases
   - Users with the app installed will automatically be notified of the update
   - They can download and install with one click

### Update Workflow:
- App checks for updates 3 seconds after launch
- If update is available, user gets a dialog prompt
- User can choose to download immediately or later
- After download, user can restart to install or continue working
- Updates are installed on app restart

## Tech Stack

- **Electron**: Desktop application framework
- **React**: UI component library
- **Node.js**: Backend runtime

## License

MIT
