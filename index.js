const express = require('express');
const { config } = require('dotenv');
const db = require('./models');
const { Product, ShoppingCart, CartItem, Order } = db;

// Create a new Express application
config();
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

// List all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll(); //sequelize method 
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Server error while fetching products');
  }
});

// Create the shopping cart
app.post('/cart', async (req, res) => {
  try {
    const createCart = await ShoppingCart.create(); //sequelize method
    res.status(201).json({ message: 'Shopping cart successfully created', shoppingcart_id: createCart.id });
  } catch (error) {
    console.error('Error creating shopping cart:', error);
    res.status(500).json({ error: 'Server error while creating shopping cart' });
  }
});

// List the shopping cart items
app.get('/cart/:shoppingcart_id', async (req, res) => {
  try {
    const { shoppingcart_id } = req.params;
    
    const listCart = await CartItem.findAll({
      where: { shoppingcart_id }, //Find all cartitems for this specific shoppincart_id
      include: [{
        model: Product,
        as: 'product',  //Alias for eager loading, helps with associations
        attributes: ['name', 'description', 'price', 'in_stock'],
      }],
    });

    if (!listCart.length) {
      return res.status(200).json([]); // Return an empty array for an empty cart
    }
    return res.status(200).json(listCart); // Return list of cart items
  } catch (error) {
    console.error('Error getting shopping cart:', error);
    res.status(500).json({ error: 'Server error while getting shopping cart' });
  }
}); 

// Add or change quantity of a shopping cart item
app.post('/cart/:shoppingcart_id', async (req, res) => {
  try {
    const { shoppingcart_id } = req.params;
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
      return res.status(400).json({ error: 'Product ID and quantity are required.' });
    }

    if (quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than 0' });
    }
    
    // Find the shopping cart
    const cart = await ShoppingCart.findByPk(shoppingcart_id);
    if (!cart) {
      return res.status(404).json({ error: 'Shopping cart not found' });
    }

    // Find the product
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Find existing cart item
    let cartItem = await CartItem.findOne({
      where: { shoppingcart_id, product_id } // Find row in cart item table
    });

    if (cartItem) {
      const newQuantity = cartItem.quantity + quantity; // Update quantity for item already in the cart
      
      // Validate that the total quantity does not exceed stock
      if (newQuantity > product.in_stock) {
        return res.status(400).json({ error: 'Quantity exceeds amount in stock for this product.' });
      }

      cartItem.quantity = newQuantity;
      await cartItem.save();
    } else {
      // If there's no existing cart item, validate it doesn't exceed stock
      if (quantity > product.in_stock) {
        return res.status(400).json({ error: 'Quantity exceeds amount in stock for this product.' });
      }

      cartItem = await CartItem.create({ shoppingcart_id, product_id, quantity }); // Create cart item if it wasn't already in cart
    }

    res.status(200).json({ message: 'Item added to shopping cart', cartItem });

  } catch (error) {
    console.error('Error fetching shopping cart:', error);
    res.status(500).send('Server error while fetching shopping cart, please try again');
  }
});


// Delete item from shopping cart completely
app.delete('/cart/:shoppingcart_id/:product_id', async (req, res) => {
  try {
    const { shoppingcart_id, product_id } = req.params;
  
    const cart = await ShoppingCart.findByPk(shoppingcart_id);
    if (!cart) {
      return res.status(404).json({ error: 'Shopping cart not found' });
    }

    const product = await Product.findByPk(product_id);
    if(!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let cartItem = await CartItem.findOne({
      where: { shoppingcart_id, product_id }
    });
    if(!cartItem) {
      return res.status(400).json({ error: 'Product not found in cart' })
    } else {
      await cartItem.destroy(); //remove it from the cart completely, sequelize method
      return res.status(200).json({ message: `Product: ${cartItem.product_id} deleted from cart` })
    }

  } catch (error) {
  console.error('Error fetching shopping cart:', error);
  res.status(500).send('Server error while fetching shopping cart, please try again.');
 }
});


// Check out the shopping cart
app.post('/cart/:shoppingcart_id/checkout', async (req, res) => {
  try {
    const { shoppingcart_id } = req.params;
    
    const cart = await ShoppingCart.findByPk(shoppingcart_id);
    if (!cart) {
      return res.status(404).json({ error: 'Shopping cart not found' });
    }

    // Find the cart items 
    const cartItems = await CartItem.findAll({ 
      where: { shoppingcart_id },
      include: {
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'price', 'in_stock']
      }
    });

    // If the user attempts to make an order on an empty cart
    if (!cartItems.length) {
      return res.status(400).json({ error: 'No items found in the cart, empty orders are not allowed' }); 
    }

    // Calculate the total order price
    let totalPrice = cartItems.reduce((sum, cartItem) => {
      return sum + cartItem.product.price * cartItem.quantity;
    }, 0);

    // Create the order
    const order = await Order.create({ shoppingcart_id, total_price: totalPrice });

    // Reduce stock for each product
    for (let cartItem of cartItems) {
      if (cartItem.product.in_stock < cartItem.quantity) {
        return res.status(400).json({ error: `Not enough stock for product: ${cartItem.product.name}` });
      }
      cartItem.product.in_stock -= cartItem.quantity;
      await cartItem.product.save();
    }

    // Clear cart after checkout
    await CartItem.destroy({ where: { shoppingcart_id } });

    // Get product names and quantities for the success message
    const purchasedItems = cartItems.map(item => ({
      product_name: item.product.name,
      quantity: item.quantity
    }));

    res.status(200).json({ 
      message: 'Checkout successful!', 
      order_id: order.id,
      total_price: totalPrice,
      purchased_items: purchasedItems
    });
  } catch (error) {
    console.error('Error while attempting to checkout:', error);
    res.status(500).json({ error: 'Server error while checking out, please try again.' });
  }
});

db.sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection error:', err));


app.listen(port, () => console.log(`Server is running on port ${port}`)); 

