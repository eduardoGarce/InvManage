const salesRouter = require('express').Router();
const Entrie = require('../models/entrie');
const Stock = require('../models/stock');
const Sale = require('../models/sale');

salesRouter.get('/', async (request, response) => {
    const user = request.user;
    const sales = await Sale.find({ user: user.id });

    return response.status(200).json(sales);
})

salesRouter.get('/top-bottom', async (request, response) => {
    try {
        const user = request.user;
        const lastDateComparation = new Date();
        lastDateComparation.setDate(lastDateComparation.getDate() - 30);

        //Filtrar las salidas en los ultimos 30 días, $gte significa igual o mayor que, accede a la propiedad date de cada producto y comprobando si es mayor o igual a la fecha de comparacion
        const salesLastMonth = await Sale.find({ date: { $gte: lastDateComparation }, user: user.id });

        //Retornar un mensaje en caso de que no se encuentre ninguna entrada
        if (!salesLastMonth) {
            return response.status(200).json({ error: 'No hay ventas registradas ultimamente' });
        }
        
        //Contar cuántas veces se ha registrado cada producto
        const productCounts = salesLastMonth.reduce((acc, sale) => {
            //acc es el contador y salida representa el editable actual, declara que el contador sera un objeto con el valor de codigo como nombre de la propiedad sumandole 1 por cada vez que lo encuentre
            acc[sale.code] = (acc[sale.code] || 0) + 1;
            //Retornar el contador actualizado para guardarlo
            return acc;
        }, {});
        
        //Convertir a array y ordenar
        const sortedProducts = Object.entries(productCounts)
        .map(([code, count]) => ({ code, count }))
        .sort((a, b) => b.count - a.count);
        
        //Comprobar la longitud del array y en base a eso decidir que se devolverá en la respuesta
        if (sortedProducts.length === 6) {
            //Tomar los 3 productos con más y menos ventas
            const top3 = sortedProducts.slice(0, 3);
            const bottom3 = sortedProducts.slice(3);
            return response.status(200).json({ top3, bottom3 });

        } else if (sortedProducts.length < 6 && sortedProducts.length > 3) {
            //Tomar los 3 productos con más ventas y el resto con menos ventas
            const top3 = sortedProducts.slice(0, 3);
            const bottom = sortedProducts.slice(3);
            return response.status(200).json({ top3, bottom });

        } else if (sortedProducts.length <= 3) {
            //Se devuelve en el cuerpo de la respuesta a el array completo
            return response.status(200).json({ sortedProducts });
        }
    } catch (error) {
        response.status(500).json({ error: 'Error al obtener productos más y menos vendidos' });
    }
});

salesRouter.post('/', async (request, response) => {
    //Extraer usuario y añadir el array de productos a una constante
    const user = request.user;
    const product = request.body;
    const date = new Date(new Date().getTime() - 4 * 60 * 60 * 1000);

    const { name, code, manufacturer, quantity, unit, unitPrice, currency, totalPrice, description } = product;
    
    const quantityNumber = Number(quantity);
    const unitPriceNumber = Number(unitPrice);
    const totalPriceNumber = Number(totalPrice);

    //Comprobar que todos los datos sean diferentes de null o undefine
    if (!name || !code || !manufacturer || !quantity || !unit || !unitPrice || !currency || !totalPrice) {
        return response.status(400).json({ error:'Todos los datos son requeridos' });
    }
    //Comprobar que los valores numericos sean diferentes de NaN
    if (!quantityNumber || !unitPriceNumber || !totalPrice) {
        return response.status(400).json({ error:'El precio unitario, el precio total, la cantidad y los numeros de alerta deben ser números validos' });
    }
    //Comprobar que todos los valores numéricos sean mayores que 0
    if (quantityNumber < 1 || unitPriceNumber < 1 || totalPrice < 1) {
        return response.status(400).json({ error:'Los datos numéricos deben de ser valores positivos mayores que 0' });
    }

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
    await Stock.findOneAndUpdate({ code }, { $inc: { quantity: -quantityNumber, totalPrice: -totalPriceNumber }, $set: { lastExitDate: date }});

    //Actualizar la propiedad isEditable de las entradas que posean los mismos codigos que el producto registrado en la salida, se usa $set porque de lo contrario todo el documento sería reemplazado
    await Entrie.updateMany({ code, isEditable: true }, { $set: { isEditable: false }});  

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
    
    //Comprobar que todos los datos sean diferentes de null o undefine
    if (!nameEdit || !codeEdit || !manufacturerEdit || !quantityEdit || !unitEdit || !unitPriceEdit || !currencyEdit || !totalPriceEdit) {
        return response.status(400).json({ error:'Todos los datos son requeridos' });
    }
    //Comprobar que los valores numericos sean diferentes de NaN
    if (!quantityNumber || !unitPriceNumber || !totalPriceNumber) {
        return response.status(400).json({ error:'El precio unitario, el precio total, la cantidad y los numeros de alerta deben ser números validos' });
    }
    if (quantityNumber < 1 || unitPriceNumber < 1 || totalPriceNumber < 1) {
        return response.status(400).json({ error:'Los datos numéricos deben de ser valores positivos mayores que 0' });
    }
    
    // const productOriginal = await Sale.findOne({ code: codeEdit });
    const productOriginal = await Sale.findById(id);
    console.log(productOriginal);

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