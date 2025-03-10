const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     name: String,
//     email: String,
//     passwordHash: String,
//     verified: {
//         type: Boolean,
//         default: false
//     },
//     todos: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Entrie'
//     }]
// })

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    passwordHash: String,
    verified: {
        type: Boolean,
        default: false
    },
    entries: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Entrie'
    }],
    stock: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stock'
    }],
    sales: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sales'
    }]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;