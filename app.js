require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const logoutRouter = require('./controllers/logout');
const entriesRouter = require('./controllers/entries');
const stockRouter = require('./controllers/stock');
const salesRouter = require('./controllers/sales');
const { userExtractor } = require('./middleware/auth');
const { MONGO_URI } = require('./config');

(async() => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Conectado a mongoDB');
    } catch (error) {
        console.log(error)
    }
})()

//middleware
app.use(cors());
app.use(cookieParser())
app.use(express.json());

//Rutas Fronted
app.use('/', express.static(path.resolve('views', 'home')));
app.use('/styles', express.static(path.resolve('views', 'styles')));
app.use('/signup', express.static(path.resolve('views', 'signup')));
app.use('/login', express.static(path.resolve('views', 'login')));
app.use('/entries', express.static(path.resolve('views', 'entries')));
app.use('/stock', express.static(path.resolve('views', 'stock')));
app.use('/sales', express.static(path.resolve('views', 'sales')));
app.use('/dashboard', express.static(path.resolve('views', 'dashboard')));
app.use('/components', express.static(path.resolve('views', 'components')));
app.use('/img', express.static(path.resolve('img')));
app.use('/verify/:id/:token', express.static(path.resolve('views', 'verify')));

app.use(morgan('tiny'));

//Rutas de backend
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/entries', userExtractor, entriesRouter);
app.use('/api/stock', userExtractor, stockRouter);
app.use('/api/sales', userExtractor, salesRouter);

module.exports = app;