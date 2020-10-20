const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
// adding the path to require the css
const path = require('path');
// adding express session to see the users sessions
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
// require handlebars
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});

const app = express();
const PORT = process.env.PORT || 3001;

// adding the sess here for user sessions
const sess = {
    secret: 'Super secret secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// serves as static asset
app.use(express.static(path.join(__dirname, 'public')));

// putting the app.use below the const sess
app.use(session(sess));

// turn on routes
app.use(routes);

// connect to handlbars engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// force: false is this would drop all db tables on startup
// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});