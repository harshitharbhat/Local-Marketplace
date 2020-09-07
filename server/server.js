import express from "express";
import makeRoutes from './routes.js';

const MongoClient = require('mongodb').MongoClient;
const uri = SERVER_URL;
const app = express();

MongoClient.connect(uri, {
    useUnifiedTopology: true
}, (err, client) => {
    if (err) return console.error(err);
    console.log('Connected to Database');
    makeRoutes(app, client);
});