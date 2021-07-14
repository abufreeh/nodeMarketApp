const express = require('express');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static('images'));

const csrfProtection = csrf();

const mongoDbUrl = 'mongodb+srv://nodeMarketUser:Aa12341234@cluster0.ikdwu.mongodb.net/nodeMarketDb?retryWrites=true&w=majority';
const store = new MongoDbStore({ uri: mongoDbUrl, collection: 'session' });
app.use(session({
    secret: 'I3aBUuB2dR2A8WKwCkUbuud8k4cn262C',
    resave: false,
    saveUninitialized: false,
    store: store
}));

app.use(csrfProtection);

app.use((request, response, next) => {
    if (!request.session.account) {
        return next();
    }
    account.findById(request.session.account._id)
        .then(account => {
            request.account = account;
            next();
        })
        .catch(error => {
            console.log(error);
        });
});

app.use((request, response, next) => {
    response.locals.csrfToken = request.csrfToken();
    next();
});

const indexRouter = require('./controllers');
app.use('/', indexRouter);

const actionRouter = require('./controllers/actions');
app.use('/actions', actionRouter);

const dashboardRouter = require('./controllers/dashboard');
app.use('/dashboard', dashboardRouter);


const port = 6020;

mongoose.connect(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(connected_success => {
        app.listen(port, function () {
            console.log(`${port} is listening...`);
        });
    });