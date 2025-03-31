const entriesRouter = require('express').Router();
const Entrie = require('../models/entrie');
const Stock = require('../models/stock');

entriesRouter.get('/', async (request, response) => {
    const user = request.user;
    const entries = await Entrie.find({ user: user.id });

    return response.status(200).json(entries);
})

entriesRouter.post('/', async (request, response) => {
    //Extraer usuario y añadir el array de productos a una constante
    const user = request.user;
    const products = request.body;
    const date = new Date(new Date().getTime() - 4 * 60 * 60 * 1000);
    //Si hay un solo producto en el array extraemos sus datos y los guardamos pero si hay varios entonces iteramos sobre cada producto para guardarlos uno a uno en la base de datos
    if (products.length != 1) {
        for (const product of products) {
            const { name, code, lot, manufacturer, quantity, unit, unitPrice, currency, totalPrice, alertAmounts, description } = product;

            const quantityNumber = Number(quantity);
            const unitPriceNumber = Number(unitPrice);
            const totalPriceNumber = Number(totalPrice);
            const alertsNumber = alertAmounts.map(Number);

            //Comprobar que todos los datos sean diferentes de null o undefine
            if (!name || !code || !lot || !manufacturer || !quantity || !unit || !unitPrice || !currency || !totalPrice || !alertAmounts[0] || !alertAmounts[1] || !alertAmounts[2]) {
                return response.status(400).json({ error:'Todos los datos son requeridos' });
            }
            //Comprobar que los valores numericos sean diferentes de NaN
            if (!quantityNumber || !unitPriceNumber || !totalPrice || !alertAmounts[0] || !alertAmounts[1] || !alertAmounts[2]) {
                return response.status(400).json({ error:'El precio unitario, el precio total, la cantidad y los numeros de alerta deben ser números validos' });
            }
            //Comprobar que todos los valores numéricos sean mayores que 0
            if (quantityNumber < 1 || unitPriceNumber < 1 || totalPrice < 1 || alertAmounts[0] < 1 || alertAmounts[1] < 1 || alertAmounts[2] < 1) {
                return response.status(400).json({ error:'Los datos numéricos deben de ser valores positivos mayores que 0' });
            }

            const newEntrie = new Entrie({
                name,
                code,
                lot,
                manufacturer,
                quantity: quantityNumber,
                unit,
                unitPrice: unitPriceNumber,
                currency,
                totalPrice: totalPriceNumber,
                alertAmounts: alertsNumber,
                date: date,
                description,
                user: user._id
            });

            //Guardar en la coleccion de entradas el nuevo documento creado
            const savedEntrie = await newEntrie.save();
            //Añadir el id del nuevo producto a su respectivo usuario y guardar los cambios
            user.entries = user.entries.concat(savedEntrie._id);
            await user.save();

            //Buscar por medio del id del usuario, si existe un producto en la coleccion de stock que posea el mismo codigo
            const productStock = await Stock.findOne({code});

            if (productStock) {
                const quantityUpdate = productStock.quantity + quantityNumber;
                //Si existe el producto se buesca mediante su codigo y se actualizan la cantidad y la fecha de la ultima entrada
                await Stock.findOneAndUpdate({ code }, { quantity: quantityUpdate }, { lastEntryDate: date });
            } else {
                const newProduct = new Stock({
                    name,
                    code,
                    manufacturer,
                    quantity: quantityNumber,
                    unit,
                    unitPrice: unitPriceNumber,
                    currency,
                    totalPrice: totalPriceNumber,
                    alertAmounts: alertsNumber,
                    lastEntryDate: date,
                    description,
                    user: user._id
                });
                const savedProductStock = await newProduct.save();

                //Añadir el id del nuevo producto a su respectivo usuario y guardar los cambios en la coleccion de stock
                user.stock = user.stock.concat(savedProductStock._id);
                await user.save();
            }
        }
    } else {
        const { name, code, lot, manufacturer, quantity, unit, unitPrice, currency, totalPrice, alertAmounts, description } = products[0];
        const quantityNumber = Number(quantity);
        const unitPriceNumber = Number(unitPrice);
        const totalPriceNumber = Number(totalPrice);
        const alertsNumber = alertAmounts.map(Number);

        //Comprobar que todos los datos sean diferentes de null o undefine
        if (!name || !code || !lot || !manufacturer || !quantity || !unit || !unitPrice || !currency || !totalPrice || !alertAmounts[0] || !alertAmounts[1] || !alertAmounts[2] || !description) {
            return response.status(400).json({ error:'Todos los datos son requeridos' });
        }
        //Comprobar que los valores numericos sean diferentes de NaN
        if (!quantityNumber || !unitPriceNumber || !totalPrice || !alertAmounts[0] || !alertAmounts[1] || !alertAmounts[2]) {
            return response.status(400).json({ error:'El precio unitario, el precio total, la cantidad y los numeros de alerta deben ser números validos' });
        }
        if (quantityNumber < 1 || unitPriceNumber < 1 || totalPrice < 1 || alertAmounts[0] < 1 || alertAmounts[1] < 1 || alertAmounts[2] < 1) {
            return response.status(400).json({ error:'Los datos numéricos deben de ser valores positivos mayores que 0' });
        }

        const newEntrie = new Entrie({
            name,
            code,
            lot,
            manufacturer,
            quantity: quantityNumber,
            unit,
            unitPrice: unitPriceNumber,
            currency,
            totalPrice: totalPriceNumber,
            alertAmounts: alertsNumber,
            date: date,
            description,
            user: user._id
        });

        const savedEntrie = await newEntrie.save();
        user.entries = user.entries.concat(savedEntrie._id);
        await user.save();
        
        //Buscar por medio del id del usuario, si existe un producto en la coleccion de stock que posea el mismo codigo
        const productStock = await Stock.findOne({ code });

        if (productStock) {
            const quantityUpdate = productStock.quantity + quantityNumber;
            //Si existe el producto se buesca mediante su codigo y se actualizan la cantidad y la fecha de la ultima entrada
            await Stock.findOneAndUpdate({ code }, { quantity: quantityUpdate }, { lastEntryDate: date });
        } else {
            const newProduct = new Stock({
                name,
                code,
                manufacturer,
                quantity: quantityNumber,
                unit,
                unitPrice: unitPriceNumber,
                currency,
                totalPrice: totalPriceNumber,
                alertAmounts: alertsNumber,
                lastEntryDate: date,
                description,
                user: user._id
            });
            const savedProductStock = await newProduct.save();

            //Añadir el id del nuevo producto a su respectivo usuario y guardar los cambios en la coleccion de stock
            user.stock = user.stock.concat(savedProductStock._id);
            await user.save();
        }
    }
    return response.sendStatus(200);
})

