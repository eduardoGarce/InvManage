const stockRouter = require('express').Router();
const Stock = require('../models/stock');

stockRouter.get('/', async (request, response) => {
    const user = request.user;
    const stocks = await Stock.find({ user: user.id });

    return response.status(200).json(stocks);
})

module.exports = stockRouter;