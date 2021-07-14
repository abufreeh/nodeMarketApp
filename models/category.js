const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    categoryName: String,
    categoryOrder: Number,
    categoryImage: String,
    isVisible: Boolean,
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', categorySchema);