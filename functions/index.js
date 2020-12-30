const functions = require('firebase-functions');

const express = require('express');
const app = express();

const path = require('path');
//const cors = require('cors');


// Automatically allow cross-origin requests
//app.use(cors({ origin: true }));

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'routes')));

// 「/api/nc」パスの配下の処理を記述
app.use('/api/nc', require('./routes/nc.js'));
app.use('/api/bs', require('./routes/bs.js'));
//exports.app = functions.https.onCall(app);
exports.app = functions.https.onRequest(app);

//app.use('/list', require('./routes/list'));

//404エラー
app.use(function(req, res, next){
    res.status(404).render('404.ejs', {message: "Sorry, page not found", title: "404エラー"});
});