import express, { Express } from 'express';
const routes = require('./routes');
export const app: Express = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(routes);

app.listen(5000, () => {console.log('Server started on port 5000')});