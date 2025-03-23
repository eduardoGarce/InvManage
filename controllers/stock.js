const stockRouter = require('express').Router();
const Stock = require('../models/stock');
const Sale = require('../models/sale');

stockRouter.get('/', async (request, response) => {
    const user = request.user;
    const stocks = await Stock.find({ user: user.id });

    return response.status(200).json(stocks);
})

stockRouter.get('/top-bottom', async (request, response) => {
    try {
        const lastDateComparation = new Date();
        lastDateComparation.setDate(lastDateComparation.getDate() - 30);

        //Filtrar las salidas en los ultimos 30 días, $gte significa igual o mayor que, accede a la propiedad date de cada producto y comprobando si es mayor o igual a la fecha de comparacion
        const salesLastMonth = await Sale.find({ date: { $gte: lastDateComparation } });
        
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

        //Tomar los 3 productos con más y menos ventas
        const top3 = sortedProducts.slice(0, 3);
        const bottom3 = sortedProducts.slice(-3);

        return response.json({ top3, bottom3 });
    } catch (error) {
        response.status(500).json({ error: 'Error al obtener productos más y menos vendidos' });
    }
});

module.exports = stockRouter;