const functions = require('firebase-functions');
const express = require('express');
const path = require('path');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'routes')));

// 「/」パスの配下の処理を記述
app.use('/api', require('./routes/index'));
exports.app = functions.https.onRequest(app);

//app.use('/list', require('./routes/list'));

//404エラー
app.use(function(req, res, next){
    res.status(404).render('404.ejs', {message: "Sorry, page not found", title: "404エラー"});
});