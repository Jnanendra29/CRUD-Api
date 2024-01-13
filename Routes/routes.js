const express = require('express');
const Category = require('../Model/categorySchema');
const Product = require('../Model/productSchema');

const router = express.Router();

// 1. Create a category
router.post('/categories', async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Read all categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//3. Read a specific category
router.get('/categories/:categoryId', async (req, res) => {
    try {
        const category = await Category.findById(req.params.categoryId);
        if (!category) {
            res.status(404).json({ error: 'Category not found' });
        } else {
            res.json(category);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 1. Create a product and update category productCount
router.post('/products', async (req, res) => {
    try {
        const product = await Product.create(req.body);

        // Update category productCount
        await Category.findByIdAndUpdate(
            req.body.category,
            { $inc: { stockCount: 1 } },
            { new: true }
        );

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// 2. Read all products with their linked categories
router.get('/products', async (req, res) => {
    try {
        let query = {};
        if (req.query.name) {
            query.name = { $regex: req.query.name, $options: 'i' };
        }
        if (req.query.category) {
            query.category = req.query.category;
        }

        const products = await Product.find(query).populate('category');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    // console.log("get success");
    // res.send("working");
});

// Search products by name
router.get('/products/search', async (req, res) => {
    try {
      const productName = req.query.name;
  
      if (!productName) {
        return res.status(400).json({ error: 'Product name is required for search' });
      }
  
      const products = await Product.find({
        name: { $regex: productName, $options: 'i' }, // Case-insensitive search
      }).populate('category');
  
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// 3. Read a specific product
router.get('/products/:productId', async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId).populate(
            'category'
        );
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.json(product);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Update a product
router.put('/products/:productId', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.productId,
            req.body,
            { new: true }
        ).populate('category');
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.json(product);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 5. Delete a product and update category stockCount
router.delete('/products/:productId', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.productId);

        if (!product) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            // Update category productCount
            await Category.findByIdAndUpdate(
                product.category,
                { $inc: { stockCount: -1 } },
                { new: true }
            );

            res.json({ result: 'Product deleted successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;