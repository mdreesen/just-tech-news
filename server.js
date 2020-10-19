const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
// adding the path to require the css
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// serves as static asset
app.use(express.static(path.join(__dirname, 'public')));

// turn on routes
app.use(routes);

// require handlebars
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});

// connect to handlbars engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// force: false is this would drop all db tables on startup
// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});