if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const index = require('./routes/index.js');

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Database Connected")).catch((err) => console.log("Unable to connect to the databse. Error: " + err));

app.use(express.static('public'));
app.set('view-engine', 'ejs');
app.use(express.urlencoded({
    extended: true
}));
app.use('/', index);

app.listen(process.env.PORT || 80);