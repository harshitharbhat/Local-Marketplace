const bodyParser = require('body-parser');
const path = require('path');
import express from "express";
const upload = require('./imageUpload.js');
const redis = require("redis");
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const redisClient = redis.createClient();
const ObjectId = require('mongodb').ObjectID;

const makeRoutes = (app, client) => {
    const db = client.db('COEN296A');
    const DIST_DIR = path.join(__dirname, '../.build');
    const HTML_FILE = path.join(DIST_DIR, 'index.html');

    app.use(session({
        secret: 'SOME_SECRET',
        // create new redis store.
        store: new redisStore({
            host: 'localhost',
            port: 6379,
            client: redisClient,
            ttl: 3000
        }),
        saveUninitialized: false,
        resave: false
    }));
    app.use(express.static(DIST_DIR));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    app.get('/startUp', (req, res) => {
        if (req.session.email) {
            const usersCollection = db.collection('Users');
            usersCollection.findOne({
                    "email": req.session.email
                })
                .then(result => {
                    if (result) {
                        res.send(result);
                    } else {
                        return res.sendStatus(500);
                    }
                })
                .catch(() => res.sendStatus(500));
        } else {
            res.sendStatus(401);
        }
    })

    app.post("/register", (req, res) => {
        const usersCollection = db.collection('Users');
        usersCollection.findOne({
            "email": req.body.email
        }).then(userObj => {
            if (userObj) {
                if (req.body.password === userObj.password && req.body.name === userObj.name) {
                    req.session.email = req.body.email;
                    res.send(userObj);
                } else {
                    res.sendStatus(500);
                }
            } else {
                req.session.email = req.body.email;
                usersCollection.insertOne({
                    email: req.body.email,
                    password: req.body.password,
                    name: req.body.name,
                    itemsSold: req.body.itemsSold,
                    itemsBought: req.body.itemsBought,
                    cartItems: req.body.cartItems
                }, (err, response) => {
                    if (err) res.sendStatus(500);
                    return res.send(response.ops[0]);
                })
            }
        })
    });

    app.get('/logout', (req, res) => {
        req.session.destroy(function (err) {
            if (err) {
                console.log(err);
            } else {
                return res.sendStatus(200);
            }
        });
    });

    app.post("/itemCreate", upload.single('uploadPhoto'), (req, res) => {
        let itemObj = {
            itemTitle: req.body.itemTitle,
            itemPrice: req.body.priceAmount,
            imageFileName: req.file.originalname,
            fileLocation: req.file.location,
            userId: req.body.userID,
            _id: req.body.guidItemUnique,
            userName: req.body.userName
        }
        const itemsCollection = db.collection('Items');
        itemsCollection.insertOne(itemObj).then(result => {
            if (result) {
                res.sendStatus(200);
            }
        }).catch(err => {
            console.error(error)
        });
    });

    app.get("/getAllItems", (req, res) => {
        //Get all items from the itemsCollection
        const itemsCollection = db.collection('Items');
        itemsCollection.find({}).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    });

    //TODO: Write the api to add item to Cart
    app.post('/addCart', (req, res) => {
        const usersCollection = db.collection('Users');
        usersCollection.findOneAndUpdate({
            "_id": ObjectId(req.body.userId)
        }, {
            $addToSet: {
                "cartItems": req.body.selectedItem
            }
        }, {
            returnOriginal: false
        }).then(result => {
            if (result) {
                //res.sendStatus(200);
                res.send(result.value);
                console.log(result.value);
            }
        }).catch(err => {
            console.error(err)
        });
    });

    app.post('/cartItems', (req, res) => {
        console.log("cart items ", req.body.cartItems);
        const itemsCollection = db.collection('Items');
        itemsCollection.find(
            ({
                _id: {
                    $in: req.body.cartItems
                }
            })
        ).toArray().then(result => {
            if (result) {
                res.send(result);
                console.log(result);
            }
        }).catch(err => {
            console.error(err)
        });
    });

    app.post('/getSellerList', (req, res) => {
        console.log("seller list", req.body.sellerList);
        var sellerIdList = req.body.sellerList.map(function (sellerId) {
            return ObjectId(sellerId);
        });
        const userCollection = db.collection('Users');
        userCollection.find(
            ({
                _id: {
                    $in: sellerIdList
                }
            })
        ).toArray().then(result => {
            if (result) {
                res.send(result);
                console.log(result);
            }
        }).catch(err => {
            console.error(err)
        });
    });

    app.post('/removeObjFromCart', (req, res) => {
        const userCollection = db.collection('Users');
        userCollection.findOneAndUpdate({
                "_id": ObjectId(req.body.userId)
            }, {
                $pull: {
                    cartItems: req.body.itemId
                }
            }, {
                returnOriginal: false
            })
            .then(result => {
                if (result) {
                    res.send(result.value);
                    console.log(result.value);
                }
            }).catch(err => {
                console.error(err)
            });
    })

    app.get('/', (_, res) => {
        res.sendFile(HTML_FILE);
    });

    app.listen(8000, () => {
        console.log("server started on port 8000");
    });
};

export default makeRoutes;