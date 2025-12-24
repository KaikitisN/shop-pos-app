const { ipcRenderer } = require('electron');
const React = require('react');
const ReactDOM = require('react-dom');

// Sample product data
const SAMPLE_PRODUCTS = [
    { id: 1, name: 'Apple', price: 1.50, category: 'Fruits' },
    { id: 2, name: 'Banana', price: 0.80, category: 'Fruits' },
    { id: 3, name: 'Orange', price: 1.20, category: 'Fruits' },
    { id: 4, name: 'Milk', price: 2.50, category: 'Dairy' },
    { id: 5, name: 'Cheese', price: 4.80, category: 'Dairy' },
    { id: 6, name: 'Yogurt', price: 1.90, category: 'Dairy' },
    { id: 7, name: 'Bread', price: 2.20, category: 'Bakery' },
    { id: 8, name: 'Croissant', price: 1.80, category: 'Bakery' },
    { id: 9, name: 'Bagel', price: 1.50, category: 'Bakery' },
    { id: 10, name: 'Chicken Breast', price: 7.50, category: 'Meat' },
    { id: 11, name: 'Ground Beef', price: 6.80, category: 'Meat' },
    { id: 12, name: 'Salmon', price: 12.50, category: 'Meat' },
    { id: 13, name: 'Tomato', price: 2.00, category: 'Vegetables' },
    { id: 14, name: 'Carrot', price: 1.50, category: 'Vegetables' },
    { id: 15, name: 'Lettuce', price: 1.80, category: 'Vegetables' },
    { id: 16, name: 'Coca Cola', price: 1.50, category: 'Beverages' },
    { id: 17, name: 'Orange Juice', price: 3.20, category: 'Beverages' },
    { id: 18, name: 'Water', price: 0.80, category: 'Beverages' }
];

const CATEGORIES = [
    { name: 'All', icon: '🏪' },
    { name: 'Fruits', icon: '🍎' },
    { name: 'Dairy', icon: '🥛' },
    { name: 'Bakery', icon: '🍞' },
    { name: 'Meat', icon: '🥩' },
    { name: 'Vegetables', icon: '🥬' },
    { name: 'Beverages', icon: '🥤' }
];

const CATEGORY_ICONS = {
    'Fruits': '🍎',
    'Dairy': '🥛',
    'Bakery': '🍞',
    'Meat': '🥩',
    'Vegetables': '🥬',
    'Beverages': '🥤'
};

const EMOJI_OPTIONS = [
    '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝',
    '🍅', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠',
    '🍞', '🥐', '🥖', '🥨', '🥯', '🥞', '🧇', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔', '🍟', '🍕',
    '🌭', '🥪', '🌮', '🌯', '🫔', '🥙', '🧆', '🥚', '🍳', '🥘', '🍲', '🫕', '🥣', '🥗', '🍿',
    '🧈', '🧂', '🥫', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥',
    '🥮', '🍡', '🥟', '🥠', '🥡', '🦀', '🦞', '🦐', '🦑', '🦪', '🍦', '🍧', '🍨', '🍩', '🍪',
    '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '🥛', '☕', '🫖', '🍵', '🍶',
    '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🫗', '🥤', '🧋', '🧃', '🧉', '🧊',
    '🏪', '🏬', '🛒', '🛍️', '💰', '💳', '🎁', '📦', '🏷️', '🔖', '📌', '📍', '✨', '⭐', '🌟'
];

class POSApp extends React.Component {
    constructor(props) {
        super(props);
        
        // Load data from localStorage or use defaults
        const savedProducts = localStorage.getItem('products');
        const savedCategories = localStorage.getItem('categories');
        
        this.state = {
            cart: [],
            selectedCategory: 'All',
            products: savedProducts ? JSON.parse(savedProducts) : SAMPLE_PRODUCTS,
            categories: savedCategories ? JSON.parse(savedCategories) : CATEGORIES,
            showManagement: false,
            newProduct: { name: '', price: '', category: 'Fruits' },
            newCategory: { name: '', icon: '📦' },
            successMessage: ''
        };
    }
    
    componentDidUpdate(prevProps, prevState) {
        // Save to localStorage when products or categories change
        if (prevState.products !== this.state.products) {
            localStorage.setItem('products', JSON.stringify(this.state.products));
        }
        if (prevState.categories !== this.state.categories) {
            localStorage.setItem('categories', JSON.stringify(this.state.categories));
        }
    }

