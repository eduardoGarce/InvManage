const mongoose = require('mongoose');

const entrieSchema = new mongoose.Schema({
    name: String,
    code: String,
    lot: String,
    manufacturer: String,
    quantity: String,
    unit: String,
    unitPrice: String,
    currency: String,
    totalPrice: String,
    alertAmounts: Array,
    date: String,
    editDate: String,
    description: String,
    isEditable : Boolean,
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