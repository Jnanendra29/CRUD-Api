const express = require('express');
const mongoose = require('mongoose');
const routes = require('./Routes/routes');
const url = 'mongodb://127.0.0.1:27017/crudAPI'

const app = express();
const PORT = 4000;

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const con = mongoose.connection

con.on('open', () => {
    console.log('connected...')
})


app.use(express.json());

app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});