const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    name: String,
    code: String,
    manufacturer: String,
    quantity: Number,
    unit: String,
    unitPrice: Number,
    currency: String,
    totalPrice: Number,
    date: Date,
    editDate: {
        type: Date,
        default: null,
    },
    description: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

saleSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Sale = mongoose.model('Sale', saleSchema); 

module.exports = Sale;