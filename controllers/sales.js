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

    const { name, code, manufacturer, quantity, unit, unitPrice, currency, totalPrice, description } = product;
    
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

    //Restar la cantidad que sale del producto en stock, el precio total y actualizar la fecha de su ultima salida
    await Stock.findOneAndUpdate({ code }, { $inc: { quantity: -quantityNumber }, $inc: { totalPrice: -totalPriceNumber }, $set: { lastExitDate: date }});

    //Actualizar la propiedad isEditable de las entradas que posean los mismos codigos que el producto registrado en la salida, se usa $set porque de lo contrario todo el documento sería reemplazado
    await Entrie.updateMany({ code, isEditable: true }, { $set: { isEditable: false }});  

    return response.sendStatus(200);
})

salesRouter.patch('/:id', async (request, response) => {
    const user = request.user;
    const id = request.params.id;
    const date = new Date(new Date().getTime() - 4 * 60 * 60 * 1000);
    const productOriginal = await Sale.findById(id)

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

    //Si existe otro producto en stock que comparta el nuevo codigo de la salida editada actualizamos los datos del antiguo y del nuevo producto
    if (stockProduct) {
        //Actualizar la cantidad y el valor total del antiguo producto que compartia el mismo codigo original en stock
        await Stock.findOneAndUpdate({ code: productOriginal.code }, { $inc: { quantity: +productOriginal.quantity }, $inc: { totalPrice: +productOriginal.totalPrice }});
        //Actualizar la cantidad y el valor total del producto que comparte el mismo codigo editado en stock
        await Stock.findOneAndUpdate({ code: codeEdit }, { $inc: { quantity: -quantityNumber }, $inc: { totalPrice: -totalPriceNumber }, $get: { lastExitDate: date }});
    } else {
        //Sumar la cantidad original que le fue restada para llevarlo a la cantidad que tenia posterior a la salida
        await Stock.findOneAndUpdate({ code: productOriginal.code }, { $inc: { quantity: +productOriginal.quantity }, $inc: { totalPrice: +productOriginal.totalPrice }});
        //Restar a la cantidad y precio total del producto sus datos editados
        await Stock.findOneAndUpdate({ code: productOriginal.code }, { $inc: { quantity: -quantityNumber }, $inc: { totalPrice: -totalPriceNumber }, $get: { lastExitDate: date }});
    }

    return response.sendStatus(200);
})

module.exports = salesRouter;