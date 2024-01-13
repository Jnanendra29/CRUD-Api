const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    SKU: {
        type: Number,
        required: true,
    },
    additionalCost: {
        type: Number,
        required: true,
    },
    stockCount: {
        type: Number,
        required: true,
        default: 0,
    }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;