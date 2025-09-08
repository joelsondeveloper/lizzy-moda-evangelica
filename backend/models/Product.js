const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    size: {
        type: [String],
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    inStock: {
        type: Boolean,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);