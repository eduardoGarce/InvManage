const salesRouter = require('express').Router();
const Entrie = require('../models/entrie');
const Stock = require('../models/stock');
const Sale = require('../models/sale');

salesRouter.get('/', async (request, response) => {
    const user = request.user;
    const sales = await Sale.find({ user: user.id });

    return response.status(200).json(sales);
})

salesRouter.post('/', async (request, response) => {
    //Extraer usuario y añadir el array de productos a una constante
    const user = request.user;
    const product = request.body;
    const date = new Date(new Date().getTime() - 4 * 60 * 60 * 1000);

    const { name, code, manufacturer, quantity, unit, unitPrice, currency, totalPrice, description } = product[0];
    const quantityNumber = Number(quantity);
    const unitPriceNumber = Number(unitPrice);
    const totalPriceNumber = Number(totalPrice);

    const newSale = new Sale({
        name,
        code,
        manufacturer,
        quantity: quantityNumber,
        unit,
        unitPrice: unitPriceNumber,
        currency,
        totalPrice: totalPriceNumber,
        date: date,
        description,
        user: user._id
    });

    const savedSale = await newSale.save();
    user.sales = user.sales.concat(savedSale._id);
    await user.save();

    //Restar la cantidad que sale del producto en stock
    await Stock.findOneAndUpdate({ code }, { $inc: { quantity: -quantityNumber }});

    //Actualizar la propiedad isEditable de las entradas que posean los mismos codigos que el producto registrado en la salida, se usa $set porque de lo contrario todo el documento sería reemplazado
    await Entry.updateMany({ codigo, isEditable: true }, { $set: { isEditable: false }});  

    return response.sendStatus(200);
})

salesRouter.patch('/:id', async (request, response) => {
    const user = request.user;
    const id = request.params.id;
    const date = new Date(new Date().getTime() - 4 * 60 * 60 * 1000);

    const { nameEdit, codeEdit, manufacturerEdit, quantityEdit, unitEdit, unitPriceEdit, currencyEdit, totalPriceEdit, descriptionEdit } = request.body;
    const quantityNumber = Number(quantityEdit);
    const unitPriceNumber = Number(unitPriceEdit);
    const totalPriceNumber = Number(totalPriceEdit);

    //Extraer el producto del stock que corresponde a la salida
    const stockProduct = await Stock.find({code: codeEdit});

    //Actualizar los datos del producto en la coleccion de entradas
    await Sale.findByIdAndUpdate(id, { 
        name: nameEdit,
        code: codeEdit,
        manufacturer: manufacturerEdit,
        quantity: quantityNumber,
        unit: unitEdit,
        unitPrice: unitPriceNumber,
        currency: currencyEdit,
        totalPrice: totalPriceNumber,
        editDate: date,
        description: descriptionEdit
    });

    if (stockProduct.code != codeEdit) {
        await Stock.findOneAndUpdate({ code: stockProduct.code }, { $inc: { quantity: +quantityNumber }}, { $inc: { totalPrice: +totalPriceNumber }})
    } else {
        
    }

    return response.sendStatus(200);
})

module.exports = salesRouter;