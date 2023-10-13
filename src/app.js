const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const mongodbStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const helmet = require('helmet');
const path = require('path');

const MONGODB_URI = `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASS}@cluster0.nizvwnm.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`;

const app = express();
app.use(helmet());
const store = new mongodbStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'src/views');

const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoute');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'thisshouldbealongstringvalue', 
    resave: false, 
    saveUninitialized: false, 
    store: store,
    cookie: {
        maxAge: 20000
    }
}));
app.use(flash());

app.use(authRoutes);
app.use(userRoutes);

app.use((error, req, res, next) => {
    console.log(error)
    const status = error.statusCode || 500;
    res.status(500).render('500', {pageTitle: 'Error!', path: '/500'})
});

mongoose.connect(MONGODB_URI)
    .then(result => {
        app.listen(process.env.PORT)
    })
    .catch(err => console.log(err));