    addToCart = (product) => {
        const { cart } = this.state;
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            this.setState({
                cart: cart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            });
        } else {
            this.setState({
                cart: [...cart, { ...product, quantity: 1 }]
            });
        }
    };

    updateQuantity = (productId, change) => {
        const { cart } = this.state;
        this.setState({
            cart: cart.map(item =>
                item.id === productId
                    ? { ...item, quantity: Math.max(1, item.quantity + change) }
                    : item
            )
        });
    };

    removeFromCart = (productId) => {
        this.setState({
            cart: this.state.cart.filter(item => item.id !== productId)
        });
    };

    clearCart = () => {
        this.setState({ cart: [] });
    };

    calculateTotal = () => {
        return this.state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    checkout = () => {
        if (this.state.cart.length === 0) return;

        const receiptData = {
            items: this.state.cart,
            total: this.calculateTotal()
        };

        ipcRenderer.send('print-receipt', receiptData);
        
        alert('Receipt sent to printer!');
        this.clearCart();
    };

    selectCategory = (categoryName) => {
        this.setState({ selectedCategory: categoryName });
    };

    getFilteredProducts = () => {
        const { products, selectedCategory } = this.state;
        if (selectedCategory === 'All') {
            return products;
        }
        return products.filter(product => product.category === selectedCategory);
    };
    
    getCategoryIcon = (categoryName) => {
        const { categories } = this.state;
        const category = categories.find(cat => cat.name === categoryName);
        return category ? category.icon : (CATEGORY_ICONS[categoryName] || '📦');
    };
    
    toggleManagement = () => {
        this.setState({ showManagement: !this.state.showManagement });
    };
    
    handleProductInputChange = (field, value) => {
        this.setState({
            newProduct: { ...this.state.newProduct, [field]: value }
        });
    };
    
    handleCategoryInputChange = (field, value) => {
        this.setState({
            newCategory: { ...this.state.newCategory, [field]: value }
        });
    };
    
    addProduct = () => {
        const { newProduct, products } = this.state;
        
        if (!newProduct.name || !newProduct.price) {
            alert('Please fill in all fields');
            return;
        }
        
        const product = {
            id: Date.now(),
            name: newProduct.name,
            price: parseFloat(newProduct.price),
            category: newProduct.category
        };
        
        this.setState({
            products: [...products, product],
            newProduct: { name: '', price: '', category: newProduct.category },
            successMessage: '✅ Product added!'
        });
        
        setTimeout(() => this.setState({ successMessage: '' }), 2000);
    };
    
    addCategory = () => {
        const { newCategory, categories } = this.state;
        
        if (!newCategory.name || !newCategory.icon) {
            alert('Please fill in all fields');
            return;
        }
        
        const category = {
            name: newCategory.name,
            icon: newCategory.icon
        };
        
        this.setState({
            categories: [...categories, category],
            newCategory: { name: '', icon: '📦' },
            successMessage: '✅ Category added!'
        });
        
        setTimeout(() => this.setState({ successMessage: '' }), 2000);
    };
    
    deleteProduct = (productId) => {
        if (confirm('Are you sure you want to delete this product?')) {
            this.setState({
                products: this.state.products.filter(p => p.id !== productId)
            });
        }
    };
    
    deleteCategory = (categoryName) => {
        if (categoryName === 'All') {
            alert('Cannot delete "All" category');
            return;
        }
        
        if (confirm('Are you sure you want to delete this category? Products in this category will not be deleted.')) {
            this.setState({
                categories: this.state.categories.filter(c => c.name !== categoryName)
            });
        }
    };

    render() {
        const { cart, selectedCategory, showManagement, products, categories, newProduct, newCategory, successMessage } = this.state;
        const total = this.calculateTotal();
        const filteredProducts = this.getFilteredProducts();

        return React.createElement('div', { id: 'root' },
            // Categories Section
            React.createElement('div', { className: 'categories-section' },
                React.createElement('div', { className: 'categories-header' }, 'Categories'),
                React.createElement('div', { className: 'categories-list' },
                    categories.map(category =>
                        React.createElement('button', {
                            key: category.name,
                            className: `category-btn ${category.name === selectedCategory ? 'active' : ''}`,
                            onClick: () => this.selectCategory(category.name)
                        }, `${category.icon} ${category.name}`)
                    )
                ),
                React.createElement('button', {
                    className: 'manage-btn',
                    onClick: this.toggleManagement
                }, '⚙️ Manage')
            ),

            // Products Section
            React.createElement('div', { className: 'products-section' },
                React.createElement('div', { className: 'products-header' }, 
                    selectedCategory === 'All' ? 'All Products' : selectedCategory
                ),
                React.createElement('div', { className: 'products-grid' },
                    filteredProducts.map(product =>
                        React.createElement('div', {
                            key: product.id,
                            className: 'product-card',
                            onClick: () => this.addToCart(product)
                        },
                            React.createElement('div', { 
                                className: 'product-name',
                                style: { display: 'flex', alignItems: 'center', gap: '8px' }
                            }, 
                                React.createElement('span', { style: { fontSize: '24px' } }, this.getCategoryIcon(product.category)),
                                product.name
                            ),
                            React.createElement('div', { className: 'product-price' }, `€${product.price.toFixed(2)}`),
                            React.createElement('div', { className: 'product-category' }, product.category)
                        )
                    )
                )
            ),

            // Cart Section
            React.createElement('div', { className: 'cart-section' },
                React.createElement('div', { className: 'cart-header' }, 'Shopping Cart'),
                React.createElement('div', { className: 'cart-items' },
                    cart.length === 0
                        ? React.createElement('div', { className: 'cart-empty' }, 'Cart is empty')
                        : cart.map(item =>
                            React.createElement('div', { key: item.id, className: 'cart-item' },
                                React.createElement('div', { className: 'cart-item-info' },
                                    React.createElement('div', { className: 'cart-item-name' }, item.name),
                                    React.createElement('div', { className: 'cart-item-price' }, `€${item.price.toFixed(2)}`)
                                ),
                                React.createElement('div', { className: 'cart-item-quantity' },
                                    React.createElement('button', {
                                        className: 'qty-btn',
                                        onClick: () => this.updateQuantity(item.id, -1)
                                    }, '-'),
                                    React.createElement('span', { className: 'qty-display' }, item.quantity),
                                    React.createElement('button', {
                                        className: 'qty-btn',
                                        onClick: () => this.updateQuantity(item.id, 1)
                                    }, '+')
                                ),
                                React.createElement('button', {
                                    className: 'remove-btn',
                                    onClick: () => this.removeFromCart(item.id)
                                }, '×')
                            )
                        )
                ),
                React.createElement('div', { className: 'cart-footer' },
                    React.createElement('div', { className: 'cart-total' },
                        `Total: €${total.toFixed(2)}`
                    ),
                    React.createElement('div', { className: 'cart-actions' },
                        React.createElement('button', {
                            className: 'btn-checkout',
                            onClick: this.checkout,
                            disabled: cart.length === 0
                        }, 'Checkout & Print'),
                        React.createElement('button', {
                            className: 'btn-clear',
                            onClick: this.clearCart
                        }, 'Clear Cart')
                    )
                )
            ),

            // Management Panel
            showManagement && React.createElement('div', { 
                className: 'management-overlay'
            },
                React.createElement('div', { 
                    className: 'management-panel'
                },
                    React.createElement('div', { className: 'management-header' },
                        React.createElement('h2', {}, '⚙️ Manage Products & Categories'),
                        React.createElement('button', {
                            className: 'close-btn',
                            onClick: this.toggleManagement
                        }, '✕')
                    ),
                    
                    React.createElement('div', { className: 'management-content' },
                        // Success Message
                        successMessage && React.createElement('div', { className: 'success-message' }, successMessage),
                        
                        // Add Product Section
                        React.createElement('div', { className: 'management-section' },
                            React.createElement('h3', {}, '📦 Add New Product'),
                            React.createElement('div', { className: 'form-group' },
                                React.createElement('label', {}, 'Product Name:'),
                                React.createElement('input', {
                                    type: 'text',
                                    placeholder: 'Enter product name',
                                    value: newProduct.name,
                                    onChange: (e) => {
                                        e.stopPropagation();
                                        this.handleProductInputChange('name', e.target.value);
                                    },
                                    onClick: (e) => e.stopPropagation()
                                })
                            ),
                            React.createElement('div', { className: 'form-group' },
                                React.createElement('label', {}, 'Price (€):'),
                                React.createElement('input', {
                                    type: 'number',
                                    step: '0.01',
                                    placeholder: '0.00',
                                    value: newProduct.price,
                                    onChange: (e) => {
                                        e.stopPropagation();
                                        this.handleProductInputChange('price', e.target.value);
                                    },
                                    onClick: (e) => e.stopPropagation()
                                })
                            ),
                            React.createElement('div', { className: 'form-group' },
                                React.createElement('label', {}, 'Category:'),
                                React.createElement('select', {
                                    value: newProduct.category,
                                    onChange: (e) => {
                                        e.stopPropagation();
                                        this.handleProductInputChange('category', e.target.value);
                                    },
                                    onClick: (e) => e.stopPropagation()
                                },
                                    categories.filter(c => c.name !== 'All').map(cat =>
                                        React.createElement('option', { key: cat.name, value: cat.name }, 
                                            `${cat.icon} ${cat.name}`
                                        )
                                    )
                                )
                            ),
                            React.createElement('button', {
                                className: 'btn-add',
                                onClick: this.addProduct
                            }, '➕ Add Product')
                        ),
                        
                        // Add Category Section
                        React.createElement('div', { className: 'management-section' },
                            React.createElement('h3', {}, '🏷️ Add New Category'),
                            React.createElement('div', { className: 'form-group' },
                                React.createElement('label', {}, 'Category Name:'),
                                React.createElement('input', {
                                    type: 'text',
                                    placeholder: 'Enter category name',
                                    value: newCategory.name,
                                    onChange: (e) => {
                                        e.stopPropagation();
                                        this.handleCategoryInputChange('name', e.target.value);
                                    },
                                    onClick: (e) => e.stopPropagation()
                                })
                            ),
                            React.createElement('div', { className: 'form-group' },
                                React.createElement('label', {}, 'Icon (Emoji):'),
                                React.createElement('select', {
                                    className: 'emoji-select',
                                    value: newCategory.icon,
                                    onChange: (e) => {
                                        e.stopPropagation();
                                        this.handleCategoryInputChange('icon', e.target.value);
                                    },
                                    onClick: (e) => e.stopPropagation()
                                },
                                    EMOJI_OPTIONS.map(emoji =>
                                        React.createElement('option', { 
                                            key: emoji, 
                                            value: emoji,
                                            style: { fontSize: '20px' }
                                        }, emoji)
                                    )
                                )
                            ),
                            React.createElement('button', {
                                className: 'btn-add',
                                onClick: this.addCategory
                            }, '➕ Add Category')
                        ),
                        
                        // Product List
                        React.createElement('div', { className: 'management-section full-width' },
                            React.createElement('h3', {}, '📋 Product List'),
                            React.createElement('div', { className: 'product-list' },
                                products.map(product =>
                                    React.createElement('div', { key: product.id, className: 'product-item' },
                                        React.createElement('span', {}, `${this.getCategoryIcon(product.category)} ${product.name}`),
                                        React.createElement('span', {}, `€${product.price.toFixed(2)}`),
                                        React.createElement('span', { className: 'category-tag' }, product.category),
                                        React.createElement('button', {
                                            className: 'btn-delete',
                                            onClick: () => this.deleteProduct(product.id)
                                        }, '🗑️')
                                    )
                                )
                            )
                        ),
                        
                        // Category List
                        React.createElement('div', { className: 'management-section full-width' },
                            React.createElement('h3', {}, '🏷️ Category List'),
                            React.createElement('div', { className: 'category-list' },
                                categories.map(category =>
                                    React.createElement('div', { key: category.name, className: 'category-item' },
                                        React.createElement('span', {}, `${category.icon} ${category.name}`),
                                        category.name !== 'All' && React.createElement('button', {
                                            className: 'btn-delete',
                                            onClick: () => this.deleteCategory(category.name)
                                        }, '🗑️')
                                    )
                                )
                            )
                        )
                    )
                )
            )
        );
    }
}

// Render the app
ReactDOM.render(
    React.createElement(POSApp),
    document.getElementById('root')
);
