const mongoose = require('mongoose');

const entrieSchema = new mongoose.Schema({
    name: String,
    code: String,
    lot: String,
    manufacturer: String,
    quantity: Number,
    unit: String,
    unitPrice: Number,
    currency: String,
    totalPrice: Number,
    alertAmounts: Array,
    date: Date,
    editDate: {
        type: Date,
        default: null,
    },
    description: String,
    isEditable : {
        type: Boolean,
        default: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

entrieSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Entrie = mongoose.model('Entrie', entrieSchema); 

module.exports = Entrie;