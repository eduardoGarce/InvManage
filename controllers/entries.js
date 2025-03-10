const entriesRouter = require('express').Router();
const User = require('../models/user');
const Entrie = require('../models/entrie');

entriesRouter.get('/', async (request, response) => {
    const user = request.user;
    const entries = await Entrie.find({ user: user.id });

    return response.status(200).json(entries);
})

entriesRouter.post('/', async (request, response) => {
    //Extraer usuario y añadir el array de productos a una constante
    const user = request.user;
    const products = request.body;
    //Si hay un solo producto en el array extraemos sus datos y los guardamos pero si hay varios entonces iteramos sobre cada producto para guardarlos uno a uno en la base de datos
    if (products.length != 1) {
        for (const product of products) {
            const { name, code, lot, manufacturer, quantity, unit, unitPrice, currency, totalPrice, alertAmounts, date, editDate, description } = product;
            const newEntrie = new Entrie({
                name,
                code,
                lot,
                manufacturer,
                quantity,
                unit,
                unitPrice,
                currency,
                totalPrice,
                alertAmounts,
                date,
                editDate,
                description,
                isEditable: true,
                user: user._id
            });

            const savedEntrie = await newEntrie.save();
            console.log(request.body);
            user.entries = user.entries.concat(savedEntrie._id);
            await user.save();
        }
        return response.sendStatus(200);
    } else {
        const { name, code, lot, manufacturer, quantity, unit, unitPrice, currency, totalPrice, alertAmounts, date, editDate, description } = products[0];
        const newEntrie = new Entrie({
            name,
            code,
            lot,
            manufacturer,
            quantity,
            unit,
            unitPrice,
            currency,
            totalPrice,
            alertAmounts,
            date,
            editDate,
            description,
            isEditable: true,
            user: user._id
        });

        const savedEntrie = await newEntrie.save();
        console.log(newEntrie);
        user.entries = user.entries.concat(savedEntrie._id);
        await user.save();
        
        return response.sendStatus(200);
    }
})

entriesRouter.patch('/:id', async (request, response) => {
    const user = request.user;

    const { nameEdit, codeEdit, lotEdit, manufacturerEdit, quantityEdit, unitEdit, unitPriceEdit, currencyEdit, totalPriceEdit, alertAmountsEdit, editDate, descriptionEdit } = request.body;

    await Entrie.findByIdAndUpdate(request.params.id, { 
        name: nameEdit,
        code: codeEdit, 
        lot: lotEdit,
        manufacturer: manufacturerEdit,
        quantity: quantityEdit,
        unitPrice: unitEdit,
        unitPrice: unitPriceEdit,
        currency: currencyEdit,
        totalPrice: totalPriceEdit, 
        alertAmounts: alertAmountsEdit,
        editDate: editDate,
        description: descriptionEdit 
    });
    
    return response.sendStatus(200);
})

module.exports = entriesRouter;