entriesRouter.patch('/:id', async (request, response) => {
    const user = request.user;
    const id = request.params.id;
    const date = new Date(new Date().getTime() - 4 * 60 * 60 * 1000);

    const { nameEdit, codeEdit, lotEdit, manufacturerEdit, quantityEdit, unitEdit, unitPriceEdit, currencyEdit, totalPriceEdit, alertAmountsEdit, descriptionEdit } = request.body;
    const quantityNumber = Number(quantityEdit);
    const unitPriceNumber = Number(unitPriceEdit);
    const totalPriceNumber = Number(totalPriceEdit);
    const alertsNumber = alertAmountsEdit.map(Number);

    //Comprobar que todos los datos sean diferentes de null o undefine
    if (!nameEdit || !codeEdit || !lotEdit || !manufacturerEdit || !quantityEdit || !unitEdit || !unitPriceEdit || !currencyEdit || !totalPriceEdit || !alertAmountsEdit[0] || !alertAmountsEdit[1] || !alertAmountsEdit[2]) {
        return response.status(400).json({ error:'Todos los datos son requeridos' });
    }
    //Comprobar que los valores numericos sean diferentes de NaN
    if (!quantityNumber || !unitPriceNumber || !totalPriceNumber || !alertAmountsEdit[0] || !alertAmountsEdit[1] || !alertAmountsEdit[2]) {
        return response.status(400).json({ error:'El precio unitario, el precio total, la cantidad y los numeros de alerta deben ser números validos' });
    }
    if (quantityNumber < 1 || unitPriceNumber < 1 || totalPriceNumber < 1 || alertAmountsEdit[0] < 1 || alertAmountsEdit[1] < 1 || alertAmountsEdit[2] < 1) {
        return response.status(400).json({ error:'Los datos numéricos deben de ser valores positivos mayores que 0' });
    }

    const productOriginal = await Entrie.findById(id)

    //Actualizar los datos del producto en la coleccion de entradas
    await Entrie.findByIdAndUpdate(id, { 
        name: nameEdit,
        code: codeEdit, 
        lot: lotEdit,
        manufacturer: manufacturerEdit,
        quantity: quantityNumber,
        unit: unitEdit,
        unitPrice: unitPriceNumber,
        currency: currencyEdit,
        totalPrice: totalPriceNumber,
        alertAmounts: alertsNumber,
        editDate: date,
        description: descriptionEdit
    });

    //Comprobar si el codigo fue editado para determinar si se deben eliminar o crear datos en la coleccion stock
    if (productOriginal.code === codeEdit) {
        //Actualizar datos datos del producto en el stock
        await Stock.findOneAndUpdate({ code: codeEdit }, {
            name: nameEdit,
            manufacturer: manufacturerEdit,
            quantity: quantityNumber,
            unit: unitEdit,
            unitPrice: unitPriceNumber,
            currency: currencyEdit,
            totalPrice: totalPriceNumber, 
            alertAmounts: alertsNumber,
            description: descriptionEdit
        });
    } else {
        //Buscar por medio del codigo del producto en la coleccion de stock un producto que posea el mismo codigo
        const matchingProduct = await Stock.findOne({ code: codeEdit });
        //Buscar por medio del codigo antiguo en la coleccion de stock un producto que posea el mismo codigo (producto al cual anteriormente referenciaba la entrada)
        const lastMatchingProduct = await Stock.findOne({ code: productOriginal.code });

        if (matchingProduct) {
            //Remover datos de entrada del antiguo producto que compartia el anterior codigo (cantidad y precio total)
            const newQuantity = lastMatchingProduct.quantity - quantityNumber; //Calcular la nueva cantidad que tendrá el producto que anteiormente coincidia en stock
            const newTotalPrice = lastMatchingProduct.unitPrice * newQuantity; //Calcular el nuevo precio total que tendrá el producto que anteiormente coincidia en stock
            //Aplicar las actualizaciones de cantidad y precio total al antiguo producto referenciado en stock
            await Stock.findOneAndUpdate({ code: productOriginal.code }, { quantity: newQuantity, totalPrice: newTotalPrice });

            //Añadir datos de entrada del producto editado al nuevo producto en stock (cantidad y precio total)
            const quantityUpdate = matchingProduct.quantity + quantityNumber;
            const totalPriceUpdate = matchingProduct.unitPrice * quantityUpdate;
            //Aplicar las actualizaciones de cantidad y precio total al nuevo producto referenciado en stock
            await Stock.findOneAndUpdate({ code: codeEdit }, { quantity: quantityUpdate, totalPrice: totalPriceUpdate, lastEntryDate: date });

            //Comprobar si el producto al cual se le esta extrayendo la entrada es 0 y en caso de ser asi se elimina el producto
            const matchingProductUpdate = await Stock.findOne({ code: productOriginal.code });
            if (matchingProductUpdate.quantity <= 0) await Stock.findOneAndDelete({ code: productOriginal.code })
        } else {
            //En caso de no existir un producto que comparta el mismo codigo que el de la entrada editada entonces se actualiza el mismo producto en stock con todos los datos
            await Stock.findOneAndUpdate({ code: productOriginal.code }, {
                name: nameEdit,
                code: codeEdit, 
                manufacturer: manufacturerEdit,
                quantity: quantityNumber,
                unit: unitEdit,
                unitPrice: unitPriceNumber,
                currency: currencyEdit,
                totalPrice: totalPriceNumber, 
                alertAmounts: alertsNumber,
                lastEntryDate: date,
                description: descriptionEdit,
            });
        }
    }
    return response.sendStatus(200);
})

module.exports = entriesRouter;