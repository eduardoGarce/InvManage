const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    name: String,
    code: String,
    manufacturer: String,
    quantity: Number,
    unit: String,
    unitPrice: Number,
    currency: String,
    totalPrice: Number,
    lastEntryDate: Date,
    lastExitDate: {
        type: Date,
        default: null,
    },
    alertAmounts: Array,
    description: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

stockSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Stock = mongoose.model('Stock', stockSchema); 

module.exports = Stock;