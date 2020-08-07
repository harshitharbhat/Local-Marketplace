import express from "express";
import makeRoutes from './routes.js';

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://COEN296User:COEN296AIndiaMarketPlace@COEN296A-nimur.mongodb.net/COEN296A?retryWrites=true&w=majority";
const app = express();

MongoClient.connect(uri, {
    useUnifiedTopology: true
}, (err, client) => {
    if (err) return console.error(err);
    console.log('Connected to Database');
    makeRoutes(app, client);
});